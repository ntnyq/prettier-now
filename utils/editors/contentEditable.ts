const BLOCK_TAGS = new Set([
  'DIV',
  'P',
  'PRE',
  'LI',
  'UL',
  'OL',
  'BLOCKQUOTE',
  'SECTION',
  'ARTICLE',
])

/**
 * Extract editable text while retaining block boundaries and explicit breaks.
 *
 * @param node - Editable element or descendant to read.
 * @returns Source text with DOM line breaks preserved.
 */
function readEditableText(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? ''
  }
  if (node instanceof HTMLElement && node.tagName === 'BR') {
    return '\n'
  }
  let text = ''
  for (const child of node.childNodes) {
    const isBlock =
      child instanceof HTMLElement && BLOCK_TAGS.has(child.tagName)
    if (isBlock && text && !text.endsWith('\n')) {
      text += '\n'
    }
    text += readEditableText(child)
    if (isBlock && child.nextSibling && !text.endsWith('\n')) {
      text += '\n'
    }
  }
  return text
}

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
    const value = element.getAttribute('contenteditable')?.toLowerCase()
    return ['', 'true', 'plaintext-only'].includes(value ?? 'false')
  }

  /**
   * Read the current element text content.
   *
   * @returns Current text content.
   */
  public getValue() {
    return readEditableText(this.editor)
  }

  /**
   * Replace the current element text content.
   *
   * @param value - New text content.
   */
  public setValue(value: string) {
    const fragment = document.createDocumentFragment()
    for (const [index, line] of value.split('\n').entries()) {
      if (index) {
        fragment.append(document.createElement('br'))
      }
      fragment.append(document.createTextNode(line))
    }
    this.editor.replaceChildren(fragment)
  }
}
