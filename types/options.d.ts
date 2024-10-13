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
