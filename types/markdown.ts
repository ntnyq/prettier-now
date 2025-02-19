/**
 * Markdown editor
 */
export interface MarkdownEditor<Editor = any> {
  editor: Editor
  getValue: () => string
  setValue: (value: string) => void
}
