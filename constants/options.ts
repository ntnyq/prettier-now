/**
 * @file Default prettier options
 */

import type { PrettierOptions } from '@/types/options'

/**
 * Prettier default options
 *
 * @see {@link https://prettier.io/docs/en/options}
 */
export const DEFAULT_OPTIONS: PrettierOptions = {
  printWidth: 80,

  tabWidth: 2,

  useTabs: false,

  semi: true,

  singleQuote: false,

  bracketSpacing: true,

  bracketSameLine: false,

  jsxSingleQuote: false,

  singleAttributePerLine: false,

  vueIndentScriptAndStyle: false,

  quoteProps: 'as-needed',

  trailingComma: 'all',

  arrowParens: 'always',

  proseWrap: 'preserve',

  htmlWhitespaceSensitivity: 'css',

  endOfLine: 'auto',

  embeddedLanguageFormatting: 'auto',

  experimentalTernaries: false,
}
