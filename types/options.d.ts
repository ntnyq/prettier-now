/**
 * @file Prettier Options we use
 */

import type { RequiredOptions } from 'prettier'

export type PluginJavaOptions = {
  entrypoint: string
}

export type PluginPHPOptions = {
  /**
   * @default `per-cs`
   */
  braceStyle: '1tbs' | 'per-cs'

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

export type PrettierOptions = Required<
  Pick<
    RequiredOptions,
    | 'arrowParens'
    | 'bracketSameLine'
    | 'bracketSpacing'
    | 'embeddedLanguageFormatting'
    | 'endOfLine'
    | 'experimentalTernaries'
    | 'htmlWhitespaceSensitivity'
    | 'jsxSingleQuote'
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
