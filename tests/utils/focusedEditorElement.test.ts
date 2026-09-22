import { afterEach, describe, expect, it } from 'vitest'
import {
  clearFocusedEditorElement,
  rememberFocusedEditorElement,
  resolveFocusedEditorElement,
} from '@/utils/focusedEditorElement'

afterEach(() => {
  clearFocusedEditorElement()
  document.body.innerHTML = ''
})

describe('focused editor element resolver', () => {
  it('uses the last editable context target when focus moves back to the page', () => {
    const textarea = document.createElement('textarea')
    const pageBodyFocusTarget = document.createElement('button')

    document.body.append(textarea, pageBodyFocusTarget)
    textarea.focus()
    rememberFocusedEditorElement(textarea)
    pageBodyFocusTarget.focus()

    expect(resolveFocusedEditorElement()).toBe(textarea)
  })

  it('does not reuse a removed editor element', () => {
    const textarea = document.createElement('textarea')

    document.body.append(textarea)
    rememberFocusedEditorElement(textarea)
    textarea.remove()

    expect(resolveFocusedEditorElement()).toBeNull()
  })

  it('remembers editable ancestors from nested context menu targets', () => {
    const editor = document.createElement('div')
    const child = document.createElement('span')

    editor.contentEditable = 'true'
    editor.append(child)
    document.body.append(editor)

    rememberFocusedEditorElement(child)

    expect(resolveFocusedEditorElement()).toBe(editor)
  })
})
