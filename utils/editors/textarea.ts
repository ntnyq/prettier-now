/**
 * Adapter for textarea elements.
 */
export class TextareaEditor {
  /**
   * Underlying textarea element.
   */
  public editor: HTMLTextAreaElement

  /**
   * Create a textarea editor adapter.
   *
   * @param editor - Textarea element.
   */
  constructor(editor: HTMLTextAreaElement) {
    this.editor = editor
  }

  /**
   * Check whether an element is a textarea.
   *
   * @param element - Element to inspect.
   * @returns Whether the element is a textarea.
   */
  public static validate(element: HTMLElement) {
    return element.tagName.toUpperCase() === 'TEXTAREA'
  }

  /**
   * Read the current textarea content.
   *
   * @returns Current textarea content.
   */
  public getValue() {
    return this.editor.value
  }

  /**
   * Replace the current textarea content.
   *
   * @param value - New textarea content.
   */
  public setValue(value: string) {
    this.editor.selectionStart = 0
    this.editor.selectionEnd = this.editor.value.length
    document.execCommand('insertText', false, value)
  }
}
