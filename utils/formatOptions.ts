import { storage } from '#imports'
import { createDefaultOptionsSnapshot } from '@/utils/optionsPreset'
import {
  FORMAT_OPTION_SCHEMAS,
  resolveStoredOptions,
} from '@/utils/optionsSchema'
import { resolveFormatOptions } from '@/utils/resolveFormatOptions'
import { readStoredTomlOptions } from '@/utils/tomlStorage'
import type { StorageItemKey } from '#imports'
import type { LanguageId } from '@/types/language'
import type { FormatOptions } from '@/utils/format'

/**
 * Read existing per-option keys in one batch and resolve validated settings.
 *
 * @param languageId - Language selected for formatting.
 * @returns Complete options for the standalone formatter.
 */
export async function readStoredFormatOptions(
  languageId: LanguageId,
): Promise<FormatOptions> {
  const defaults = createDefaultOptionsSnapshot()
  const keys = Object.keys(FORMAT_OPTION_SCHEMAS)
    .flatMap(group =>
      Object.keys(
        FORMAT_OPTION_SCHEMAS[group as keyof typeof FORMAT_OPTION_SCHEMAS]
          .entries,
      ),
    )
    .map((key): StorageItemKey => `local:${key}`)
  const [entries, tomlPluginOptions] = await Promise.all([
    storage.getItems(keys),
    readStoredTomlOptions({ persistMigration: false }),
  ])
  const stored = Object.fromEntries(
    entries.map(({ key, value }) => [key.slice('local:'.length), value]),
  )

  return resolveFormatOptions(
    {
      version: defaults.version,
      options: resolveStoredOptions(
        FORMAT_OPTION_SCHEMAS.options,
        defaults.options,
        stored,
      ),
      xmlPluginOptions: resolveStoredOptions(
        FORMAT_OPTION_SCHEMAS.xmlPluginOptions,
        defaults.xmlPluginOptions,
        stored,
      ),
      phpPluginOptions: resolveStoredOptions(
        FORMAT_OPTION_SCHEMAS.phpPluginOptions,
        defaults.phpPluginOptions,
        stored,
      ),
      javaPluginOptions: resolveStoredOptions(
        FORMAT_OPTION_SCHEMAS.javaPluginOptions,
        defaults.javaPluginOptions,
        stored,
      ),
      sveltePluginOptions: resolveStoredOptions(
        FORMAT_OPTION_SCHEMAS.sveltePluginOptions,
        defaults.sveltePluginOptions,
        stored,
      ),
      tomlPluginOptions,
    },
    languageId,
  )
}
