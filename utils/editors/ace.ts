/**
 * Adapter for Ace editor instances.
 */
export class AceEditor {
  /**
   * Underlying Ace editor instance.
   */
  public editor: any

  /**
   * Create an Ace editor adapter.
   *
   * @param editor - Ace editor instance.
   */
  constructor(editor: any) {
    this.editor = editor
  }

  /**
   * Check whether an element belongs to an Ace editor.
   *
   * @param element - Element to inspect.
   * @returns Ace editor wrapper when found.
   */
  public static validate(element: HTMLElement) {
    return element.closest('.ace_editor')
  }

  /**
   * Read the current editor content.
   *
   * @returns Current editor content.
   */
  public getValue() {
    return this.editor.getValue()
  }

  /**
   * Replace the current editor content.
   *
   * @param value - New editor content.
   */
  public setValue(value: string) {
    this.editor.setValue(value)
  }
}
