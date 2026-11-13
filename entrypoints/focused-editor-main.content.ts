/**
 * @file Main-world focused editor reader and writer
 */

import * as v from 'valibot'
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
import {
  FocusedEditorReadRequestSchema,
  FocusedEditorWriteRequestSchema,
  parseFocusedEditorEventDetail,
} from '@/utils/focusedEditorProtocol'

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

  // Explicit metadata on any editor ancestor outranks labels and CSS classes.
  for (const attributeName of [
    'data-language',
    'data-lang',
    'data-mode',
    'aria-label',
    'class',
    'id',
    'name',
    'role',
  ]) {
    for (const item of candidateElements) {
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
        detail: JSON.stringify({
          hints: getAttributeHints(element),
          requestId,
          source,
        }),
      }),
    )
  } catch (error) {
    clearEditorSnapshot()
    window.dispatchEvent(
      new CustomEvent(FOCUSED_EDITOR_EVENT.getValueResponse, {
        detail: JSON.stringify({
          errorMessage:
            error instanceof Error ? error.message : 'Failed to read editor',
          requestId,
        }),
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
        detail: JSON.stringify({ requestId }),
      }),
    )
  } catch (error) {
    window.dispatchEvent(
      new CustomEvent(FOCUSED_EDITOR_EVENT.setValueResponse, {
        detail: JSON.stringify({
          errorMessage:
            error instanceof Error ? error.message : 'Failed to update editor',
          requestId,
        }),
      }),
    )
  }
}

export default defineContentScript({
  matches: MATCHES,
  allFrames: true,
  matchAboutBlank: true,
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
      const parsed = v.safeParse(
        FocusedEditorReadRequestSchema,
        parseFocusedEditorEventDetail((evt as CustomEvent<unknown>).detail),
      )
      if (parsed.success) {
        readFocusedEditor(parsed.output.requestId)
      }
    })

    window.addEventListener(FOCUSED_EDITOR_EVENT.setValueRequest, evt => {
      const parsed = v.safeParse(
        FocusedEditorWriteRequestSchema,
        parseFocusedEditorEventDetail((evt as CustomEvent<unknown>).detail),
      )
      if (parsed.success) {
        writeFocusedEditor(parsed.output.requestId, parsed.output.value)
      }
    })
  },
})
