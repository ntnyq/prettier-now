import * as v from 'valibot'
import {
  CODE_BLOCK_MAX_BYTES,
  CODE_BLOCK_MAX_ITEMS,
} from '@/constants/codeBlocks'
import { languages } from '@/constants/language'

/**
 * Bounded identifiers safe for storage keys and stable job ids.
 */
export const CodeBlockIdSchema = v.pipe(v.string(), v.regex(/^[\w-]{1,80}$/))
/**
 * Supported selectable language identifiers.
 */
export const CodeBlockLanguageIdSchema = v.pipe(
  v.string(),
  v.check(value => languages.some(language => language.id === value)),
)
/**
 * Validated evidence; unresolved languages cannot smuggle a fallback parser.
 */
export const ExtractedLanguageSchema = v.pipe(
  v.object({
    status: v.picklist(['supported', 'unknown', 'unsupported']),
    languageId: v.optional(CodeBlockLanguageIdSchema),
    rawLabel: v.optional(v.pipe(v.string(), v.maxLength(80))),
    evidence: v.picklist([
      'attribute',
      'class',
      'filename',
      'label',
      'content',
      'none',
    ]),
    requiresConfirmation: v.boolean(),
  }),
  v.check(value =>
    value.status === 'supported'
      ? !!value.languageId
      : value.languageId === undefined && value.requiresConfirmation,
  ),
)
/**
 * Snapshot validation includes both code-unit and UTF-8 budgets.
 */
export const ExtractedCodeBlockSchema = v.object({
  id: CodeBlockIdSchema,
  sourceCode: v.pipe(
    v.string(),
    v.maxLength(CODE_BLOCK_MAX_BYTES),
    v.check(
      value =>
        !!value.trim()
        && new TextEncoder().encode(value).byteLength <= CODE_BLOCK_MAX_BYTES,
    ),
  ),
  language: ExtractedLanguageSchema,
  blockIndex: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(200)),
  capturedAt: v.pipe(v.number(), v.finite(), v.minValue(0)),
})
/**
 * Validated source metadata emitted by the background.
 */
export const CodeBlockSourceSchema = v.object({
  pageUrl: v.pipe(
    v.string(),
    v.maxLength(4096),
    v.check(value => value === '' || isSafeSourceUrl(value)),
  ),
  pageTitle: v.pipe(v.string(), v.maxLength(300)),
  tabId: v.pipe(v.number(), v.integer(), v.minValue(0)),
  frameId: v.literal(0),
  sourceWindowId: v.pipe(v.number(), v.integer(), v.minValue(0)),
})
/**
 * Request contract revalidated by receiving extension pages.
 */
export const CodeBlockRequestSchema = v.object({
  version: v.literal(1),
  requestId: CodeBlockIdSchema,
  workspaceId: CodeBlockIdSchema,
  source: CodeBlockSourceSchema,
  items: v.pipe(
    v.array(ExtractedCodeBlockSchema),
    v.maxLength(CODE_BLOCK_MAX_ITEMS),
  ),
  createdAt: v.number(),
  expiresAt: v.number(),
  receipts: v.record(CodeBlockIdSchema, v.picklist(['imported', 'discarded'])),
})
const base = { version: v.literal(1) }
const receiver = {
  ...base,
  workspaceId: CodeBlockIdSchema,
  tabId: v.pipe(v.number(), v.integer(), v.minValue(0)),
}
/**
 * All accepted messages; unrecognized messages do not claim a response channel.
 */
export const CodeBlockMessageSchema = v.variant('type', [
  v.object({
    ...receiver,
    type: v.literal('code-blocks/ping'),
    nonce: CodeBlockIdSchema,
  }),
  v.object({ ...base, type: v.literal('code-blocks/scan') }),
  v.object({
    ...base,
    type: v.literal('code-blocks/submit'),
    requestId: CodeBlockIdSchema,
    documentRevision: CodeBlockIdSchema,
    blockIds: v.pipe(
      v.array(CodeBlockIdSchema),
      v.minLength(1),
      v.maxLength(CODE_BLOCK_MAX_ITEMS),
    ),
  }),
  v.object({
    ...base,
    type: v.literal('code-blocks/enqueue'),
    requestId: CodeBlockIdSchema,
    mode: v.picklist(['button', 'popup']),
    items: v.pipe(
      v.array(ExtractedCodeBlockSchema),
      v.minLength(1),
      v.maxLength(CODE_BLOCK_MAX_ITEMS),
      v.check(
        items => new Set(items.map(item => item.id)).size === items.length,
      ),
    ),
  }),
  v.object({
    ...base,
    type: v.literal('code-blocks/status'),
    requestId: CodeBlockIdSchema,
  }),
  v.object({ ...receiver, type: v.literal('code-blocks/register') }),
  v.object({ ...receiver, type: v.literal('code-blocks/list') }),
  v.object({
    ...receiver,
    type: v.literal('code-blocks/read'),
    requestId: CodeBlockIdSchema,
  }),
  v.object({
    ...receiver,
    type: v.literal('code-blocks/ack'),
    requestId: CodeBlockIdSchema,
    results: v.pipe(
      v.array(
        v.object({
          itemId: CodeBlockIdSchema,
          status: v.picklist(['imported', 'discarded']),
        }),
      ),
      v.minLength(1),
      v.maxLength(CODE_BLOCK_MAX_ITEMS),
    ),
  }),
  v.object({
    ...base,
    type: v.literal('code-blocks/available'),
    workspaceId: CodeBlockIdSchema,
    requestId: CodeBlockIdSchema,
  }),
])
/**
 * Parsed message union.
 */
export type CodeBlockMessage = v.InferOutput<typeof CodeBlockMessageSchema>
/**
 * Stable recoverable errors, with no page content in logs or responses.
 */
export const CodeBlockErrorSchema = v.picklist([
  'PAGE_UNAVAILABLE',
  'NO_CODE_BLOCKS',
  'BLOCK_STALE',
  'EMPTY_BLOCK',
  'BLOCK_TOO_LARGE',
  'STRUCTURE_UNCERTAIN',
  'QUEUE_FULL',
  'STORAGE_UNAVAILABLE',
  'WORKSPACE_OPEN_FAILED',
  'REQUEST_EXPIRED',
  'INVALID_MESSAGE',
  'PRIVATE_WINDOW_UNSUPPORTED',
])
/**
 * Error code shared by all extraction surfaces.
 */
export type CodeBlockError = v.InferOutput<typeof CodeBlockErrorSchema>
/**
 * Preview-only scan entry; no complete code in the popup.
 */
export const CodeBlockSummarySchema = v.object({
  blockId: CodeBlockIdSchema,
  blockIndex: v.number(),
  language: ExtractedLanguageSchema,
  preview: v.pipe(v.string(), v.maxLength(160)),
  lineCount: v.number(),
  byteLength: v.number(),
  error: v.optional(CodeBlockErrorSchema),
})
/**
 * One scan entry.
 */
export type CodeBlockSummary = v.InferOutput<typeof CodeBlockSummarySchema>
/**
 * Per-item submit outcomes contain identifiers and errors, never original code.
 */
export const CodeBlockSubmissionSchema = v.object({
  ok: v.literal(true),
  queued: v.boolean(),
  error: v.optional(CodeBlockErrorSchema),
  sentCount: v.pipe(
    v.number(),
    v.integer(),
    v.minValue(0),
    v.maxValue(CODE_BLOCK_MAX_ITEMS),
  ),
  failedCount: v.pipe(
    v.number(),
    v.integer(),
    v.minValue(0),
    v.maxValue(CODE_BLOCK_MAX_ITEMS),
  ),
  results: v.pipe(
    v.array(
      v.object({
        blockId: CodeBlockIdSchema,
        ok: v.boolean(),
        error: v.optional(CodeBlockErrorSchema),
      }),
    ),
    v.maxLength(CODE_BLOCK_MAX_ITEMS),
  ),
})
/**
 * Safe popup and button submit response.
 */
export type CodeBlockSubmission = v.InferOutput<
  typeof CodeBlockSubmissionSchema
>
/**
 * Popup scan response.
 */
export const CodeBlockScanSchema = v.object({
  hostname: v.optional(v.pipe(v.string(), v.maxLength(253)), ''),
  documentRevision: CodeBlockIdSchema,
  summaries: v.pipe(v.array(CodeBlockSummarySchema), v.maxLength(200)),
  limited: v.boolean(),
})
/**
 * Validate a redacted HTTP(S) source URL before rendering links or navigating.
 */
export function isSafeSourceUrl(value: string) {
  try {
    const url = new URL(value)
    return (
      ['https:', 'http:'].includes(url.protocol)
      && !url.username
      && !url.password
      && !url.search
      && !url.hash
    )
  } catch {
    return false
  }
}
/**
 * Normalize unknown failures into content-free error responses.
 */
export function codeBlockFailure(error: unknown) {
  const parsed = v.safeParse(
    CodeBlockErrorSchema,
    error instanceof Error ? error.message : error,
  )
  return {
    ok: false as const,
    error: parsed.success ? parsed.output : ('STORAGE_UNAVAILABLE' as const),
  }
}
