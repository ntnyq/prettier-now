import * as v from 'valibot'
import type { FormatHistoryEntry } from '@/types/history'

/**
 * Maximum number of history entries retained in storage.
 */
export const MAX_FORMAT_HISTORY_ENTRIES = 50

/**
 * Maximum combined source and result size retained per history entry.
 */
export const MAX_FORMAT_HISTORY_ENTRY_BYTES = 128 * 1024

/**
 * Schema for validating one persisted format history entry.
 */
export const FormatHistoryEntrySchema = v.object({
  fileName: v.string(),
  formatCost: v.number(),
  formattedAt: v.number(),
  id: v.string(),
  languageId: v.string(),
  resultCode: v.string(),
  sourceCode: v.string(),
})

/**
 * Schema for validating a persisted format history list.
 */
export const FormatHistoryEntryListSchema = v.array(FormatHistoryEntrySchema)

/**
 * Read the byte length of a text value.
 *
 * @param value - Text value to measure.
 * @returns UTF-8 byte length.
 */
function getTextByteLength(value: string) {
  return new Blob([value]).size
}

/**
 * Strip oversized source and result fields from a history entry.
 *
 * @param entry - History entry to normalize.
 * @returns Storage-safe history entry.
 */
function normalizeHistoryEntry(entry: FormatHistoryEntry) {
  if (
    getTextByteLength(entry.sourceCode) + getTextByteLength(entry.resultCode)
    <= MAX_FORMAT_HISTORY_ENTRY_BYTES
  ) {
    return entry
  }

  return {
    ...entry,
    resultCode: '',
    sourceCode: '',
  } satisfies FormatHistoryEntry
}

/**
 * Create a format history entry from one formatting result.
 *
 * @param params - Format history entry creation parameters.
 * @param params.fileName - Source file name.
 * @param params.formatCost - Formatting duration in milliseconds.
 * @param params.formattedAt - Optional completion timestamp.
 * @param params.languageId - Language identifier used for formatting.
 * @param params.resultCode - Formatted output code.
 * @param params.sourceCode - Original source code.
 * @returns Format history entry.
 */
export function createFormatHistoryEntry(params: {
  /**
   * Source file name.
   */
  fileName: string

  /**
   * Formatting duration in milliseconds.
   */
  formatCost: number

  /**
   * Optional completion timestamp.
   */
  formattedAt?: number

  /**
   * Language identifier used for formatting.
   */
  languageId: string

  /**
   * Formatted output code.
   */
  resultCode: string

  /**
   * Original source code.
   */
  sourceCode: string
}) {
  const formattedAt = params.formattedAt ?? Date.now()

  return {
    id: `${params.fileName}-${params.languageId}-${formattedAt}`,
    fileName: params.fileName,
    languageId: params.languageId,
    sourceCode: params.sourceCode,
    resultCode: params.resultCode,
    formatCost: params.formatCost,
    formattedAt,
  } satisfies FormatHistoryEntry
}

/**
 * Add or replace a history entry while enforcing history limits.
 *
 * @param entries - Existing history entries.
 * @param entry - Entry to add.
 * @returns Updated history entries.
 */
export function addFormatHistoryEntry(
  entries: FormatHistoryEntry[],
  entry: FormatHistoryEntry,
) {
  const normalizedEntry = normalizeHistoryEntry(entry)

  return [
    normalizedEntry,
    ...entries.filter(item => item.id !== normalizedEntry.id),
  ].slice(0, MAX_FORMAT_HISTORY_ENTRIES)
}

/**
 * Remove a history entry by id.
 *
 * @param entries - Existing history entries.
 * @param id - History entry id to remove.
 * @returns Updated history entries.
 */
export function removeFormatHistoryEntry(
  entries: FormatHistoryEntry[],
  id: string,
) {
  return entries.filter(entry => entry.id !== id)
}
