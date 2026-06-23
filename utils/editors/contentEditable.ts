/**
 * Adapter for contenteditable elements.
 */
export class ContentEditableEditor {
  /**
   * Underlying contenteditable element.
   */
  public editor: HTMLElement

  /**
   * Create a contenteditable editor adapter.
   *
   * @param editor - Contenteditable element.
   */
  constructor(editor: HTMLElement) {
    this.editor = editor
  }

  /**
   * Check whether an element is contenteditable.
   *
   * @param element - Element to inspect.
   * @returns Whether the element is contenteditable.
   */
  public static validate(element: HTMLElement) {
    return Boolean(element.getAttribute('contenteditable'))
  }

  /**
   * Read the current element text content.
   *
   * @returns Current text content.
   */
  public getValue() {
    return this.editor.textContent
  }

  /**
   * Replace the current element text content.
   *
   * @param value - New text content.
   */
  public setValue(value: string) {
    this.editor.textContent = value
  }
}
