import type { AceEditorInstance, EditorAdapter } from '@/types/editor'

/**
 * Adapter for Ace editor instances.
 */
export class AceEditor implements EditorAdapter {
  /**
   * Underlying Ace instance resolved at the DOM boundary.
   */
  private readonly editor: AceEditorInstance

  /**
   * Bind an adapter to an Ace editor.
   *
   * @param element - Element inside or equal to the editor wrapper.
   */
  constructor(element: HTMLElement) {
    const editor = AceEditor.resolveEditor(element)
    if (!editor) {
      throw new Error('Ace editor is unavailable')
    }
    this.editor = editor
  }

  /**
   * Check whether the element exposes the required Ace operations.
   *
   * @param element - Candidate editor element.
   * @returns Whether an Ace instance can be resolved.
   */
  public static validate(element: HTMLElement) {
    return Boolean(AceEditor.resolveEditor(element))
  }

  /**
   * Resolve and validate Ace's DOM-owned instance.
   *
   * @param element - Element inside the Ace wrapper.
   * @returns Supported Ace instance, when available.
   */
  private static resolveEditor(
    element: HTMLElement,
  ): AceEditorInstance | undefined {
    const wrapper = element.closest('.ace_editor') as
      | (Element & {
          /**
           * Ace's wrapper metadata.
           */
          env?: {
            /**
             * Instance exposed by the page's Ace integration.
             */
            editor?: AceEditorInstance
          }
        })
      | null
    const editor = wrapper?.env?.editor
    return editor
      && typeof editor.getValue === 'function'
      && typeof editor.setValue === 'function'
      ? editor
      : undefined
  }

  /**
   * Read the current editor content.
   *
   * @returns Current source text.
   */
  public getValue() {
    return this.editor.getValue()
  }

  /**
   * Replace the current editor content.
   *
   * @param value - New source text.
   */
  public setValue(value: string) {
    if (this.editor.getReadOnly?.()) {
      throw new Error('Editor is read-only')
    }
    this.editor.setValue(value)
  }
}
