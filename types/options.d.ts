/**
 * @file Prettier Options we use
 */

import type { RequiredOptions } from 'prettier'

export type PrettierOptions = Omit<
  RequiredOptions,
  | 'rangeStart'
  | 'rangeEnd'
  | 'parser'
  | 'filePath'
  | 'plugins'
  | 'insertPragma'
  | 'jsxBracketSameLine'
>
