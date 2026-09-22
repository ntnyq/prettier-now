import * as v from 'valibot'
import { describe, expect, it } from 'vitest'
import {
  addFormatHistoryEntry,
  createFormatHistoryEntry,
  FormatHistoryEntryListSchema,
  MAX_FORMAT_HISTORY_ENTRY_BYTES,
  removeFormatHistoryEntry,
} from '@/utils/history'
import type { FormatHistoryEntry } from '@/types/history'

function createEntry(id: string, formattedAt: number): FormatHistoryEntry {
  return {
    id,
    fileName: `${id}.ts`,
    languageId: 'typescript',
    sourceCode: 'const a=1',
    resultCode: 'const a = 1\n',
    formatCost: 1,
    formattedAt,
  }
}

describe('format history utilities', () => {
  it('creates a stable history entry from formatted job data', () => {
    expect(
      createFormatHistoryEntry({
        fileName: 'index.ts',
        languageId: 'typescript',
        sourceCode: 'const a=1',
        resultCode: 'const a = 1\n',
        formatCost: 3.2,
        formattedAt: 100,
      }),
    ).toEqual({
      id: 'index.ts-typescript-100',
      fileName: 'index.ts',
      languageId: 'typescript',
      sourceCode: 'const a=1',
      resultCode: 'const a = 1\n',
      formatCost: 3.2,
      formattedAt: 100,
    })
  })

  it('adds newest entries first and replaces matching ids', () => {
    const oldEntry = createEntry('same', 1)
    const newEntry = createEntry('same', 2)
    const otherEntry = createEntry('other', 3)

    expect(addFormatHistoryEntry([oldEntry, otherEntry], newEntry)).toEqual([
      newEntry,
      otherEntry,
    ])
  })

  it('keeps at most fifty entries', () => {
    const entries = Array.from({ length: 50 }, (_, index) =>
      createEntry(`entry-${index}`, index),
    )
    const nextEntries = addFormatHistoryEntry(entries, createEntry('new', 100))

    expect(nextEntries).toHaveLength(50)
    expect(nextEntries[0]?.id).toBe('new')
    expect(nextEntries.at(-1)?.id).toBe('entry-48')
  })

  it('drops oversized source and result content before adding entries', () => {
    const entry = createEntry('large', 1)
    entry.sourceCode = 'x'.repeat(MAX_FORMAT_HISTORY_ENTRY_BYTES)
    entry.resultCode = 'y'

    expect(addFormatHistoryEntry([], entry)).toEqual([
      {
        ...entry,
        resultCode: '',
        sourceCode: '',
      },
    ])
  })

  it('removes entries by id', () => {
    const entries = [createEntry('a', 1), createEntry('b', 2)]

    expect(removeFormatHistoryEntry(entries, 'a')).toEqual([entries[1]])
  })

  it('validates persisted history entries', () => {
    const entry = createEntry('a', 1)

    expect(v.safeParse(FormatHistoryEntryListSchema, [entry]).success).toBe(
      true,
    )
    expect(
      v.safeParse(FormatHistoryEntryListSchema, [
        {
          ...entry,
          formatCost: 'fast',
        },
      ]).success,
    ).toBe(false)
  })
})
