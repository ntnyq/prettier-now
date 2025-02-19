/**
 * @file types for codemirror
 */

import type { LanguageSupport } from '@codemirror/language'
import type { Extension } from '@codemirror/state'
import type { Plugin } from 'prettier'

export type CodemirrorExtension = Extension
export type CodemirrorLanguage = Extension[] | LanguageSupport

export type PrettierPlugin = Plugin
