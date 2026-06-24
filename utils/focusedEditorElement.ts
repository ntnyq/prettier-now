/**
 * @file Resolve the editor element targeted by focused editor formatting
 */

import { createEditorAdapter } from '@/utils/editors'

let lastFocusedEditorElement: HTMLElement | null = null

function getDeepActiveElement(root: Document | ShadowRoot = document) {
  let activeElement = root.activeElement

  while (activeElement?.shadowRoot?.activeElement) {
    activeElement = activeElement.shadowRoot.activeElement
  }

  return activeElement instanceof HTMLElement ? activeElement : null
}

function findEditorElement(element: HTMLElement | null) {
  if (!element) {
    return null
  }

  const candidates = [
    element,
    element.closest('.cm-editor'),
    element.closest('.CodeMirror'),
    element.closest('.ace_editor'),
    element.closest('textarea'),
    element.closest('[contenteditable]'),
  ]

  return (
    candidates.find(
      (candidate): candidate is HTMLElement =>
        candidate instanceof HTMLElement
        && Boolean(createEditorAdapter(candidate)),
    ) ?? null
  )
}

function isUsableEditorElement(element: HTMLElement | null) {
  return Boolean(element && element.isConnected && createEditorAdapter(element))
}

export function clearFocusedEditorElement() {
  lastFocusedEditorElement = null
}

export function rememberFocusedEditorElement(target: EventTarget | null) {
  const element = target instanceof HTMLElement ? target : null
  const editorElement = findEditorElement(element)

  if (editorElement) {
    lastFocusedEditorElement = editorElement
  }
}

export function resolveFocusedEditorElement() {
  const activeEditorElement = findEditorElement(getDeepActiveElement())

  if (activeEditorElement) {
    lastFocusedEditorElement = activeEditorElement
    return activeEditorElement
  }

  if (isUsableEditorElement(lastFocusedEditorElement)) {
    return lastFocusedEditorElement
  }

  clearFocusedEditorElement()
  return null
}
