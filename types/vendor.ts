/**
 * @file types for codemirror
 */

import type { LanguageSupport, StreamLanguage } from '@codemirror/language'
import type { Extension } from '@codemirror/state'
import type { Plugin } from 'prettier'

/**
 * CodeMirror extension value accepted by the editor.
 */
export type CodemirrorExtension = Extension

/**
 * CodeMirror language support returned by dynamic language loaders.
 */
export type CodemirrorLanguage =
  | Extension[]
  | LanguageSupport
  | StreamLanguage<unknown>

/**
 * Prettier plugin module used by the standalone formatter.
 */
export type PrettierPlugin = Plugin
