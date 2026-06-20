import * as v from 'valibot'
import type { FormatHistoryEntry } from '@/types/history'

export const MAX_FORMAT_HISTORY_ENTRIES = 50
export const MAX_FORMAT_HISTORY_ENTRY_BYTES = 128 * 1024

export const FormatHistoryEntrySchema = v.object({
  fileName: v.string(),
  formatCost: v.number(),
  formattedAt: v.number(),
  id: v.string(),
  languageId: v.string(),
  resultCode: v.string(),
  sourceCode: v.string(),
})

export const FormatHistoryEntryListSchema = v.array(FormatHistoryEntrySchema)

function getTextByteLength(value: string) {
  return new Blob([value]).size
}

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

export function createFormatHistoryEntry(params: {
  fileName: string
  formatCost: number
  formattedAt?: number
  languageId: string
  resultCode: string
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

export function removeFormatHistoryEntry(
  entries: FormatHistoryEntry[],
  id: string,
) {
  return entries.filter(entry => entry.id !== id)
}
