/**
 * @file Prettier Options
 */

import { defineStore } from 'pinia'
import { useStorage } from '@/composables/storage'
import { useStoredOptions } from '@/composables/storedOptions'
import {
  DEFAULT_JAVA_OPTIONS,
  DEFAULT_OPTIONS,
  DEFAULT_PHP_OPTIONS,
  DEFAULT_SVELTE_OPTIONS,
  DEFAULT_TOML_OPTIONS,
  DEFAULT_XML_OPTIONS,
  OPTIONS_SNAPSHOT_VERSION,
} from '@/constants/options'
import {
  createDefaultOptionsSnapshot,
  createOptionsPreset,
  OptionsPresetListSchema,
  removeOptionsPreset,
  upsertOptionsPreset,
} from '@/utils/optionsPreset'
import { FORMAT_OPTION_SCHEMAS } from '@/utils/optionsSchema'
import { TomlOptionsSchema } from '@/utils/tomlOptions'
import type { PluginTOMLOptions } from '@/types/options'
import type { OptionsPreset, OptionsSnapshot } from '@/types/optionsPreset'

export const useOptionsStore = defineStore('options', () => {
  const presets = useStorage<OptionsPreset[]>(
    'optionsPresets',
    [],
    OptionsPresetListSchema,
  )

  const core = useStoredOptions(
    DEFAULT_OPTIONS,
    FORMAT_OPTION_SCHEMAS.options.entries,
  )
  const xml = useStoredOptions(
    DEFAULT_XML_OPTIONS,
    FORMAT_OPTION_SCHEMAS.xmlPluginOptions.entries,
  )
  const php = useStoredOptions(
    DEFAULT_PHP_OPTIONS,
    FORMAT_OPTION_SCHEMAS.phpPluginOptions.entries,
  )
  const java = useStoredOptions(
    DEFAULT_JAVA_OPTIONS,
    FORMAT_OPTION_SCHEMAS.javaPluginOptions.entries,
  )
  const svelte = useStoredOptions(
    DEFAULT_SVELTE_OPTIONS,
    FORMAT_OPTION_SCHEMAS.sveltePluginOptions.entries,
  )

  const tomlPluginOptions = useStorage<PluginTOMLOptions>(
    'tomlPluginOptions',
    { ...DEFAULT_TOML_OPTIONS },
    TomlOptionsSchema,
  )

  function createSnapshot() {
    return {
      version: OPTIONS_SNAPSHOT_VERSION,
      options: { ...core.options.value },
      xmlPluginOptions: { ...xml.options.value },
      phpPluginOptions: { ...php.options.value },
      javaPluginOptions: { ...java.options.value },
      sveltePluginOptions: { ...svelte.options.value },
      tomlPluginOptions: { ...tomlPluginOptions.value },
    } satisfies OptionsSnapshot
  }

  function applySnapshot(snapshot: OptionsSnapshot) {
    core.apply(snapshot.options)
    xml.apply(snapshot.xmlPluginOptions)
    php.apply(snapshot.phpPluginOptions)
    java.apply(snapshot.javaPluginOptions)
    svelte.apply(snapshot.sveltePluginOptions)
    tomlPluginOptions.value = { ...snapshot.tomlPluginOptions }
  }

  function resetOptions() {
    applySnapshot(createDefaultOptionsSnapshot())
  }

  function savePreset(name: string) {
    const preset = createOptionsPreset({
      name,
      snapshot: createSnapshot(),
    })

    presets.value = upsertOptionsPreset(presets.value, preset)
  }

  function applyPreset(id: string) {
    const preset = presets.value.find(item => item.id === id)

    if (!preset) {
      return false
    }

    applySnapshot(preset.snapshot)
    return true
  }

  function deletePreset(id: string) {
    presets.value = removeOptionsPreset(presets.value, id)
  }

  return {
    presets,
    ...core.fields,
    ...xml.fields,
    ...php.fields,
    ...java.fields,
    ...svelte.fields,
    options: core.options,
    xmlPluginOptions: xml.options,
    phpPluginOptions: php.options,
    javaPluginOptions: java.options,
    sveltePluginOptions: svelte.options,
    tomlPluginOptions,
    createSnapshot,
    applySnapshot,
    resetOptions,
    savePreset,
    applyPreset,
    deletePreset,
  }
})
