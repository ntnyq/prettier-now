/**
 * Common adapter contract for markdown-like editor instances.
 */
export interface MarkdownEditor<Editor = unknown> {
  /**
   * Underlying editor instance.
   */
  editor: Editor

  /**
   * Read the current editor content.
   *
   * @returns Current editor content.
   */
  getValue: () => string

  /**
   * Replace the current editor content.
   *
   * @param value - New editor content.
   */
  setValue: (value: string) => void
}
