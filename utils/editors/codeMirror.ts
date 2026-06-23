/**
 * Adapter for CodeMirror v5 and v6 editor instances.
 */
export class CodeMirrorEditor {
  /**
   * Resolved CodeMirror editor instance.
   */
  public editor: any

  /**
   * Whether the resolved editor is CodeMirror v6.
   */
  public isCodeMirrorV6 = false

  /**
   * Create a CodeMirror editor adapter.
   *
   * @param element - Element inside or equal to a CodeMirror editor.
   */
  constructor(element: HTMLElement) {
    this.editor = this.resolveEditor(element)
  }

  /**
   * Check whether an element belongs to a CodeMirror editor.
   *
   * @param element - Element to inspect.
   * @returns Whether a CodeMirror wrapper was found.
   */
  public static validate(element: HTMLElement) {
    const wrapper =
      element.closest('.cm-editor') || element.closest('.CodeMirror')

    return Boolean(wrapper)
  }

  /**
   * Resolve the underlying CodeMirror editor instance.
   *
   * @param element - Element inside or equal to a CodeMirror editor.
   */
  public resolveEditor(element: HTMLElement) {
    const editorWrapperV6 = element.closest('.cm-editor')
    const editorWrapperV5 = element.closest('.CodeMirror')

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

  /**
   * Read the current editor content.
   *
   * @returns Current editor content.
   */
  public getValue() {
    if (this.isCodeMirrorV6) {
      return this.editor.state.doc.toString()
    }

    return this.editor.getValue()
  }

  /**
   * Replace the current editor content.
   *
   * @param value - New editor content.
   */
  public setValue(value: string) {
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
