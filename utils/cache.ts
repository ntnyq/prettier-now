/**
 * @file cache
 */

import type { LanguageSupport } from '@codemirror/language'
import type { Extension } from '@codemirror/state'
import type { Plugin } from 'prettier'

export const prettierPluginCache = new Map<string, Plugin>()

export const codemirrorLanguageCache = new Map<string, LanguageSupport | Extension[]>()
