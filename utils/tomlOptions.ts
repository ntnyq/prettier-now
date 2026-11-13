import * as v from 'valibot'
import { DEFAULT_TOML_OPTIONS } from '@/constants/options'
import { TOML_OPTION_VALUES } from '@/constants/optionValues'
import type { PluginTOMLOptions } from '@/types/options'

const spaceWidthSchema = v.pipe(
  v.number(),
  v.integer(),
  v.minValue(0),
  v.maxValue(255),
)
const quoteStyleSchema = v.picklist(TOML_OPTION_VALUES.quoteStyle)

/**
 * Persisted Tombi settings; null delegates to the formatter or core options.
 */
export const TomlOptionsSchema = v.object({
  tomlVersion: v.nullable(v.picklist(TOML_OPTION_VALUES.tomlVersion)),
  arrayBracketSpaceWidth: v.nullable(spaceWidthSchema),
  arrayCommaSpaceWidth: v.nullable(spaceWidthSchema),
  commentStyle: v.nullable(v.picklist(TOML_OPTION_VALUES.commentStyle)),
  dateTimeDelimiter: v.nullable(
    v.picklist(TOML_OPTION_VALUES.dateTimeDelimiter),
  ),
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
