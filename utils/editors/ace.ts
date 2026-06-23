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
   * @param element - Element inside or equal to an Ace editor.
   */
  constructor(element: HTMLElement) {
    this.editor = this.resolveEditor(element)
  }

  /**
   * Check whether an element belongs to an Ace editor.
   *
   * @param element - Element to inspect.
   * @returns Ace editor wrapper when found.
   */
  public static validate(element: HTMLElement) {
    const wrapper = element.closest('.ace_editor')

    return Boolean(wrapper && (wrapper as any).env?.editor)
  }

  /**
   * Resolve the underlying Ace editor instance.
   *
   * @param element - Element inside or equal to an Ace editor.
   * @returns Ace editor instance.
   */
  public resolveEditor(element: HTMLElement) {
    return (element.closest('.ace_editor') as any)?.env?.editor
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
