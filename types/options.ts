/**
 * @file Prettier Options we use
 */

import type { Options, RequiredOptions } from 'prettier'
import type { JAVA_ENTRYPOINTS } from '@/constants/options'
import type {
  PHP_BRACE_STYLES,
  PHP_VERSIONS,
  SVELTE_SORT_ORDERS,
  TOML_OPTION_VALUES,
  XML_OPTION_VALUES,
} from '@/constants/optionValues'

/**
 * Java plugin-specific Prettier options.
 *
 * @see {@link https://github.com/jhipster/prettier-java/tree/main/packages/prettier-plugin-java}
 */
export type PluginJavaOptions = {
  /**
   * Prettify from the entrypoint, allowing to use prettier on snippet
   *
   * @default `compilationUnit`
   */
  entrypoint: (typeof JAVA_ENTRYPOINTS)[number]
}

/**
 * PHP plugin-specific Prettier options.
 *
 * @see {@link https://github.com/prettier/plugin-php}
 */
export type PluginPHPOptions = {
  /**
   * Print one space or newline for code blocks (classes and functions)
   *
   * @default `per-cs`
   */
  braceStyle: (typeof PHP_BRACE_STYLES)[number]

  /**
   * Minimum target PHP version
   *
   * @default `7.0`
   */
  phpVersion: (typeof PHP_VERSIONS)[number]

  /**
   * Print trailing commas wherever possible when multi-line
   *
   * @default true
   */
  trailingCommaPHP: boolean
}

/**
 * Svelte plugin-specific Prettier options.
 */
export type PluginSvelteOptions = {
  /**
   * Enable/disable component attribute shorthand if attribute name and expressions are same
   *
   * @default true
   */
  svelteAllowShorthand: boolean

  /**
   * Whether or not to indent the code inside <script> and <style> tags in Svelte files
   *
   * @default true
   */
  svelteIndentScriptAndStyle: boolean

  /**
   * Sort order for scripts, markup, and styles
   *
   * @default `options-scripts-markup-styles`
   */
  svelteSortOrder: (typeof SVELTE_SORT_ORDERS)[number]
}

/**
 * XML plugin-specific Prettier options.
 */
export type PluginXMLOptions = {
  /**
   * How to quoted attributes in XML
   *
   * @default `preserve`
   */
  xmlQuoteAttributes: (typeof XML_OPTION_VALUES.xmlQuoteAttributes)[number]

  /**
   * Adds a space before self-closing tags
   *
   * @default true
   */
  xmlSelfClosingSpace: boolean

  /**
   * Orders XML attributes by key alphabetically while prioritizing xmlns attributes
   *
   * @default false
   */
  xmlSortAttributesByKey: boolean

  /**
   * How to handle whitespaces in XML
   *
   * @default `strict`
   */
  xmlWhitespaceSensitivity: (typeof XML_OPTION_VALUES.xmlWhitespaceSensitivity)[number]
}

/**
 * Tombi plugin options. Null leaves an option unset so formatter defaults and
 * inherited core Prettier options remain effective.
 */
export type PluginTOMLOptions = {
  /**
   * Spaces inside single-line array brackets.
   */
  arrayBracketSpaceWidth: number | null

  /**
   * Spaces after commas in single-line arrays.
   */
  arrayCommaSpaceWidth: number | null

  /**
   * Comment text normalization style.
   */
  commentStyle: (typeof TOML_OPTION_VALUES.commentStyle)[number] | null

  /**
   * Maximum blank lines between groups, from 1 to 255.
   */
  groupBlankLinesLimit: number | null

  /**
   * Whether to indent sub-tables.
   */
  indentSubTables: boolean | null

  /**
   * Whether to indent key-value pairs within tables.
   */
  indentTableKeyValuePairs: boolean | null

  /**
   * Spaces inside single-line inline table braces; null inherits bracketSpacing.
   */
  inlineTableBraceSpaceWidth: number | null

  /**
   * Spaces after commas in single-line inline tables.
   */
  inlineTableCommaSpaceWidth: number | null

  /**
   * Quote style for keys; null inherits the string quote style.
   */
  keyQuoteStyle: (typeof TOML_OPTION_VALUES.quoteStyle)[number] | null

  /**
   * Whether to align equals signs in consecutive key-value pairs.
   */
  keyValueEqualsSignAlignment: boolean | null

  /**
   * Spaces around equals signs in key-value pairs.
   */
  keyValueEqualsSignSpaceWidth: number | null

  /**
   * Quote style for strings; null inherits singleQuote.
   */
  stringQuoteStyle: (typeof TOML_OPTION_VALUES.quoteStyle)[number] | null

  /**
   * Blank lines between tables.
   */
  tableBlankLines: number | null

  /**
   * TOML syntax version; null uses the formatter default.
   */
  tomlVersion: (typeof TOML_OPTION_VALUES.tomlVersion)[number] | null

  /**
   * Whether to align trailing comments.
   */
  trailingCommentAlignment: boolean | null

  /**
   * Spaces before trailing comments.
   */
  trailingCommentSpaceWidth: number | null

  /**
   * Delimiter between date and time.
   */
  dateTimeDelimiter:
    (typeof TOML_OPTION_VALUES.dateTimeDelimiter)[number] | null
}

/**
 * Base Prettier options accepted by the standalone formatter.
 */
export type PrettierCoreOptions = Options

/**
 * Required Prettier options persisted by the extension.
 */
export type PrettierOptions = Required<
  Pick<
    RequiredOptions,
    | 'arrowParens'
    | 'bracketSameLine'
    | 'bracketSpacing'
    | 'embeddedLanguageFormatting'
    | 'endOfLine'
    | 'experimentalOperatorPosition'
    | 'experimentalTernaries'
    | 'htmlWhitespaceSensitivity'
    | 'jsxSingleQuote'
    | 'objectWrap'
    | 'printWidth'
    | 'proseWrap'
    | 'quoteProps'
    | 'semi'
    | 'singleAttributePerLine'
    | 'singleQuote'
    | 'tabWidth'
    | 'trailingComma'
    | 'useTabs'
    | 'vueIndentScriptAndStyle'
  >
>
