import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { DEFAULT_TOML_OPTIONS } from '@/constants/options'
import { useOptionsStore } from '@/stores/options'

describe('Tombi settings in the options store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('captures, restores and resets plugin preferences through presets', async () => {
    const store = useOptionsStore()
    await nextTick()
    store.tomlPluginOptions.stringQuoteStyle = 'preserve'
    store.tomlPluginOptions.arrayBracketSpaceWidth = 0
    store.tomlPluginOptions.indentSubTables = false
    store.savePreset('TOML')
    const preset = store.presets[0]

    expect(preset?.snapshot.version).toBe(2)
    store.resetOptions()
    expect(store.tomlPluginOptions).toEqual(DEFAULT_TOML_OPTIONS)
    expect(store.applyPreset(preset?.id ?? '')).toBe(true)
    expect(store.tomlPluginOptions).toMatchObject({
      stringQuoteStyle: 'preserve',
      arrayBracketSpaceWidth: 0,
      indentSubTables: false,
    })
    store.tomlPluginOptions.stringQuoteStyle = 'double'
    expect(preset?.snapshot.tomlPluginOptions.stringQuoteStyle).toBe('preserve')
  })
})
