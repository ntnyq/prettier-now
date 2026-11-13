import type { EditorView } from '@codemirror/view'

/**
 * DOM metadata exposed by older and newer CodeMirror 6 releases.
 */
interface CodeMirrorContentElement extends HTMLElement {
  /**
   * View metadata used before the tile-based renderer.
   */
  cmView?: {
    /**
     * Owning editor view.
     */
    view?: EditorView
  }
  /**
   * Tile metadata used by the current renderer.
   */
  cmTile?: {
    /**
     * Root tile containing the editor view.
     */
    root?: {
      /**
       * Owning editor view.
       */
      view?: EditorView
    }
  }
}

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
    this.resolveEditor(element)
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

    if (!wrapper) {
      return false
    }

    const editor = wrapper.classList.contains('cm-editor')
      ? CodeMirrorEditor.resolveV6Editor(wrapper)
      : (wrapper as any).CodeMirror

    return Boolean(editor)
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
      const editor = CodeMirrorEditor.resolveV6Editor(editorWrapperV6)

      this.isCodeMirrorV6 = true
      this.editor = editor
    } else if (editorWrapperV5) {
      const editor = (editorWrapperV5 as any).CodeMirror

      this.isCodeMirrorV6 = false
      this.editor = editor
    }
  }

  /**
   * Resolve a CodeMirror 6 view across both DOM metadata layouts.
   *
   * @param wrapper - Editor wrapper containing the editable surface.
   * @returns Owning view when available.
   */
  private static resolveV6Editor(wrapper: Element) {
    const content =
      wrapper.querySelector<CodeMirrorContentElement>('.cm-content')
    return content?.cmView?.view ?? content?.cmTile?.root?.view
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
    if (
      this.isCodeMirrorV6
        ? this.editor.state.readOnly
          || this.editor.contentDOM?.getAttribute('contenteditable') === 'false'
        : this.editor.getOption?.('readOnly')
    ) {
      throw new Error('Editor is read-only')
    }
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
