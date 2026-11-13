import * as v from 'valibot'
import { storage } from '#imports'
import { DEFAULT_TOML_OPTIONS } from '@/constants/options'
import {
  LegacyTomlOptionsSchema,
  migrateLegacyTomlOptions,
  TomlOptionsSchema,
} from '@/utils/tomlOptions'
import type { PluginTOMLOptions } from '@/types/options'

/**
 * Read validated Tombi settings and migrate the old per-option storage once.
 * Existing Tombi settings always win, including explicit default selections.
 *
 * @returns Persisted settings or formatter defaults for invalid stored data.
 */
export async function readStoredTomlOptions(): Promise<PluginTOMLOptions> {
  const stored = await storage.getItem<unknown>('local:tomlPluginOptions')
  if (stored !== null) {
    const result = v.safeParse(TomlOptionsSchema, stored)
    return result.success ? result.output : { ...DEFAULT_TOML_OPTIONS }
  }

  const entries = await Promise.all(
    Object.keys(LegacyTomlOptionsSchema.entries).map(
      async key =>
        [key, await storage.getItem<unknown>(`local:${key}`)] as const,
    ),
  )
  const legacy = v.safeParse(
    v.partial(LegacyTomlOptionsSchema),
    Object.fromEntries(entries.filter(([, value]) => value !== null)),
  )
  const options = migrateLegacyTomlOptions(legacy.success ? legacy.output : {})
  await storage.setItem('local:tomlPluginOptions', options)
  return options
}
