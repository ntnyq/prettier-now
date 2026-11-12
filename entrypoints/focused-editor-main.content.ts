/**
 * @file Main-world focused editor reader and writer
 */

import { defineContentScript } from '#imports'
import {
  FOCUSED_EDITOR_EVENT,
  FOCUSED_EDITOR_FORMAT_TIMEOUT,
  FOCUSED_EDITOR_REQUEST_TIMEOUT,
} from '@/constants/focusedEditor'
import { createEditorAdapter } from '@/utils/editors'
import {
  rememberFocusedEditorElement,
  resolveFocusedEditorElement,
} from '@/utils/focusedEditorElement'
import type {
  FocusedEditorGetValueRequestDetail,
  FocusedEditorSetValueRequestDetail,
} from '@/types/focusedEditor'

const MATCHES = ['http://*/*', 'https://*/*', 'file:///*']

/**
 * Editor and source bound to the most recent formatting request.
 */
interface FocusedEditorSnapshot {
  /**
   * Original request identifier, also required when writing the result.
   */
  requestId: string
  /**
   * DOM element that owned the source at read time.
   */
  element: HTMLElement
  /**
   * Adapter bound to the original editor instance.
   */
  editor: NonNullable<ReturnType<typeof createEditorAdapter>>
  /**
   * Source used to reject writes after intervening edits.
   */
  source: string
}

let editorSnapshot: FocusedEditorSnapshot | undefined
let snapshotTimeout: number | undefined

/**
 * Release editor references after completion, replacement, or timeout.
 */
function clearEditorSnapshot() {
  window.clearTimeout(snapshotTimeout)
  snapshotTimeout = undefined
  editorSnapshot = undefined
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
  clearEditorSnapshot()
  try {
    const element = resolveFocusedEditorElement()
    const editor = element ? createEditorAdapter(element) : null
    const source = editor?.getValue()

    if (!element || !editor || typeof source !== 'string') {
      throw new Error('No focused editor found')
    }

    editorSnapshot = { requestId, element, editor, source }
    snapshotTimeout = window.setTimeout(
      clearEditorSnapshot,
      2 * (FOCUSED_EDITOR_FORMAT_TIMEOUT + FOCUSED_EDITOR_REQUEST_TIMEOUT),
    )

    window.dispatchEvent(
      new CustomEvent(FOCUSED_EDITOR_EVENT.getValueResponse, {
        detail: { hints: getAttributeHints(element), requestId, source },
      }),
    )
  } catch (error) {
    clearEditorSnapshot()
    window.dispatchEvent(
      new CustomEvent(FOCUSED_EDITOR_EVENT.getValueResponse, {
        detail: {
          errorMessage:
            error instanceof Error ? error.message : 'Failed to read editor',
          requestId,
        },
      }),
    )
  }
}

function writeFocusedEditor(requestId: string, value: string) {
  try {
    const snapshot = editorSnapshot
    if (!snapshot || snapshot.requestId !== requestId) {
      throw new Error('Formatting request is no longer active')
    }
    clearEditorSnapshot()
    const { element, editor, source } = snapshot
    if (!element.isConnected || resolveFocusedEditorElement() !== element) {
      throw new Error('Focused editor changed while formatting')
    }
    if (editor.getValue() !== source) {
      throw new Error('Editor content changed while formatting')
    }
    editor.setValue(value)
    dispatchInputEvents(element)
    window.dispatchEvent(
      new CustomEvent(FOCUSED_EDITOR_EVENT.setValueResponse, {
        detail: { requestId },
      }),
    )
  } catch (error) {
    window.dispatchEvent(
      new CustomEvent(FOCUSED_EDITOR_EVENT.setValueResponse, {
        detail: {
          errorMessage:
            error instanceof Error ? error.message : 'Failed to update editor',
          requestId,
        },
      }),
    )
  }
}

export default defineContentScript({
  matches: MATCHES,
  world: 'MAIN',
  main() {
    for (const eventName of ['contextmenu', 'focusin', 'pointerdown']) {
      window.addEventListener(
        eventName,
        evt => {
          rememberFocusedEditorElement(evt.target)
        },
        {
          capture: true,
        },
      )
    }

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
