import type { EditorView } from '@codemirror/view'
import type { CodeMirror5Instance, EditorAdapter } from '@/types/editor'

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
 * Resolved CodeMirror instance with its version-specific operations.
 */
type CodeMirrorInstance =
  | {
      /**
       * CodeMirror's legacy editor API.
       */
      version: 5
      /**
       * Legacy instance exposed on its wrapper.
       */
      editor: CodeMirror5Instance
    }
  | {
      /**
       * CodeMirror's transaction-based editor API.
       */
      version: 6
      /**
       * View owning the editable document.
       */
      editor: EditorView
    }

/**
 * Adapter for CodeMirror v5 and v6 editor instances.
 */
export class CodeMirrorEditor implements EditorAdapter {
  /**
   * Resolved instance and its API version.
   */
  private readonly instance: CodeMirrorInstance

  /**
   * Bind to a supported CodeMirror instance.
   *
   * @param element - Element inside the editor wrapper.
   */
  constructor(element: HTMLElement) {
    const instance = CodeMirrorEditor.resolveEditor(element)
    if (!instance) {
      throw new Error('CodeMirror editor is unavailable')
    }
    this.instance = instance
  }

  /**
   * Check whether a supported instance belongs to the element.
   *
   * @param element - Candidate editor element.
   * @returns Whether an instance can be resolved.
   */
  public static validate(element: HTMLElement) {
    return Boolean(CodeMirrorEditor.resolveEditor(element))
  }

  /**
   * Resolve version-specific DOM metadata at the page boundary.
   *
   * @param element - Element inside the editor wrapper.
   * @returns Instance with its matching API version, when available.
   */
  private static resolveEditor(
    element: HTMLElement,
  ): CodeMirrorInstance | undefined {
    const wrapper =
      element.closest('.cm-editor') || element.closest('.CodeMirror')
    if (!wrapper) {
      return
    }
    if (wrapper.classList.contains('cm-editor')) {
      const content =
        wrapper.querySelector<CodeMirrorContentElement>('.cm-content')
      const editor = content?.cmView?.view ?? content?.cmTile?.root?.view
      return editor ? { version: 6, editor } : undefined
    }
    const editor = (
      wrapper as Element & {
        /**
         * Legacy instance attached by CodeMirror 5.
         */
        CodeMirror?: CodeMirror5Instance
      }
    ).CodeMirror
    return editor
      && typeof editor.getValue === 'function'
      && typeof editor.setValue === 'function'
      ? { version: 5, editor }
      : undefined
  }

  /**
   * Read the current editor content.
   *
   * @returns Current source text.
   */
  public getValue() {
    const instance = this.instance
    return instance.version === 6
      ? instance.editor.state.doc.toString()
      : instance.editor.getValue()
  }

  /**
   * Replace editable source using the version's native update API.
   *
   * @param value - New source text.
   */
  public setValue(value: string) {
    const instance = this.instance
    if (instance.version === 6) {
      const editor = instance.editor
      if (
        editor.state.readOnly
        || editor.contentDOM.getAttribute('contenteditable') === 'false'
      ) {
        throw new Error('Editor is read-only')
      }
      editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: value },
      })
      return
    }
    if (instance.editor.getOption?.('readOnly')) {
      throw new Error('Editor is read-only')
    }
    instance.editor.setValue(value)
  }
}
