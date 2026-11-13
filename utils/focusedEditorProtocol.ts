import * as v from 'valibot'
import { FOCUSED_EDITOR_MESSAGE } from '@/constants/focusedEditor'
import { LANGUAGE_ID } from '@/constants/language'

const requestIdSchema = v.pipe(v.string(), v.nonEmpty())
const languageIdSchema = v.picklist(Object.values(LANGUAGE_ID))

/**
 * Decode string-only page events without exposing cross-world objects.
 *
 * @param detail - Untrusted CustomEvent detail.
 * @returns Decoded payload, or undefined for malformed events.
 */
export function parseFocusedEditorEventDetail(detail: unknown): unknown {
  if (typeof detail !== 'string') {
    return undefined
  }
  try {
    return JSON.parse(detail)
  } catch {
    return undefined
  }
}

/**
 * Command delivered by the extension background to the content script.
 */
export const FocusedEditorCommandSchema = v.object({
  type: v.literal(FOCUSED_EDITOR_MESSAGE.formatFocusedEditor),
  requireFocus: v.optional(v.boolean()),
})

/**
 * Page event requesting source from the focused editor.
 */
export const FocusedEditorReadRequestSchema = v.object({
  requestId: requestIdSchema,
})

/**
 * Page event requesting replacement of the previously read source.
 */
export const FocusedEditorWriteRequestSchema = v.object({
  requestId: requestIdSchema,
  value: v.string(),
})

/**
 * Page response containing source or a read diagnostic.
 */
export const FocusedEditorReadResponseSchema = v.object({
  requestId: requestIdSchema,
  source: v.optional(v.string()),
  hints: v.optional(v.array(v.string())),
  errorMessage: v.optional(v.string()),
})

/**
 * Page response acknowledging a write or reporting its diagnostic.
 */
export const FocusedEditorWriteResponseSchema = v.object({
  requestId: requestIdSchema,
  errorMessage: v.optional(v.string()),
})

/**
 * Request accepted by the hidden extension formatter page.
 */
export const FocusedEditorFormatterRequestSchema = v.object({
  type: v.literal(FOCUSED_EDITOR_MESSAGE.formatterFormatRequest),
  requestId: requestIdSchema,
  source: v.string(),
  hints: v.optional(v.array(v.string())),
  url: v.optional(v.string()),
  fallbackLanguageId: v.optional(languageIdSchema),
})

/**
 * Runtime-validated success or failure response from the formatter page.
 */
export const FocusedEditorFormatterResponseSchema = v.union([
  v.object({
    type: v.literal(FOCUSED_EDITOR_MESSAGE.formatterFormatResponse),
    requestId: requestIdSchema,
    ok: v.literal(true),
    languageId: languageIdSchema,
    formatted: v.string(),
  }),
  v.object({
    type: v.literal(FOCUSED_EDITOR_MESSAGE.formatterFormatResponse),
    requestId: requestIdSchema,
    ok: v.literal(false),
    errorMessage: v.string(),
  }),
])
