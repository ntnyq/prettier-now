/**
 * @file Isolated-world focused editor formatter bridge
 */

import * as v from 'valibot'
import { browser, defineContentScript } from '#imports'
import {
  FOCUSED_EDITOR_EVENT,
  FOCUSED_EDITOR_FORMAT_TIMEOUT,
  FOCUSED_EDITOR_FORMATTER_PAGE,
  FOCUSED_EDITOR_MESSAGE,
  FOCUSED_EDITOR_REQUEST_TIMEOUT,
} from '@/constants/focusedEditor'
import { LANGUAGE_ID } from '@/constants/language'
import {
  FocusedEditorCommandSchema,
  FocusedEditorFormatterResponseSchema,
  FocusedEditorReadResponseSchema,
  FocusedEditorWriteResponseSchema,
} from '@/utils/focusedEditorProtocol'
import type {
  FocusedEditorGetValueResponseDetail,
  FocusedEditorSetValueResponseDetail,
} from '@/types/focusedEditor'

const MATCHES = ['http://*/*', 'https://*/*', 'file:///*']
const ERROR_TOAST_ID = 'prettier-now-focused-editor-error'
const FORMATTER_FRAME_ID = 'prettier-now-focused-editor-formatter'

let formatterFramePromise: Promise<HTMLIFrameElement> | undefined
let formatterFrame: HTMLIFrameElement | undefined

function createRequestId() {
  // Content scripts also run on HTTP pages, where randomUUID is unavailable.
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), byte =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
}

function getExtensionOrigin() {
  return new URL(browser.runtime.getURL('/')).origin
}

function getFormatterFrame() {
  if (formatterFramePromise && formatterFrame?.isConnected) {
    return formatterFramePromise
  }

  const frame = document.createElement('iframe')
  formatterFrame = frame

  formatterFramePromise = new Promise((resolve, reject) => {
    frame.id = FORMATTER_FRAME_ID
    frame.src = browser.runtime.getURL(`/${FOCUSED_EDITOR_FORMATTER_PAGE}`)
    frame.style.display = 'none'
    frame.setAttribute('aria-hidden', 'true')

    const timeoutId = window.setTimeout(
      handleError,
      FOCUSED_EDITOR_FORMAT_TIMEOUT,
    )

    function cleanup() {
      window.clearTimeout(timeoutId)
      frame.removeEventListener('load', handleLoad)
      frame.removeEventListener('error', handleError)
    }

    function handleLoad() {
      cleanup()
      resolve(frame)
    }

    function handleError() {
      cleanup()
      frame.remove()
      if (formatterFrame === frame) {
        formatterFrame = undefined
        formatterFramePromise = undefined
      }
      reject(new Error('Failed to load formatter runtime'))
    }

    frame.addEventListener('load', handleLoad, { once: true })
    frame.addEventListener('error', handleError, { once: true })

    document.documentElement.append(frame)
  })

  return formatterFramePromise
}

function waitForEditorValue(requestId: string) {
  return new Promise<FocusedEditorGetValueResponseDetail>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      window.removeEventListener(
        FOCUSED_EDITOR_EVENT.getValueResponse,
        handleResponse,
      )
      reject(new Error('No focused editor found'))
    }, FOCUSED_EDITOR_REQUEST_TIMEOUT)

    function handleResponse(evt: Event) {
      const parsed = v.safeParse(
        FocusedEditorReadResponseSchema,
        (evt as CustomEvent<unknown>).detail,
      )
      if (!parsed.success || parsed.output.requestId !== requestId) {
        return
      }
      const detail = parsed.output

      window.clearTimeout(timeoutId)
      window.removeEventListener(
        FOCUSED_EDITOR_EVENT.getValueResponse,
        handleResponse,
      )
      resolve(detail)
    }

    window.addEventListener(
      FOCUSED_EDITOR_EVENT.getValueResponse,
      handleResponse,
    )
    window.dispatchEvent(
      new CustomEvent(FOCUSED_EDITOR_EVENT.getValueRequest, {
        detail: { requestId },
      }),
    )
  })
}

function waitForEditorWrite(requestId: string, value: string) {
  return new Promise<FocusedEditorSetValueResponseDetail>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      window.removeEventListener(
        FOCUSED_EDITOR_EVENT.setValueResponse,
        handleResponse,
      )
      reject(new Error('Failed to update focused editor'))
    }, FOCUSED_EDITOR_REQUEST_TIMEOUT)

    function handleResponse(evt: Event) {
      const parsed = v.safeParse(
        FocusedEditorWriteResponseSchema,
        (evt as CustomEvent<unknown>).detail,
      )
      if (!parsed.success || parsed.output.requestId !== requestId) {
        return
      }
      const detail = parsed.output

      window.clearTimeout(timeoutId)
      window.removeEventListener(
        FOCUSED_EDITOR_EVENT.setValueResponse,
        handleResponse,
      )
      resolve(detail)
    }

    window.addEventListener(
      FOCUSED_EDITOR_EVENT.setValueResponse,
      handleResponse,
    )
    window.dispatchEvent(
      new CustomEvent(FOCUSED_EDITOR_EVENT.setValueRequest, {
        detail: { requestId, value },
      }),
    )
  })
}

async function formatViaFormatterFrame(
  editorValue: FocusedEditorGetValueResponseDetail,
) {
  const frame = await getFormatterFrame()
  const targetWindow = frame.contentWindow

  if (!targetWindow) {
    throw new Error('Formatter runtime is not available')
  }

  const requestId = createRequestId()

  return new Promise<string>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      window.removeEventListener('message', handleResponse)
      frame.remove()
      reject(new Error('Formatter runtime timed out'))
    }, FOCUSED_EDITOR_FORMAT_TIMEOUT)

    function handleResponse(evt: MessageEvent<unknown>) {
      if (evt.origin !== getExtensionOrigin() || evt.source !== targetWindow) {
        return
      }

      const parsed = v.safeParse(FocusedEditorFormatterResponseSchema, evt.data)
      if (!parsed.success || parsed.output.requestId !== requestId) {
        return
      }
      const response = parsed.output

      window.clearTimeout(timeoutId)
      window.removeEventListener('message', handleResponse)

      if (!response.ok) {
        reject(new Error(response.errorMessage))
        return
      }

      resolve(response.formatted)
    }

    window.addEventListener('message', handleResponse)
    targetWindow.postMessage(
      {
        fallbackLanguageId: LANGUAGE_ID.markdown,
        hints: editorValue.hints,
        requestId,
        source: editorValue.source,
        type: FOCUSED_EDITOR_MESSAGE.formatterFormatRequest,
        url: window.location.href,
      },
      getExtensionOrigin(),
    )
  })
}

async function formatFocusedEditor() {
  const requestId = createRequestId()
  const editorValue = await waitForEditorValue(requestId)

  if (editorValue.errorMessage) {
    throw new Error(editorValue.errorMessage)
  }

  if (!editorValue.source?.trim()) {
    throw new Error('Nothing to format')
  }

  const formatted = await formatViaFormatterFrame(editorValue)

  const writeResponse = await waitForEditorWrite(requestId, formatted)

  if (writeResponse.errorMessage) {
    throw new Error(writeResponse.errorMessage)
  }
}

function showErrorMessage(message: string) {
  document.querySelector(`#${ERROR_TOAST_ID}`)?.remove()

  const toast = document.createElement('div')

  toast.id = ERROR_TOAST_ID
  toast.textContent = message
  toast.style.position = 'fixed'
  toast.style.right = '16px'
  toast.style.bottom = '16px'
  toast.style.zIndex = '2147483647'
  toast.style.maxWidth = '360px'
  toast.style.padding = '10px 12px'
  toast.style.borderRadius = '8px'
  toast.style.background = '#b42318'
  toast.style.color = '#fff'
  toast.style.font = '13px/1.4 system-ui, sans-serif'
  toast.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.18)'

  document.documentElement.append(toast)
  window.setTimeout(() => {
    toast.remove()
  }, 4000)
}

export default defineContentScript({
  matches: MATCHES,
  allFrames: true,
  matchAboutBlank: true,
  main() {
    browser.runtime.onMessage.addListener(async message => {
      const parsed = v.safeParse(FocusedEditorCommandSchema, message)
      if (!parsed.success) {
        return
      }

      if (parsed.output.requireFocus) {
        let activeElement = document.activeElement
        while (activeElement?.shadowRoot?.activeElement) {
          activeElement = activeElement.shadowRoot.activeElement
        }
        if (
          !document.hasFocus()
          || activeElement instanceof HTMLIFrameElement
        ) {
          return
        }
      }

      try {
        await formatFocusedEditor()
      } catch (error: unknown) {
        showErrorMessage(
          error instanceof Error ? error.message : 'Failed to format editor',
        )
      }
    })
  },
})
