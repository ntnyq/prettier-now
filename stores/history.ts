import { defineStore } from 'pinia'
import { useStoredCollection } from '@/composables/storedCollection'
import {
  addFormatHistoryEntry,
  createFormatHistoryEntry,
  FormatHistoryEntryListSchema,
  removeFormatHistoryEntry,
} from '@/utils/history'
import type { FormatHistoryEntry } from '@/types/history'

export const useHistoryStore = defineStore('history', () => {
  const { items: entries, update } = useStoredCollection<FormatHistoryEntry>(
    'formatHistory',
    FormatHistoryEntryListSchema,
  )

  function addEntry(input: Parameters<typeof createFormatHistoryEntry>[0]) {
    const entry = createFormatHistoryEntry(input)
    return update(current => addFormatHistoryEntry(current, entry))
  }

  function removeEntry(id: string) {
    return update(current => removeFormatHistoryEntry(current, id))
  }

  function clearHistory() {
    return update(() => [], { reset: true })
  }

  return {
    entries,
    addEntry,
    removeEntry,
    clearHistory,
  }
})
