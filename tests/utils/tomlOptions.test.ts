import * as v from 'valibot'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_TOML_OPTIONS } from '@/constants/options'
import { readStoredFormatOptions } from '@/utils/formatOptions'
import {
  migrateLegacyTomlOptions,
  readStoredTomlOptions,
  TomlOptionsSchema,
} from '@/utils/tomlOptions'

const storageMock = vi.hoisted(() => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
}))

vi.mock('#imports', () => ({
  storage: storageMock,
}))

describe('Tombi options', () => {
  beforeEach(() => {
    storageMock.getItem.mockReset().mockResolvedValue(null)
    storageMock.setItem.mockReset().mockResolvedValue(undefined)
  })

  it('leaves new settings unset to inherit formatter and core defaults', async () => {
    expect(await readStoredTomlOptions()).toEqual(DEFAULT_TOML_OPTIONS)
    expect(
      Object.values(DEFAULT_TOML_OPTIONS).every(value => value === null),
    ).toBe(true)
  })

  it('maps legacy preferences, preserving explicit false and zero values', () => {
    expect(
      migrateLegacyTomlOptions({
        alignComments: false,
        alignEntries: true,
        allowedBlankLines: 0,
        compactArrays: true,
        compactEntries: false,
        compactInlineTables: true,
        indentEntries: true,
        indentTables: false,
        arrayAutoCollapse: false,
        arrayAutoExpand: false,
        reorderKeys: true,
      }),
    ).toEqual({
      ...DEFAULT_TOML_OPTIONS,
      trailingCommentAlignment: false,
      keyValueEqualsSignAlignment: true,
      groupBlankLinesLimit: 1,
      arrayBracketSpaceWidth: 0,
      keyValueEqualsSignSpaceWidth: 1,
      inlineTableBraceSpaceWidth: 0,
      indentTableKeyValuePairs: true,
      indentSubTables: false,
    })
    expect(
      migrateLegacyTomlOptions({ allowedBlankLines: 500 }).groupBlankLinesLimit,
    ).toBe(255)
  })

  it('persists migrated legacy storage without applying unstored preferences', async () => {
    const legacyValues = new Map([
      ['local:alignEntries', true],
      ['local:compactArrays', false],
    ])
    storageMock.getItem.mockImplementation(
      async (key: string) => legacyValues.get(key) ?? null,
    )

    const options = await readStoredTomlOptions()

    expect(options).toEqual({
      ...DEFAULT_TOML_OPTIONS,
      keyValueEqualsSignAlignment: true,
      arrayBracketSpaceWidth: 1,
    })
    expect(storageMock.setItem).toHaveBeenCalledWith(
      'local:tomlPluginOptions',
      options,
    )
  })

  it('prefers new settings, including defaults, over stale legacy keys', async () => {
    storageMock.getItem.mockResolvedValue(DEFAULT_TOML_OPTIONS)

    expect(await readStoredTomlOptions()).toEqual(DEFAULT_TOML_OPTIONS)
    expect(storageMock.getItem).toHaveBeenCalledExactlyOnceWith(
      'local:tomlPluginOptions',
    )
    expect(storageMock.setItem).not.toHaveBeenCalled()
  })

  it('falls back safely for malformed persisted settings', async () => {
    storageMock.getItem.mockResolvedValue({
      ...DEFAULT_TOML_OPTIONS,
      tomlVersion: 'v2',
    })

    expect(await readStoredTomlOptions()).toEqual(DEFAULT_TOML_OPTIONS)
    expect(storageMock.setItem).not.toHaveBeenCalled()
  })

  it.each([
    { arrayBracketSpaceWidth: -1 },
    { arrayCommaSpaceWidth: 256 },
    { groupBlankLinesLimit: 0 },
    { tableBlankLines: 1.5 },
    { keyQuoteStyle: 'auto' },
    { indentSubTables: 'true' },
  ])('rejects unsupported option values: %j', invalid => {
    expect(
      v.safeParse(TomlOptionsSchema, { ...DEFAULT_TOML_OPTIONS, ...invalid })
        .success,
    ).toBe(false)
  })

  it('uses the same migrated settings in the focused-editor formatting path', async () => {
    storageMock.getItem.mockImplementation(async key =>
      key === 'local:compactArrays' ? true : null,
    )

    const options = await readStoredFormatOptions('toml', 'toml')

    expect(options.arrayBracketSpaceWidth).toBe(0)
    expect(options).not.toHaveProperty('compactArrays')
    expect(options).not.toHaveProperty('reorderKeys')
  })
})
