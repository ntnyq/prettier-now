import { defineStore } from 'pinia'
import { useStorage } from '@/composables/storage'
import {
  addFormatHistoryEntry,
  createFormatHistoryEntry,
  FormatHistoryEntryListSchema,
  removeFormatHistoryEntry,
} from '@/utils/history'
import type { FormatHistoryEntry } from '@/types/history'

export const useHistoryStore = defineStore('history', () => {
  const entries = useStorage<FormatHistoryEntry[]>(
    'formatHistory',
    [],
    FormatHistoryEntryListSchema,
  )

  function addEntry(input: Parameters<typeof createFormatHistoryEntry>[0]) {
    entries.value = addFormatHistoryEntry(
      entries.value,
      createFormatHistoryEntry(input),
    )
  }

  function removeEntry(id: string) {
    entries.value = removeFormatHistoryEntry(entries.value, id)
  }

  function clearHistory() {
    entries.value = []
  }

  return {
    entries,
    addEntry,
    removeEntry,
    clearHistory,
  }
})
