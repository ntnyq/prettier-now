import * as v from 'valibot'
import {
  DEFAULT_JAVA_OPTIONS,
  DEFAULT_OPTIONS,
  DEFAULT_PHP_OPTIONS,
  DEFAULT_SVELTE_OPTIONS,
  DEFAULT_TOML_OPTIONS,
  DEFAULT_XML_OPTIONS,
  JAVA_ENTRYPOINTS,
} from '@/constants/options'
import type { OptionsPreset, OptionsSnapshot } from '@/types/optionsPreset'

const OPTIONS_SNAPSHOT_VERSION = 1
const nonNegativeIntegerSchema = v.pipe(v.number(), v.integer(), v.minValue(0))
const positiveIntegerSchema = v.pipe(v.number(), v.integer(), v.minValue(1))

const OptionsSnapshotVersionSchema = v.object({
  version: v.literal(OPTIONS_SNAPSHOT_VERSION),
})

/**
 * Schema for validating imported options snapshots.
 */
export const OptionsSnapshotSchema = v.object({
  version: v.literal(OPTIONS_SNAPSHOT_VERSION),
  options: v.object({
    arrowParens: v.picklist(['always', 'avoid']),
    bracketSameLine: v.boolean(),
    bracketSpacing: v.boolean(),
    embeddedLanguageFormatting: v.picklist(['auto', 'off']),
    endOfLine: v.picklist(['auto', 'cr', 'crlf', 'lf']),
    experimentalOperatorPosition: v.picklist(['end', 'start']),
    experimentalTernaries: v.boolean(),
    htmlWhitespaceSensitivity: v.picklist(['css', 'ignore', 'strict']),
    jsxSingleQuote: v.boolean(),
    objectWrap: v.picklist(['collapse', 'preserve']),
    printWidth: positiveIntegerSchema,
    proseWrap: v.picklist(['always', 'never', 'preserve']),
    quoteProps: v.picklist(['as-needed', 'consistent', 'preserve']),
    semi: v.boolean(),
    singleAttributePerLine: v.boolean(),
    singleQuote: v.boolean(),
    tabWidth: positiveIntegerSchema,
    trailingComma: v.picklist(['all', 'es5', 'none']),
    useTabs: v.boolean(),
    vueIndentScriptAndStyle: v.boolean(),
  }),
  xmlPluginOptions: v.object({
    xmlQuoteAttributes: v.picklist(['double', 'preserve', 'single']),
    xmlSelfClosingSpace: v.boolean(),
    xmlSortAttributesByKey: v.boolean(),
    xmlWhitespaceSensitivity: v.picklist(['ignore', 'preserve', 'strict']),
  }),
  phpPluginOptions: v.object({
    braceStyle: v.picklist(['1tbs', 'per-cs']),
    phpVersion: v.picklist([
      '5.0',
      '5.1',
      '5.2',
      '5.3',
      '5.4',
      '5.5',
      '5.6',
      '7.0',
      '7.1',
      '7.2',
      '7.3',
      '7.4',
      '8.0',
      '8.1',
      '8.2',
    ]),
    trailingCommaPHP: v.boolean(),
  }),
  javaPluginOptions: v.object({
    entrypoint: v.picklist(JAVA_ENTRYPOINTS),
  }),
  sveltePluginOptions: v.object({
    svelteAllowShorthand: v.boolean(),
    svelteIndentScriptAndStyle: v.boolean(),
    svelteSortOrder: v.picklist([
      'markup-options-scripts-styles',
      'markup-options-styles-scripts',
      'markup-scripts-options-styles',
      'markup-scripts-styles-options',
      'markup-styles-options-scripts',
      'markup-styles-scripts-options',
      'none',
      'options-markup-scripts-styles',
      'options-markup-styles-scripts',
      'options-scripts-markup-styles',
      'options-scripts-styles-markup',
      'options-styles-markup-scripts',
      'options-styles-scripts-markup',
      'scripts-markup-options-styles',
      'scripts-markup-styles-options',
      'scripts-options-markup-styles',
      'scripts-options-styles-markup',
      'scripts-styles-markup-options',
      'scripts-styles-options-markup',
      'styles-markup-options-scripts',
      'styles-markup-scripts-options',
      'styles-options-markup-scripts',
      'styles-options-scripts-markup',
      'styles-scripts-markup-options',
      'styles-scripts-options-markup',
    ]),
  }),
  tomlPluginOptions: v.object({
    alignComments: v.boolean(),
    alignEntries: v.boolean(),
    allowedBlankLines: nonNegativeIntegerSchema,
    arrayAutoCollapse: v.boolean(),
    arrayAutoExpand: v.boolean(),
    compactArrays: v.boolean(),
    compactEntries: v.boolean(),
    compactInlineTables: v.boolean(),
    indentEntries: v.boolean(),
    indentTables: v.boolean(),
    reorderKeys: v.boolean(),
  }),
})

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
  } catch (err) {
    throw new Error('Invalid options file', { cause: err })
  }

  if (!v.safeParse(OptionsSnapshotVersionSchema, parsed).success) {
    throw new Error('Unsupported options file')
  }

  if (!v.safeParse(OptionsSnapshotSchema, parsed).success) {
    throw new Error('Invalid options file')
  }

  return parsed as unknown as OptionsSnapshot
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
