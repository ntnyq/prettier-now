/**
 * Operations exposed by a webpage editor adapter.
 */
export interface EditorAdapter {
  /**
   * Read the editor's current source text.
   */
  getValue: () => string
  /**
   * Replace editable source, rejecting a read-only editor.
   */
  setValue: (value: string) => void
}

/**
 * Ace methods used by the webpage editor adapter.
 */
export interface AceEditorInstance extends EditorAdapter {
  /**
   * Report whether the editor allows changes.
   */
  getReadOnly?: () => boolean
}

/**
 * CodeMirror 5 methods used by the webpage editor adapter.
 */
export interface CodeMirror5Instance extends EditorAdapter {
  /**
   * Read the editor's read-only configuration.
   */
  getOption?: (name: 'readOnly') => boolean | string
}
