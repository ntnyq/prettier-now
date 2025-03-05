/**
 * @file types for codemirror
 */

import type { LanguageSupport, StreamLanguage } from '@codemirror/language'
import type { Extension } from '@codemirror/state'
import type { Plugin } from 'prettier'

/**
 * Codemirror extension
 */
export type CodemirrorExtension = Extension

/**
 * Codemirror language
 */
export type CodemirrorLanguage =
  | Extension[]
  | LanguageSupport
  | StreamLanguage<unknown>

/**
 * Prettier plugin
 */
export type PrettierPlugin = Plugin
