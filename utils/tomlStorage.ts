import * as v from 'valibot'
import { storage } from '#imports'
import { DEFAULT_TOML_OPTIONS } from '@/constants/options'
import { withStorageLock } from '@/utils/storage'
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
 * @param options - Whether this extension page should persist a migration.
 * @param options.persistMigration - Disable migration writes in the webpage formatter.
 * @returns Persisted settings or formatter defaults for invalid stored data.
 */
export async function readStoredTomlOptions(
  options: {
    /**
     * Disable writes in the webpage formatter, including partitioned frames.
     */
    persistMigration?: boolean
  } = {},
): Promise<PluginTOMLOptions> {
  return options.persistMigration === false
    ? readTomlOptions(false)
    : withStorageLock('local:tomlPluginOptions', () => readTomlOptions(true))
}

/**
 * Read current preferences and optionally persist a validated legacy migration.
 *
 * @param persistMigration - Whether the caller owns the migration write lock.
 * @returns Current or migrated preferences.
 */
async function readTomlOptions(
  persistMigration: boolean,
): Promise<PluginTOMLOptions> {
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
  if (persistMigration) {
    await storage.setItem('local:tomlPluginOptions', options)
  }
  return options
}
