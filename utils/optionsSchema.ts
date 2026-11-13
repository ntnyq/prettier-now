import * as v from 'valibot'
import { JAVA_ENTRYPOINTS } from '@/constants/options'
import {
  PHP_BRACE_STYLES,
  PHP_VERSIONS,
  PRETTIER_OPTION_VALUES,
  SVELTE_SORT_ORDERS,
  XML_OPTION_VALUES,
} from '@/constants/optionValues'

const nonNegativeIntegerSchema = v.pipe(v.number(), v.integer(), v.minValue(0))

/**
 * Shared schemas for persisted settings, presets and formatter requests.
 */
export const FORMAT_OPTION_SCHEMAS = {
  /**
   * Core Prettier preferences.
   */
  options: v.object({
    arrowParens: v.picklist(PRETTIER_OPTION_VALUES.arrowParens),
    bracketSameLine: v.boolean(),
    bracketSpacing: v.boolean(),
    embeddedLanguageFormatting: v.picklist(
      PRETTIER_OPTION_VALUES.embeddedLanguageFormatting,
    ),
    endOfLine: v.picklist(PRETTIER_OPTION_VALUES.endOfLine),
    experimentalOperatorPosition: v.picklist(
      PRETTIER_OPTION_VALUES.experimentalOperatorPosition,
    ),
    experimentalTernaries: v.boolean(),
    htmlWhitespaceSensitivity: v.picklist(
      PRETTIER_OPTION_VALUES.htmlWhitespaceSensitivity,
    ),
    jsxSingleQuote: v.boolean(),
    objectWrap: v.picklist(PRETTIER_OPTION_VALUES.objectWrap),
    printWidth: nonNegativeIntegerSchema,
    proseWrap: v.picklist(PRETTIER_OPTION_VALUES.proseWrap),
    quoteProps: v.picklist(PRETTIER_OPTION_VALUES.quoteProps),
    semi: v.boolean(),
    singleAttributePerLine: v.boolean(),
    singleQuote: v.boolean(),
    tabWidth: nonNegativeIntegerSchema,
    trailingComma: v.picklist(PRETTIER_OPTION_VALUES.trailingComma),
    useTabs: v.boolean(),
    vueIndentScriptAndStyle: v.boolean(),
  }),
  /**
   * XML-specific preferences.
   */
  xmlPluginOptions: v.object({
    xmlQuoteAttributes: v.picklist(XML_OPTION_VALUES.xmlQuoteAttributes),
    xmlSelfClosingSpace: v.boolean(),
    xmlSortAttributesByKey: v.boolean(),
    xmlWhitespaceSensitivity: v.picklist(
      XML_OPTION_VALUES.xmlWhitespaceSensitivity,
    ),
  }),
  /**
   * PHP-specific preferences.
   */
  phpPluginOptions: v.object({
    braceStyle: v.picklist(PHP_BRACE_STYLES),
    phpVersion: v.picklist(PHP_VERSIONS),
    trailingCommaPHP: v.boolean(),
  }),
  /**
   * Java parsing preferences.
   */
  javaPluginOptions: v.object({
    entrypoint: v.picklist(JAVA_ENTRYPOINTS),
  }),
  /**
   * Svelte-specific preferences.
   */
  sveltePluginOptions: v.object({
    svelteAllowShorthand: v.boolean(),
    svelteIndentScriptAndStyle: v.boolean(),
    svelteSortOrder: v.picklist(SVELTE_SORT_ORDERS),
  }),
}

/**
 * Validate stored fields independently, preserving valid false and zero values.
 *
 * @param schema - Schema governing this option group.
 * @param defaults - Fallback values for missing or invalid fields.
 * @param stored - Untrusted values read from storage.
 * @returns A fully validated option group.
 */
export function resolveStoredOptions<
  Schema extends v.ObjectSchema<v.ObjectEntries, undefined>,
>(
  schema: Schema,
  defaults: Record<string, unknown>,
  stored: Record<string, unknown>,
): v.InferOutput<Schema> {
  const values = Object.fromEntries(
    Object.entries(schema.entries).map(([key, field]) => {
      const parsed = v.safeParse(field, stored[key])
      return [key, parsed.success ? parsed.output : defaults[key]]
    }),
  )
  return v.parse(schema, values)
}
