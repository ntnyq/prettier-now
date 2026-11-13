import type { EditorAdapter } from '@/types/editor'

/**
 * Adapter for textarea elements.
 */
export class TextareaEditor implements EditorAdapter {
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
    if (this.editor.disabled || this.editor.readOnly) {
      throw new Error('Editor is read-only')
    }
    this.editor.focus({ preventScroll: true })
    this.editor.selectionStart = 0
    this.editor.selectionEnd = this.editor.value.length
    if (!document.execCommand?.('insertText', false, value)) {
      // Bypass instance setters so controlled inputs can observe the input event.
      const setter = Object.getOwnPropertyDescriptor(
        HTMLTextAreaElement.prototype,
        'value',
      )?.set
      if (setter) {
        setter.call(this.editor, value)
      } else {
        this.editor.value = value
      }
    }
  }
}
