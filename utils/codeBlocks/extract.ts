import { CODE_BLOCK_MAX_BYTES } from '@/constants/codeBlocks'
import { inferExtractedCodeLanguage } from './language'
import type { ExtractedCodeBlock } from '@/types/codeBlocks'
import type { CodeBlockError } from './protocol'

const excluded =
  'textarea, [contenteditable]:not([contenteditable="false"]), .CodeMirror, .cm-editor, .ace_editor, .monaco-editor, prettier-now-code-blocks'
/**
 * Either a complete, unmodified snapshot or a recoverable extraction failure.
 */
export type ExtractionResult =
  | {
      /**
       * Indicates that all text was read within the extraction budget.
       */
      ok: true
      /**
       * Original source and language evidence.
       */
      item: ExtractedCodeBlock
    }
  | {
      /**
       * Indicates that no partial snapshot should be imported.
       */
      ok: false
      /**
       * Stable recovery code for the user interface.
       */
      error: CodeBlockError
    }

const decoration =
  'button, .line-numbers-rows, .line-numbers-wrapper, .hljs-ln-numbers, prettier-now-code-blocks, script, style'

/**
 * Check rendered document visibility, independently of viewport intersection.
 */
export function isCodeBlockVisible(element: Element) {
  if (
    !element.isConnected
    || element.closest(excluded)
    || element.getRootNode() !== document
  ) {
    return false
  }
  let ancestor: Element | null = element
  for (let depth = 0; ancestor; depth += 1, ancestor = ancestor.parentElement) {
    if (depth > 200 || ancestor.hasAttribute('hidden')) {
      return false
    }
    const style = getComputedStyle(ancestor)
    if (
      style.display === 'none'
      || style.visibility === 'hidden'
      || style.visibility === 'collapse'
      || style.contentVisibility === 'hidden'
    ) {
      return false
    }
  }
  return true
}

/**
 * Read bounded DOM text without whitespace cleanup or recursive stack growth.
 * Verified Shiki line spans add a separator only when the DOM omits it.
 */
export function extractCodeBlock(
  pre: Element,
  blockIndex = 1,
): ExtractionResult {
  if (!pre.matches('pre') || !isCodeBlockVisible(pre)) {
    return { ok: false, error: 'BLOCK_STALE' }
  }
  const codes = pre.querySelectorAll('code')
  if (codes.length > 1 || pre.querySelector('pre')) {
    return { ok: false, error: 'STRUCTURE_UNCERTAIN' }
  }
  const source = codes[0] ?? pre
  if (!isCodeBlockVisible(source)) {
    return { ok: false, error: 'BLOCK_STALE' }
  }
  const walker = document.createTreeWalker(source, NodeFilter.SHOW_ALL)
  const chunks: string[] = []
  const started = performance.now()
  let bytes = 0
  let nodes = 0
  let previousLine = false
  let lineChunkStart = 0
  let uncertain = false
  let node: Node | null = walker.nextNode()
  const encoder = new TextEncoder()
  while (node) {
    if (
      ++nodes > 20000
      || (nodes % 128 === 0 && performance.now() - started > 8)
    ) {
      return { ok: false, error: 'BLOCK_TOO_LARGE' }
    }
    let text = ''
    if (node instanceof Element) {
      if (node.matches(decoration) || node.matches(excluded)) {
        // Skip a decoration subtree without walking its potentially large contents.
        let next = walker.nextSibling()
        while (!next && walker.parentNode() && walker.currentNode !== source) {
          next = walker.nextSibling()
        }
        node = next
        continue
      }
      if (node.tagName === 'BR') {
        text = '\n'
      }
      if (node.parentElement === source && node.matches('span.line')) {
        if (
          previousLine
          && !chunks.slice(lineChunkStart).join('').endsWith('\n')
        ) {
          text = '\n'
        }
        previousLine = true
      } else if (
        node.matches('div, li, tr')
        || (node.classList.contains('line') && node.parentElement !== source)
      ) {
        uncertain = true
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      text = node.nodeValue ?? ''
    }
    // Reject before encoding a huge individual text node.
    if (text.length > CODE_BLOCK_MAX_BYTES) {
      return { ok: false, error: 'BLOCK_TOO_LARGE' }
    }
    bytes += encoder.encode(text).byteLength
    if (bytes > CODE_BLOCK_MAX_BYTES) {
      return { ok: false, error: 'BLOCK_TOO_LARGE' }
    }
    if (text) {
      chunks.push(text)
    }
    if (
      node instanceof Element
      && node.parentElement === source
      && node.matches('span.line')
    ) {
      lineChunkStart = chunks.length
    }
    node = walker.nextNode()
  }
  const sourceCode = chunks.join('')
  if (!sourceCode.trim()) {
    return { ok: false, error: 'EMPTY_BLOCK' }
  }
  // Unverified block layout cannot safely reconstruct CSS-only line breaks.
  if (uncertain) {
    return { ok: false, error: 'STRUCTURE_UNCERTAIN' }
  }
  return {
    ok: true,
    item: {
      id: crypto.randomUUID(),
      sourceCode,
      language: inferExtractedCodeLanguage(source),
      blockIndex,
      capturedAt: Date.now(),
    },
  }
}
