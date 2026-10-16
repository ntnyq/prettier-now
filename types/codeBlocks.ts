/**
 * Language evidence, independent of formatter fallback behavior.
 */
export interface ExtractedLanguage {
  /**
   * Origin of the language hint.
   */
  evidence: 'attribute' | 'class' | 'content' | 'filename' | 'label' | 'none'
  /**
   * Whether the user must approve language or text structure.
   */
  requiresConfirmation: boolean
  /**
   * Whether the explicit language can be formatted.
   */
  status: 'supported' | 'unknown' | 'unsupported'
  /**
   * Actual selectable language; absent for unresolved evidence.
   */
  languageId?: string
  /**
   * Original bounded language label.
   */
  rawLabel?: string
}

/**
 * Immutable text snapshot for a single send operation.
 */
export interface ExtractedCodeBlock {
  /**
   * One-based position in this scan.
   */
  blockIndex: number
  /**
   * Capture time in milliseconds.
   */
  capturedAt: number
  /**
   * Stable item identity within a request.
   */
  id: string
  /**
   * Captured language evidence.
   */
  language: ExtractedLanguage
  /**
   * Original text with whitespace preserved.
   */
  sourceCode: string
}

/**
 * Redacted source information derived by the background from the sender.
 */
export interface CodeBlockSource {
  /**
   * Top-frame identity.
   */
  frameId: number
  /**
   * Bounded page title, or only the filename for local files.
   */
  pageTitle: string
  /**
   * HTTP(S) URL without credentials, query or fragment; empty for files.
   */
  pageUrl: string
  /**
   * Originating normal browser window.
   */
  sourceWindowId: number
  /**
   * Source browser tab.
   */
  tabId: number
}

/**
 * Session request containing only items that have not been acknowledged.
 */
export interface CodeBlockImportRequest {
  /**
   * Enqueue timestamp.
   */
  createdAt: number
  /**
   * Deadline for import or discard.
   */
  expiresAt: number
  /**
   * Unconsumed snapshots.
   */
  items: ExtractedCodeBlock[]
  /**
   * Consumed item identities, without code.
   */
  receipts: Record<string, 'discarded' | 'imported'>
  /**
   * Retry identity.
   */
  requestId: string
  /**
   * Sanitized source context.
   */
  source: CodeBlockSource
  /**
   * Protocol version.
   */
  version: 1
  /**
   * Receiving dedicated workspace.
   */
  workspaceId: string
}

/**
 * Confirmed input accepted by the workspace append API.
 */
export interface ConfirmedExtractedCode {
  /**
   * Captured item.
   */
  item: ExtractedCodeBlock
  /**
   * Validated selectable formatter language.
   */
  languageId: string
  /**
   * Parent request identity.
   */
  requestId: string
  /**
   * Sanitized page information.
   */
  source: CodeBlockSource
}

/**
 * In-memory task provenance, deliberately excluded from history.
 */
export interface CodeBlockOrigin extends CodeBlockSource {
  /**
   * Original extraction timestamp.
   */
  capturedAt: number
  /**
   * Item retry identity.
   */
  itemId: string
  /**
   * Provenance discriminator.
   */
  kind: 'web-code-block'
  /**
   * Language evidence shown alongside the source.
   */
  language: ExtractedLanguage
  /**
   * Request retry identity.
   */
  requestId: string
}
