/**
 * @file Shared format option readers
 */

import { storage } from '#imports'
import {
  DEFAULT_JAVA_OPTIONS,
  DEFAULT_OPTIONS,
  DEFAULT_PHP_OPTIONS,
  DEFAULT_SVELTE_OPTIONS,
  DEFAULT_TOML_OPTIONS,
  DEFAULT_XML_OPTIONS,
} from '@/constants/options'
import type { JsonValue } from '@/types/json'
import type { FormatOptions } from '@/utils/format'

/**
 * Read one stored option value with a fallback default.
 *
 * @param key - Local storage option key without the storage namespace.
 * @param fallback - Value returned when storage has no value.
 * @returns Stored value or fallback default.
 */
async function readStoredValue<V extends JsonValue>(key: string, fallback: V) {
  const value = await storage.getItem<V>(`local:${key}`)

  return value ?? fallback
}

/**
 * Read all persisted format options for a language.
 *
 * @param languageId - Language id selected for formatting.
 * @param parser - Prettier parser selected for the language.
 * @returns Complete format options for the standalone formatter.
 */
export async function readStoredFormatOptions(
  languageId: string,
  parser: string,
): Promise<FormatOptions> {
  return {
    arrowParens: await readStoredValue(
      'arrowParens',
      DEFAULT_OPTIONS.arrowParens,
    ),
    bracketSameLine: await readStoredValue(
      'bracketSameLine',
      DEFAULT_OPTIONS.bracketSameLine,
    ),
    bracketSpacing: await readStoredValue(
      'bracketSpacing',
      DEFAULT_OPTIONS.bracketSpacing,
    ),
    embeddedLanguageFormatting: await readStoredValue(
      'embeddedLanguageFormatting',
      DEFAULT_OPTIONS.embeddedLanguageFormatting,
    ),
    endOfLine: await readStoredValue('endOfLine', DEFAULT_OPTIONS.endOfLine),
    experimentalOperatorPosition: await readStoredValue(
      'experimentalOperatorPosition',
      DEFAULT_OPTIONS.experimentalOperatorPosition,
    ),
    experimentalTernaries: await readStoredValue(
      'experimentalTernaries',
      DEFAULT_OPTIONS.experimentalTernaries,
    ),
    htmlWhitespaceSensitivity: await readStoredValue(
      'htmlWhitespaceSensitivity',
      DEFAULT_OPTIONS.htmlWhitespaceSensitivity,
    ),
    jsxSingleQuote: await readStoredValue(
      'jsxSingleQuote',
      DEFAULT_OPTIONS.jsxSingleQuote,
    ),
    objectWrap: await readStoredValue('objectWrap', DEFAULT_OPTIONS.objectWrap),
    printWidth: await readStoredValue('printWidth', DEFAULT_OPTIONS.printWidth),
    proseWrap: await readStoredValue('proseWrap', DEFAULT_OPTIONS.proseWrap),
    quoteProps: await readStoredValue('quoteProps', DEFAULT_OPTIONS.quoteProps),
    semi: await readStoredValue('semi', DEFAULT_OPTIONS.semi),
    singleAttributePerLine: await readStoredValue(
      'singleAttributePerLine',
      DEFAULT_OPTIONS.singleAttributePerLine,
    ),
    singleQuote: await readStoredValue(
      'singleQuote',
      DEFAULT_OPTIONS.singleQuote,
    ),
    tabWidth: await readStoredValue('tabWidth', DEFAULT_OPTIONS.tabWidth),
    trailingComma: await readStoredValue(
      'trailingComma',
      DEFAULT_OPTIONS.trailingComma,
    ),
    useTabs: await readStoredValue('useTabs', DEFAULT_OPTIONS.useTabs),
    vueIndentScriptAndStyle: await readStoredValue(
      'vueIndentScriptAndStyle',
      DEFAULT_OPTIONS.vueIndentScriptAndStyle,
    ),

    xmlQuoteAttributes: await readStoredValue(
      'xmlQuoteAttributes',
      DEFAULT_XML_OPTIONS.xmlQuoteAttributes,
    ),
    xmlSelfClosingSpace: await readStoredValue(
      'xmlSelfClosingSpace',
      DEFAULT_XML_OPTIONS.xmlSelfClosingSpace,
    ),
    xmlSortAttributesByKey: await readStoredValue(
      'xmlSortAttributesByKey',
      DEFAULT_XML_OPTIONS.xmlSortAttributesByKey,
    ),
    xmlWhitespaceSensitivity: await readStoredValue(
      'xmlWhitespaceSensitivity',
      DEFAULT_XML_OPTIONS.xmlWhitespaceSensitivity,
    ),

    braceStyle: await readStoredValue(
      'braceStyle',
      DEFAULT_PHP_OPTIONS.braceStyle,
    ),
    phpVersion: await readStoredValue(
      'phpVersion',
      DEFAULT_PHP_OPTIONS.phpVersion,
    ),
    trailingCommaPHP: await readStoredValue(
      'trailingCommaPHP',
      DEFAULT_PHP_OPTIONS.trailingCommaPHP,
    ),

    entrypoint: await readStoredValue(
      'entrypoint',
      DEFAULT_JAVA_OPTIONS.entrypoint,
    ),

    svelteAllowShorthand: await readStoredValue(
      'svelteAllowShorthand',
      DEFAULT_SVELTE_OPTIONS.svelteAllowShorthand,
    ),
    svelteIndentScriptAndStyle: await readStoredValue(
      'svelteIndentScriptAndStyle',
      DEFAULT_SVELTE_OPTIONS.svelteIndentScriptAndStyle,
    ),
    svelteSortOrder: await readStoredValue(
      'svelteSortOrder',
      DEFAULT_SVELTE_OPTIONS.svelteSortOrder,
    ),

    alignComments: await readStoredValue(
      'alignComments',
      DEFAULT_TOML_OPTIONS.alignComments,
    ),
    alignEntries: await readStoredValue(
      'alignEntries',
      DEFAULT_TOML_OPTIONS.alignEntries,
    ),
    allowedBlankLines: await readStoredValue(
      'allowedBlankLines',
      DEFAULT_TOML_OPTIONS.allowedBlankLines,
    ),
    arrayAutoCollapse: await readStoredValue(
      'arrayAutoCollapse',
      DEFAULT_TOML_OPTIONS.arrayAutoCollapse,
    ),
    arrayAutoExpand: await readStoredValue(
      'arrayAutoExpand',
      DEFAULT_TOML_OPTIONS.arrayAutoExpand,
    ),
    compactArrays: await readStoredValue(
      'compactArrays',
      DEFAULT_TOML_OPTIONS.compactArrays,
    ),
    compactEntries: await readStoredValue(
      'compactEntries',
      DEFAULT_TOML_OPTIONS.compactEntries,
    ),
    compactInlineTables: await readStoredValue(
      'compactInlineTables',
      DEFAULT_TOML_OPTIONS.compactInlineTables,
    ),
    indentEntries: await readStoredValue(
      'indentEntries',
      DEFAULT_TOML_OPTIONS.indentEntries,
    ),
    indentTables: await readStoredValue(
      'indentTables',
      DEFAULT_TOML_OPTIONS.indentTables,
    ),
    reorderKeys: await readStoredValue(
      'reorderKeys',
      DEFAULT_TOML_OPTIONS.reorderKeys,
    ),

    languageId,
    parser,
  }
}
