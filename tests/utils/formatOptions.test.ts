import { beforeEach, describe, expect, it, vi } from 'vitest'
import { readStoredFormatOptions } from '@/utils/formatOptions'

const stored = vi.hoisted(() => ({
  values: new Map<string, unknown>(),
}))
vi.mock('#imports', () => ({
  storage: {
    getItem: async (key: string) => stored.values.get(key) ?? null,
    async getItems(keys: string[]) {
      return keys.map(key => ({
        key,
        value: stored.values.get(key) ?? null,
      }))
    },
    async setItem(key: string, value: unknown) {
      stored.values.set(key, value)
    },
  },
}))

describe('persisted format options', () => {
  beforeEach(() => stored.values.clear())

  it('replaces invalid fields with defaults while keeping valid stored settings', async () => {
    stored.values.set('local:semi', 'false')
    stored.values.set('local:printWidth', -1)
    stored.values.set('local:trailingComma', 'sometimes')
    stored.values.set('local:singleQuote', true)
    stored.values.set('local:tabWidth', 0)

    expect(await readStoredFormatOptions('typescript')).toMatchObject({
      semi: true,
      printWidth: 80,
      trailingComma: 'all',
      singleQuote: true,
      tabWidth: 0,
      languageId: 'typescript',
      parser: 'typescript',
    })
  })
})
