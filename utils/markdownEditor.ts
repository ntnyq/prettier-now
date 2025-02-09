class CodeMirrorEditor {
  public editor: any

  public isCodeMirrorV6 = false

  constructor(element: HTMLElement) {
    this.editor = this.resolveEditor(element)
  }

  static validate(element: HTMLElement) {
    const wrapper =
      element.closest('.cm-editor') || element.closest('.CodeMirror')
    return !!wrapper
  }

  resolveEditor(elememt: HTMLElement) {
    const editorWrapperV6 = elememt.closest('.cm-editor')
    const editorWrapperV5 = elememt.closest('.CodeMirror')

    if (editorWrapperV6) {
      const editor = (editorWrapperV6.querySelector('.cm-content') as any)
        ?.cmView?.view

      this.isCodeMirrorV6 = true
      this.editor = editor
    } else if (editorWrapperV5) {
      const editor = (editorWrapperV5 as any).CodeMirror

      this.isCodeMirrorV6 = false
      this.editor = editor
    }
  }

  getValue() {
    if (this.isCodeMirrorV6) {
      return this.editor.state.doc.toString()
    }
    return this.editor.getValue()
  }

  setValue(value: string) {
    if (this.isCodeMirrorV6) {
      // https://codemirror.net/examples/change/
      return this.editor.dispatch({
        changes: {
          from: 0,
          to: this.editor.state.doc.length,
          insert: value,
        },
      })
    }
    this.editor.setValue(value)
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
  if (CodeMirrorEditor.validate(element)) {
    return new CodeMirrorEditor(element)
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
