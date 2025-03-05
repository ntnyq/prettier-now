/**
 * @file Prettier Options we use
 */

import type { Options, RequiredOptions } from 'prettier'

/**
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

export type PluginTOMLOptions = {
  /**
   * Align consecutive comments after entries and items vertically. This applies to comments that are after entries or array items
   *
   * @default true
   */
  alignComments: boolean

  /**
   * Align consecutive entries vertically
   *
   * @default false
   */
  alignEntries: boolean

  /**
   * The maximum number of allowed blank lines between entries and tables
   *
   * @default 1
   */
  allowedBlankLines: number

  /**
   * Collapse arrays that don't exceed the maximum column width and don't contain comments
   *
   * @default true
   */
  arrayAutoCollapse: boolean

  /**
   * Expand arrays to multiple lines that exceed the maximum column width
   *
   * @default true
   */
  arrayAutoExpand: boolean

  /**
   * Omit white space padding from single-line arrays
   *
   * @default true
   */
  compactArrays: boolean

  /**
   * Omit white space around `=`
   *
   * @default false
   */
  compactEntries: boolean

  /**
   * Omit white space padding from the start and end of inline tables
   *
   * @default false
   */
  compactInlineTables: boolean

  /**
   * Indent entries under tables
   *
   * @default false
   */
  indentEntries: boolean

  /**
   * Indent based on tables and arrays of tables and their subtables, subtables out of order are not indented
   *
   * @default false
   */
  indentTables: boolean

  /**
   * Alphabetically reorder keys that are not separated by empty lines
   *
   * @default false
   */
  reorderKeys: boolean
}

export type PrettierCoreOptions = Options

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
