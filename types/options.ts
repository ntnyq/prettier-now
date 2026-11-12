/**
 * @file Prettier Options we use
 */

import type { Options, RequiredOptions } from 'prettier'

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
  entrypoint: string
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
  braceStyle: '1tbs' | 'per-cs'

  /**
   * Print trailing commas wherever possible when multi-line
   *
   * @default true
   */
  trailingCommaPHP: boolean

  /**
   * Minimum target PHP version
   *
   * @default `7.0`
   */
  phpVersion:
    | '5.0'
    | '5.1'
    | '5.2'
    | '5.3'
    | '5.4'
    | '5.5'
    | '5.6'
    | '7.0'
    | '7.1'
    | '7.2'
    | '7.3'
    | '7.4'
    | '8.0'
    | '8.1'
    | '8.2'
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
  svelteSortOrder:
    | 'markup-options-scripts-styles'
    | 'markup-options-styles-scripts'
    | 'markup-scripts-options-styles'
    | 'markup-scripts-styles-options'
    | 'markup-styles-options-scripts'
    | 'markup-styles-scripts-options'
    | 'none'
    | 'options-markup-scripts-styles'
    | 'options-markup-styles-scripts'
    | 'options-scripts-markup-styles'
    | 'options-scripts-styles-markup'
    | 'options-styles-markup-scripts'
    | 'options-styles-scripts-markup'
    | 'scripts-markup-options-styles'
    | 'scripts-markup-styles-options'
    | 'scripts-options-markup-styles'
    | 'scripts-options-styles-markup'
    | 'scripts-styles-markup-options'
    | 'scripts-styles-options-markup'
    | 'styles-markup-options-scripts'
    | 'styles-markup-scripts-options'
    | 'styles-options-markup-scripts'
    | 'styles-options-scripts-markup'
    | 'styles-scripts-markup-options'
    | 'styles-scripts-options-markup'
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
  xmlQuoteAttributes: 'double' | 'preserve' | 'single'

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
  xmlWhitespaceSensitivity: 'ignore' | 'preserve' | 'strict'
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
  commentStyle: 'normalize' | 'preserve' | null

  /**
   * Delimiter between date and time.
   */
  dateTimeDelimiter: 'preserve' | 'space' | 'T' | null

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
  keyQuoteStyle: 'double' | 'preserve' | 'single' | null

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
  stringQuoteStyle: 'double' | 'preserve' | 'single' | null

  /**
   * Blank lines between tables.
   */
  tableBlankLines: number | null

  /**
   * TOML syntax version; null uses the formatter default.
   */
  tomlVersion: 'v1.0.0' | 'v1.1.0-preview' | 'v1.1.0' | null

  /**
   * Whether to align trailing comments.
   */
  trailingCommentAlignment: boolean | null

  /**
   * Spaces before trailing comments.
   */
  trailingCommentSpaceWidth: number | null
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
