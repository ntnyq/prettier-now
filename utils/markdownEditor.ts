/**
 * @file Markdown Editor Utility
 */

class MonacoEditor {
  public editor: any

  constructor(element: HTMLElement) {
    this.editor = this.resolveEditor(element)
  }

  static validate(element: HTMLElement) {
    const wrapper = element.closest('.monaco-editor')
    return !!wrapper
  }

  resolveEditor(element: HTMLElement) {
    const editorWrapper = element.closest('.monaco-editor')
    if (editorWrapper) {
      // Monaco editor instance is typically stored on the element
      // or accessible via a custom property
      this.editor = (editorWrapper as any).__monaco_editor__
    }
    return this.editor
  }

  getValue() {
    return this.editor?.getValue() || ''
  }

  setValue(value: string) {
    this.editor?.setValue(value)
  }
}

class AceEditor {
  public editor: any

  constructor(editor: any) {
    this.editor = editor
  }

  static validate(element: HTMLElement) {
    const wrapper = element.closest('.ace_editor')
    return wrapper && wrapper
  }

  getValue() {
    return this.editor.getValue()
  }

  setValue(value: string) {
    this.editor.setValue(value)
  }
}

class TextareaEditor {
  public editor: HTMLTextAreaElement

  constructor(editor: HTMLTextAreaElement) {
    this.editor = editor
  }

  static validate(element: HTMLElement) {
    return element.tagName.toUpperCase() === 'TEXTAREA'
  }

  getValue() {
    return this.editor.value
  }

  setValue(value: string) {
    this.editor.selectionStart = 0
    this.editor.selectionEnd = this.editor.value.length
    document.execCommand('insertText', false, value)
  }
}

class ContentEditableEditor {
  public editor: HTMLElement
  constructor(editor: HTMLElement) {
    this.editor = editor
  }

  static validate(element: HTMLElement) {
    return Boolean(element.getAttribute('contenteditable'))
  }

  getValue() {
    return this.editor.textContent
  }

  setValue(value: string) {
    this.editor.textContent = value
  }
}

export function createMarkdownEditor(element: HTMLElement) {
  if (MonacoEditor.validate(element)) {
    return new MonacoEditor(element)
  }
  if (AceEditor.validate(element)) {
    return new AceEditor(element)
  }
  if (TextareaEditor.validate(element)) {
    return new TextareaEditor(element as HTMLTextAreaElement)
  }
  if (ContentEditableEditor.validate(element)) {
    return new ContentEditableEditor(element)
  }
  return null
}
