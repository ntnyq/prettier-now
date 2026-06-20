import type { FormatHistoryEntry } from '@/types/history'

export const MAX_FORMAT_HISTORY_ENTRIES = 50

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
  return [entry, ...entries.filter(item => item.id !== entry.id)].slice(
    0,
    MAX_FORMAT_HISTORY_ENTRIES,
  )
}

export function removeFormatHistoryEntry(
  entries: FormatHistoryEntry[],
  id: string,
) {
  return entries.filter(entry => entry.id !== id)
}
