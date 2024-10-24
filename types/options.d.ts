/**
 * @file Prettier Options we use
 */

import type { RequiredOptions } from 'prettier'

export type PrettierOptions = Required<
  Pick<
    RequiredOptions,
    | 'printWidth'
    | 'tabWidth'
    | 'useTabs'
    | 'semi'
    | 'singleQuote'
    | 'jsxSingleQuote'
    | 'trailingComma'
    | 'bracketSpacing'
    | 'bracketSameLine'
    | 'arrowParens'
    | 'proseWrap'
    | 'htmlWhitespaceSensitivity'
    | 'endOfLine'
    | 'quoteProps'
    | 'vueIndentScriptAndStyle'
    | 'embeddedLanguageFormatting'
    | 'singleAttributePerLine'
    | 'experimentalTernaries'
  >
>

export type PluginSvelteOptions = {
  /**
   * Sort order for scripts, markup, and styles
   *
   * @default `options-scripts-markup-styles`
   */
  svelteSortOrder:
    | 'options-scripts-markup-styles'
    | 'options-scripts-styles-markup'
    | 'options-markup-styles-scripts'
    | 'options-markup-scripts-styles'
    | 'options-styles-markup-scripts'
    | 'options-styles-scripts-markup'
    | 'scripts-options-markup-styles'
    | 'scripts-options-styles-markup'
    | 'markup-options-styles-scripts'
    | 'markup-options-scripts-styles'
    | 'styles-options-markup-scripts'
    | 'styles-options-scripts-markup'
    | 'scripts-markup-options-styles'
    | 'scripts-styles-options-markup'
    | 'markup-styles-options-scripts'
    | 'markup-scripts-options-styles'
    | 'styles-markup-options-scripts'
    | 'styles-scripts-options-markup'
    | 'scripts-markup-styles-options'
    | 'scripts-styles-markup-options'
    | 'markup-styles-scripts-options'
    | 'markup-scripts-styles-options'
    | 'styles-markup-scripts-options'
    | 'styles-scripts-markup-options'
    | 'none'

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
}

export type PluginXMLOptions = {
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
   * How to quoted attributes in XML
   *
   * @default `preserve`
   */
  xmlQuoteAttributes: 'preserve' | 'double' | 'single'

  /**
   * How to handle whitespaces in XML
   *
   * @default `strict`
   */
  xmlWhitespaceSensitivity: 'strict' | 'ignore' | 'preserve'
}

export type PluginPHPOptions = {
  /**
   * The version of PHP to use for formatting
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

  /**
   * @default true
   */
  trailingCommaPHP: boolean

  /**
   * @default `per-cs`
   */
  braceStyle: 'per-cs' | '1tbs'
}
