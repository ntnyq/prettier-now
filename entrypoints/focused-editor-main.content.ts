/**
 * @file Main-world focused editor reader and writer
 */

import { defineContentScript } from '#imports'
import { FOCUSED_EDITOR_EVENT } from '@/constants/focusedEditor'
import { createEditorAdapter } from '@/utils/editors'
import type {
  FocusedEditorGetValueRequestDetail,
  FocusedEditorSetValueRequestDetail,
} from '@/types/focusedEditor'

const MATCHES = ['http://*/*', 'https://*/*', 'file:///*']

function getDeepActiveElement(root: Document | ShadowRoot = document) {
  let activeElement = root.activeElement

  while (activeElement?.shadowRoot?.activeElement) {
    activeElement = activeElement.shadowRoot.activeElement
  }

  return activeElement instanceof HTMLElement ? activeElement : null
}

function getAttributeHints(element: HTMLElement) {
  const hints = new Set<string>()
  const candidateElements = [
    element,
    element.closest('.cm-editor'),
    element.closest('.CodeMirror'),
    element.closest('.ace_editor'),
    element.closest('[data-language]'),
    element.closest('[data-lang]'),
    element.closest('[data-mode]'),
  ].filter((item): item is HTMLElement => item instanceof HTMLElement)

  for (const item of candidateElements) {
    hints.add(item.tagName)

    for (const attributeName of [
      'aria-label',
      'class',
      'data-lang',
      'data-language',
      'data-mode',
      'id',
      'name',
      'role',
    ]) {
      const value = item.getAttribute(attributeName)

      if (value) {
        hints.add(value)
      }
    }
  }

  return [...hints]
}

function dispatchInputEvents(element: HTMLElement) {
  for (const eventName of ['input', 'change']) {
    element.dispatchEvent(
      new Event(eventName, {
        bubbles: true,
      }),
    )
  }
}

function readFocusedEditor(requestId: string) {
  const element = getDeepActiveElement()
  const editor = element ? createEditorAdapter(element) : null
  const source = editor?.getValue()

  if (!element || !editor || typeof source !== 'string') {
    window.dispatchEvent(
      new CustomEvent(FOCUSED_EDITOR_EVENT.getValueResponse, {
        detail: {
          errorMessage: 'No focused editor found',
          requestId,
        },
      }),
    )
    return
  }

  window.dispatchEvent(
    new CustomEvent(FOCUSED_EDITOR_EVENT.getValueResponse, {
      detail: {
        hints: getAttributeHints(element),
        requestId,
        source,
      },
    }),
  )
}

function writeFocusedEditor(requestId: string, value: string) {
  const element = getDeepActiveElement()
  const editor = element ? createEditorAdapter(element) : null

  if (!element || !editor) {
    window.dispatchEvent(
      new CustomEvent(FOCUSED_EDITOR_EVENT.setValueResponse, {
        detail: {
          errorMessage: 'No focused editor found',
          requestId,
        },
      }),
    )
    return
  }

  editor.setValue(value)
  dispatchInputEvents(element)

  window.dispatchEvent(
    new CustomEvent(FOCUSED_EDITOR_EVENT.setValueResponse, {
      detail: { requestId },
    }),
  )
}

export default defineContentScript({
  matches: MATCHES,
  world: 'MAIN',
  main() {
    window.addEventListener(FOCUSED_EDITOR_EVENT.getValueRequest, evt => {
      const { requestId } = (
        evt as CustomEvent<FocusedEditorGetValueRequestDetail>
      ).detail

      readFocusedEditor(requestId)
    })

    window.addEventListener(FOCUSED_EDITOR_EVENT.setValueRequest, evt => {
      const { requestId, value } = (
        evt as CustomEvent<FocusedEditorSetValueRequestDetail>
      ).detail

      writeFocusedEditor(requestId, value)
    })
  },
})
