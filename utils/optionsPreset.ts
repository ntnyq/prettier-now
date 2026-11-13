import * as v from 'valibot'
import {
  DEFAULT_JAVA_OPTIONS,
  DEFAULT_OPTIONS,
  DEFAULT_PHP_OPTIONS,
  DEFAULT_SVELTE_OPTIONS,
  DEFAULT_TOML_OPTIONS,
  DEFAULT_XML_OPTIONS,
  OPTIONS_SNAPSHOT_VERSION,
} from '@/constants/options'
import { FORMAT_OPTION_SCHEMAS } from '@/utils/optionsSchema'
import {
  LegacyTomlOptionsSchema,
  migrateLegacyTomlOptions,
  TomlOptionsSchema,
} from '@/utils/tomlOptions'
import type { OptionsPreset, OptionsSnapshot } from '@/types/optionsPreset'

/**
 * Validate snapshots and upgrade version 1 Taplo settings to Tombi settings.
 */
export const OptionsSnapshotSchema = v.pipe(
  v.union([
    v.object({
      ...FORMAT_OPTION_SCHEMAS,
      version: v.literal(OPTIONS_SNAPSHOT_VERSION),
      tomlPluginOptions: TomlOptionsSchema,
    }),
    v.object({
      ...FORMAT_OPTION_SCHEMAS,
      version: v.literal(1),
      tomlPluginOptions: LegacyTomlOptionsSchema,
    }),
  ]),
  v.transform((snapshot): OptionsSnapshot =>
    snapshot.version === 1
      ? {
          ...snapshot,
          version: OPTIONS_SNAPSHOT_VERSION,
          tomlPluginOptions: migrateLegacyTomlOptions(
            snapshot.tomlPluginOptions,
          ),
        }
      : snapshot,
  ),
)

/**
 * Schema for validating one options preset.
 */
export const OptionsPresetSchema = v.object({
  createdAt: v.number(),
  id: v.string(),
  name: v.string(),
  snapshot: OptionsSnapshotSchema,
  updatedAt: v.number(),
})

/**
 * Schema for validating the persisted options preset list.
 */
export const OptionsPresetListSchema = v.array(OptionsPresetSchema)

/**
 * Create a snapshot from the default option values.
 *
 * @returns Default options snapshot.
 */
export function createDefaultOptionsSnapshot() {
  return {
    version: OPTIONS_SNAPSHOT_VERSION,
    options: {
      ...DEFAULT_OPTIONS,
    },
    xmlPluginOptions: {
      ...DEFAULT_XML_OPTIONS,
    },
    phpPluginOptions: {
      ...DEFAULT_PHP_OPTIONS,
    },
    javaPluginOptions: {
      ...DEFAULT_JAVA_OPTIONS,
    },
    sveltePluginOptions: {
      ...DEFAULT_SVELTE_OPTIONS,
    },
    tomlPluginOptions: {
      ...DEFAULT_TOML_OPTIONS,
    },
  } satisfies OptionsSnapshot
}

/**
 * Parse and validate an options snapshot JSON string.
 *
 * @param source - JSON string to parse.
 * @returns Parsed options snapshot.
 *
 * @throws {Error} When JSON is invalid, unsupported, or fails schema validation.
 */
export function parseOptionsSnapshot(source: string) {
  let parsed: unknown

  try {
    parsed = JSON.parse(source)
  } catch (error) {
    throw new Error('Invalid options file', { cause: error })
  }

  if (
    !v.safeParse(
      v.object({ version: v.picklist([1, OPTIONS_SNAPSHOT_VERSION]) }),
      parsed,
    ).success
  ) {
    throw new Error('Unsupported options file')
  }

  const result = v.safeParse(OptionsSnapshotSchema, parsed)
  if (!result.success) {
    throw new Error('Invalid options file')
  }

  return result.output
}

/**
 * Serialize an options snapshot as pretty JSON.
 *
 * @param snapshot - Options snapshot to serialize.
 * @returns JSON string with a trailing newline.
 */
export function stringifyOptionsSnapshot(snapshot: OptionsSnapshot) {
  return `${JSON.stringify(snapshot, null, 2)}\n`
}

/**
 * Insert or replace an options preset and sort by update time.
 *
 * @param presets - Existing presets.
 * @param preset - Preset to insert or replace.
 * @returns Updated preset list.
 */
export function upsertOptionsPreset(
  presets: OptionsPreset[],
  preset: OptionsPreset,
) {
  return [preset, ...presets.filter(item => item.id !== preset.id)].sort(
    (a, b) => b.updatedAt - a.updatedAt,
  )
}

/**
 * Remove an options preset by id.
 *
 * @param presets - Existing presets.
 * @param id - Preset id to remove.
 * @returns Updated preset list.
 */
export function removeOptionsPreset(presets: OptionsPreset[], id: string) {
  return presets.filter(preset => preset.id !== id)
}

/**
 * Create a named options preset.
 *
 * @param params - Options preset creation parameters.
 * @param params.name - User-facing preset name.
 * @param params.snapshot - Options snapshot stored by the preset.
 * @param params.now - Optional timestamp used for deterministic ids and tests.
 * @returns New options preset.
 */
export function createOptionsPreset(params: {
  /**
   * User-facing preset name.
   */
  name: string

  /**
   * Options snapshot stored by the preset.
   */
  snapshot: OptionsSnapshot

  /**
   * Optional timestamp used for deterministic ids and tests.
   */
  now?: number
}) {
  const now = params.now ?? Date.now()

  return {
    id: `${now}-${params.name.trim().toLowerCase().replaceAll(/\s+/g, '-')}`,
    name: params.name.trim(),
    createdAt: now,
    updatedAt: now,
    snapshot: params.snapshot,
  } satisfies OptionsPreset
}
