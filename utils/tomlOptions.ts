import * as v from 'valibot'
import { storage } from '#imports'
import { DEFAULT_TOML_OPTIONS } from '@/constants/options'
import type { PluginTOMLOptions } from '@/types/options'

const spaceWidthSchema = v.pipe(
  v.number(),
  v.integer(),
  v.minValue(0),
  v.maxValue(255),
)
const quoteStyleSchema = v.picklist(['double', 'single', 'preserve'])

/**
 * Persisted Tombi settings; null delegates to the formatter or core options.
 */
export const TomlOptionsSchema = v.object({
  tomlVersion: v.nullable(v.picklist(['v1.0.0', 'v1.1.0', 'v1.1.0-preview'])),
  arrayBracketSpaceWidth: v.nullable(spaceWidthSchema),
  arrayCommaSpaceWidth: v.nullable(spaceWidthSchema),
  commentStyle: v.nullable(v.picklist(['normalize', 'preserve'])),
  dateTimeDelimiter: v.nullable(v.picklist(['T', 'space', 'preserve'])),
  groupBlankLinesLimit: v.nullable(
    v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(255)),
  ),
  indentSubTables: v.nullable(v.boolean()),
  indentTableKeyValuePairs: v.nullable(v.boolean()),
  inlineTableBraceSpaceWidth: v.nullable(spaceWidthSchema),
  inlineTableCommaSpaceWidth: v.nullable(spaceWidthSchema),
  keyValueEqualsSignAlignment: v.nullable(v.boolean()),
  keyQuoteStyle: v.nullable(quoteStyleSchema),
  stringQuoteStyle: v.nullable(quoteStyleSchema),
  trailingCommentAlignment: v.nullable(v.boolean()),
  keyValueEqualsSignSpaceWidth: v.nullable(spaceWidthSchema),
  tableBlankLines: v.nullable(spaceWidthSchema),
  trailingCommentSpaceWidth: v.nullable(spaceWidthSchema),
})

/**
 * Taplo settings used by version 1 snapshots and the previous storage layout.
 */
export const LegacyTomlOptionsSchema = v.object({
  alignComments: v.boolean(),
  alignEntries: v.boolean(),
  allowedBlankLines: v.pipe(v.number(), v.integer(), v.minValue(0)),
  arrayAutoCollapse: v.boolean(),
  arrayAutoExpand: v.boolean(),
  compactArrays: v.boolean(),
  compactEntries: v.boolean(),
  compactInlineTables: v.boolean(),
  indentEntries: v.boolean(),
  indentTables: v.boolean(),
  reorderKeys: v.boolean(),
})

/**
 * Translate supported Taplo preferences. Array layout and key sorting have no
 * Tombi equivalent. Blank-line limits are clamped to Tombi's supported range.
 *
 * @param legacy - Validated legacy preferences, including only stored keys.
 * @returns Tombi settings with unsupported preferences omitted.
 */
export function migrateLegacyTomlOptions(
  legacy: Partial<v.InferOutput<typeof LegacyTomlOptionsSchema>>,
): PluginTOMLOptions {
  return {
    ...DEFAULT_TOML_OPTIONS,
    trailingCommentAlignment: legacy.alignComments ?? null,
    keyValueEqualsSignAlignment: legacy.alignEntries ?? null,
    groupBlankLinesLimit:
      legacy.allowedBlankLines === undefined
        ? null
        : Math.min(255, Math.max(1, legacy.allowedBlankLines)),
    arrayBracketSpaceWidth:
      legacy.compactArrays === undefined ? null : legacy.compactArrays ? 0 : 1,
    keyValueEqualsSignSpaceWidth:
      legacy.compactEntries === undefined
        ? null
        : legacy.compactEntries
          ? 0
          : 1,
    inlineTableBraceSpaceWidth:
      legacy.compactInlineTables === undefined
        ? null
        : legacy.compactInlineTables
          ? 0
          : 1,
    indentTableKeyValuePairs: legacy.indentEntries ?? null,
    indentSubTables: legacy.indentTables ?? null,
  }
}

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
