/**
 * @file Isolated-world focused editor formatter bridge
 */

import { browser, defineContentScript } from '#imports'
import {
  FOCUSED_EDITOR_EVENT,
  FOCUSED_EDITOR_MESSAGE,
  FOCUSED_EDITOR_REQUEST_TIMEOUT,
} from '@/constants/focusedEditor'
import { LANGUAGE_ID } from '@/constants/language'
import type {
  FocusedEditorGetValueResponseDetail,
  FocusedEditorSetValueResponseDetail,
  FormatSourceResponse,
} from '@/types/focusedEditor'

const MATCHES = ['http://*/*', 'https://*/*', 'file:///*']

function createRequestId() {
  return crypto.randomUUID()
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
      const detail = (evt as CustomEvent<FocusedEditorGetValueResponseDetail>)
        .detail

      if (detail.requestId !== requestId) {
        return
      }

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
      const detail = (evt as CustomEvent<FocusedEditorSetValueResponseDetail>)
        .detail

      if (detail.requestId !== requestId) {
        return
      }

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

async function formatFocusedEditor() {
  const requestId = createRequestId()
  const editorValue = await waitForEditorValue(requestId)

  if (editorValue.errorMessage) {
    throw new Error(editorValue.errorMessage)
  }

  if (!editorValue.source?.trim()) {
    throw new Error('Nothing to format')
  }

  const formatResponse = (await browser.runtime.sendMessage({
    fallbackLanguageId: LANGUAGE_ID.markdown,
    hints: editorValue.hints,
    source: editorValue.source,
    type: FOCUSED_EDITOR_MESSAGE.formatSource,
    url: window.location.href,
  })) as FormatSourceResponse

  if (!formatResponse.ok) {
    throw new Error(formatResponse.errorMessage)
  }

  const writeResponse = await waitForEditorWrite(
    createRequestId(),
    formatResponse.formatted,
  )

  if (writeResponse.errorMessage) {
    throw new Error(writeResponse.errorMessage)
  }
}

export default defineContentScript({
  matches: MATCHES,
  main() {
    browser.runtime.onMessage.addListener(async message => {
      if (message?.type !== FOCUSED_EDITOR_MESSAGE.formatFocusedEditor) {
        return
      }

      await formatFocusedEditor()
    })
  },
})
