import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { DEFAULT_TOML_OPTIONS } from '@/constants/options'
import { useOptionsStore } from '@/stores/options'
import { readStoredFormatOptions } from '@/utils/formatOptions'
import { resolveFormatOptions } from '@/utils/resolveFormatOptions'

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
    watch: () => () => {},
  },
}))

describe('Tombi settings in the options store', () => {
  it('honors an immediate reset even before old settings have hydrated', async () => {
    stored.values.set('local:semi', false)
    stored.values.set('local:printWidth', 120)
    const store = useOptionsStore()
    await store.resetOptions()
    expect(store.semi).toBe(true)
    expect(store.printWidth).toBe(80)
    expect(stored.values.get('local:semi')).toBe(true)
    expect(stored.values.get('local:printWidth')).toBe(80)
  })
  it('merges concurrent edits to different TOML fields', async () => {
    const first = useOptionsStore(createPinia())
    const second = useOptionsStore(createPinia())
    await flushPromises()
    first.tomlPluginOptions.stringQuoteStyle = 'single'
    second.tomlPluginOptions.arrayBracketSpaceWidth = 2
    await Promise.all([first.savePreset('first'), second.savePreset('second')])
    expect(stored.values.get('local:tomlPluginOptions')).toMatchObject({
      stringQuoteStyle: 'single',
      arrayBracketSpaceWidth: 2,
    })
  })

  it('keeps unmigrated TOML preferences readable and preserves them on the first edit', async () => {
    stored.values.set('local:alignComments', true)
    stored.values.set('local:indentTables', true)
    const store = useOptionsStore()
    await flushPromises()
    expect(store.tomlPluginOptions).toMatchObject({
      trailingCommentAlignment: true,
      indentSubTables: true,
    })
    expect(stored.values.has('local:tomlPluginOptions')).toBe(false)
    store.tomlPluginOptions.arrayBracketSpaceWidth = 2
    await store.savePreset('Migrated')
    expect(stored.values.get('local:tomlPluginOptions')).toMatchObject({
      trailingCommentAlignment: true,
      indentSubTables: true,
      arrayBracketSpaceWidth: 2,
    })
  })
  beforeEach(() => {
    stored.values.clear()
    setActivePinia(createPinia())
  })

  it('uses identical validated preferences in the settings store and webpage formatter', async () => {
    stored.values.set('local:singleQuote', true)
    stored.values.set('local:semi', 'invalid')
    stored.values.set('local:printWidth', 100)
    stored.values.set('local:xmlSelfClosingSpace', 'invalid')
    stored.values.set('local:xmlQuoteAttributes', 'single')
    stored.values.set('local:entrypoint', 'block')
    stored.values.set('local:svelteSortOrder', 'none')
    const store = useOptionsStore()
    await flushPromises()
    expect(store.semi).toBe(true)
    expect(store.singleQuote).toBe(true)
    store.tabWidth = 4
    store.phpVersion = '8.2'
    await flushPromises()

    expect(stored.values.get('local:tabWidth')).toBe(4)
    expect(await readStoredFormatOptions('javascript')).toEqual(
      resolveFormatOptions(store.createSnapshot(), 'javascript'),
    )
  })

  it('captures, restores and resets plugin preferences through presets', async () => {
    const store = useOptionsStore()
    await nextTick()
    store.tomlPluginOptions.stringQuoteStyle = 'preserve'
    store.tomlPluginOptions.arrayBracketSpaceWidth = 0
    store.tomlPluginOptions.indentSubTables = false
    await store.savePreset('TOML')
    const preset = store.presets[0]

    expect(preset?.snapshot.version).toBe(2)
    await store.resetOptions()
    expect(store.tomlPluginOptions).toEqual(DEFAULT_TOML_OPTIONS)
    expect(await store.applyPreset(preset?.id ?? '')).toBe(true)
    expect(store.tomlPluginOptions).toMatchObject({
      stringQuoteStyle: 'preserve',
      arrayBracketSpaceWidth: 0,
      indentSubTables: false,
    })
    store.tomlPluginOptions.stringQuoteStyle = 'double'
    expect(preset?.snapshot.tomlPluginOptions.stringQuoteStyle).toBe('preserve')
  })
})
