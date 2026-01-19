/**
 * @file cache
 */

import { interopDefault } from '@ntnyq/utils'
import { LANGUAGE_ID } from '@/constants/language'
import type { PrettierPlugin } from '@/types/vendor'

/**
 * Monaco Editor language ID mapping
 * Maps our internal language IDs to Monaco's language identifiers
 */
const monacoLanguageMap: Record<string, string> = {
  [LANGUAGE_ID.javascript]: 'javascript',
  [LANGUAGE_ID.jsx]: 'javascript',
  [LANGUAGE_ID.typescript]: 'typescript',
  [LANGUAGE_ID.tsx]: 'typescript',
  [LANGUAGE_ID.html]: 'html',
  [LANGUAGE_ID.vue]: 'html',
  [LANGUAGE_ID.svelte]: 'html',
  [LANGUAGE_ID.angular]: 'html',
  [LANGUAGE_ID.css]: 'css',
  [LANGUAGE_ID.less]: 'less',
  [LANGUAGE_ID.scss]: 'scss',
  [LANGUAGE_ID.xml]: 'xml',
  [LANGUAGE_ID.json]: 'json',
  [LANGUAGE_ID.yaml]: 'yaml',
  [LANGUAGE_ID.markdown]: 'markdown',
  [LANGUAGE_ID.php]: 'php',
  [LANGUAGE_ID.java]: 'java',
  [LANGUAGE_ID.graphql]: 'graphql',
  [LANGUAGE_ID.toml]: 'ini',
  [LANGUAGE_ID.pug]: 'pug',
}

/**
 * Get Monaco Editor language ID
 * @param languageId - our internal language id
 * @returns Monaco language id
 */
export function getMonacoLanguage(languageId?: string): string {
  if (!languageId) {
    return 'plaintext'
  }
  return monacoLanguageMap[languageId] || 'plaintext'
}

/**
 * prettier plugin cache
 */
export const prettierPluginCache = new Map<string, PrettierPlugin>()

/**
 * clear prettier plugin cache
 */
export function clearPrettierPluginCache() {
  prettierPluginCache.clear()
}
export const CACHE_KEY = {
  typescript: 'typescript',
  html: 'html',
  postcss: 'postcss',
  xml: 'xml',
  yaml: 'yaml',
  toml: 'toml',
  php: 'php',
  java: 'java',
  pug: 'pug',
  svelte: 'svelte',
  graphql: 'graphql',
  markdown: 'markdown',
}
export const prettierPluginCachekeyMap = {
  [LANGUAGE_ID.typescript]: CACHE_KEY.typescript,
  [LANGUAGE_ID.html]: CACHE_KEY.html,
  [LANGUAGE_ID.vue]: CACHE_KEY.html,
  [LANGUAGE_ID.angular]: CACHE_KEY.html,
  [LANGUAGE_ID.markdown]: CACHE_KEY.markdown,
  [LANGUAGE_ID.css]: CACHE_KEY.postcss,
  [LANGUAGE_ID.less]: CACHE_KEY.postcss,
  [LANGUAGE_ID.scss]: CACHE_KEY.postcss,
  [LANGUAGE_ID.xml]: CACHE_KEY.xml,
  [LANGUAGE_ID.yaml]: CACHE_KEY.yaml,
  [LANGUAGE_ID.php]: CACHE_KEY.php,
  [LANGUAGE_ID.java]: CACHE_KEY.java,
  [LANGUAGE_ID.svelte]: CACHE_KEY.svelte,
  [LANGUAGE_ID.graphql]: CACHE_KEY.graphql,
  [LANGUAGE_ID.toml]: CACHE_KEY.toml,
  [LANGUAGE_ID.pug]: CACHE_KEY.pug,
}

/**
 * Prettier plugin loader configuration
 */
const prettierLoaders = {
  [CACHE_KEY.typescript]: () =>
    interopDefault(import('prettier/plugins/typescript')),
  [CACHE_KEY.html]: () => interopDefault(import('prettier/plugins/html')),
  [CACHE_KEY.markdown]: () =>
    interopDefault(import('prettier/plugins/markdown')),
  [CACHE_KEY.postcss]: () => interopDefault(import('prettier/plugins/postcss')),
  [CACHE_KEY.yaml]: () => interopDefault(import('prettier/plugins/yaml')),
  [CACHE_KEY.graphql]: () => interopDefault(import('prettier/plugins/graphql')),
  [CACHE_KEY.xml]: () => interopDefault(import('@prettier/plugin-xml')),
  [CACHE_KEY.php]: () =>
    interopDefault(import('@prettier/plugin-php/standalone')),
  [CACHE_KEY.java]: () => interopDefault(import('prettier-plugin-java')),
  [CACHE_KEY.svelte]: () =>
    interopDefault(import('prettier-plugin-svelte/browser')),
  [CACHE_KEY.toml]: () => interopDefault(import('prettier-plugin-toml')),
  [CACHE_KEY.pug]: () => interopDefault(import('@prettier/plugin-pug')),
} as const

/**
 * load prettier plugin
 * @param languageId - language id
 * @returns prettier plugin
 */
export async function loadPrettierPlugin(languageId?: string) {
  if (!languageId) {
    return
  }

  const cacheKey =
    prettierPluginCachekeyMap[
      languageId as keyof typeof prettierPluginCachekeyMap
    ]

  if (!cacheKey) {
    return
  }

  if (prettierPluginCache.has(cacheKey)) {
    return prettierPluginCache.get(cacheKey)
  }

  const loader = prettierLoaders[cacheKey as keyof typeof prettierLoaders]
  if (!loader) {
    return
  }

  const prettierPlugin = await loader()
  if (prettierPlugin) {
    prettierPluginCache.set(cacheKey, prettierPlugin)
  }

  return prettierPlugin
}
export function getAllPrettierPlugins() {
  return [...prettierPluginCache.values()]
}
