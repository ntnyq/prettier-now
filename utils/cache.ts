/**
 * @file cache
 */

import { interopDefault } from '@ntnyq/utils'
import { LANGUAGE_ID } from '@/constants/language'
import type { CodemirrorLanguage, PrettierPlugin } from '@/types/vendor'

/**
 * codemirror language
 */
export const codemirrorLanguageCache = new Map<string, CodemirrorLanguage>()
export function clearCodemirrorLanguageCache() {
  codemirrorLanguageCache.clear()
}
/**
 * load codemirror language
 *
 * @param languageId - language id
 * @returns codemirror language
 */
export async function loadCodemirrorLanguage(languageId?: string) {
  if (!languageId) return

  if (codemirrorLanguageCache.has(languageId)) {
    return codemirrorLanguageCache.get(languageId)
  }

  let codemirrorLanguage: CodemirrorLanguage | undefined

  if (languageId === LANGUAGE_ID.javascript) {
    const { javascript } = await interopDefault(import('@codemirror/lang-javascript'))
    codemirrorLanguage = javascript()
  }
  if (languageId === LANGUAGE_ID.jsx) {
    const { javascript } = await interopDefault(import('@codemirror/lang-javascript'))
    codemirrorLanguage = javascript({ jsx: true })
  }
  if (languageId === LANGUAGE_ID.typescript) {
    const { javascript } = await interopDefault(import('@codemirror/lang-javascript'))
    codemirrorLanguage = javascript({ typescript: true })
  }
  if (languageId === LANGUAGE_ID.tsx) {
    const { javascript } = await interopDefault(import('@codemirror/lang-javascript'))
    codemirrorLanguage = javascript({ jsx: true, typescript: true })
  }
  if (languageId === LANGUAGE_ID.html) {
    const { html } = await interopDefault(import('@codemirror/lang-html'))
    codemirrorLanguage = html()
  }
  if (languageId === LANGUAGE_ID.vue) {
    const { vue } = await interopDefault(import('@codemirror/lang-vue'))
    codemirrorLanguage = vue()
  }
  if (languageId === LANGUAGE_ID.svelte) {
    const { svelte } = await interopDefault(import('@replit/codemirror-lang-svelte'))
    codemirrorLanguage = svelte()
  }
  if (languageId === LANGUAGE_ID.angular) {
    const { angular } = await interopDefault(import('@codemirror/lang-angular'))
    codemirrorLanguage = angular()
  }
  if (languageId === LANGUAGE_ID.css) {
    const { css } = await interopDefault(import('@codemirror/lang-css'))
    codemirrorLanguage = css()
  }
  if (languageId === LANGUAGE_ID.less) {
    const { less } = await interopDefault(import('@codemirror/lang-less'))
    codemirrorLanguage = less()
  }
  if (languageId === LANGUAGE_ID.scss) {
    const { sass } = await interopDefault(import('@codemirror/lang-sass'))
    codemirrorLanguage = sass()
  }
  if (languageId === LANGUAGE_ID.xml) {
    const { xml } = await interopDefault(import('@codemirror/lang-xml'))
    codemirrorLanguage = xml()
  }
  if (languageId === LANGUAGE_ID.json) {
    const { json } = await interopDefault(import('@codemirror/lang-json'))
    codemirrorLanguage = json()
  }
  if (languageId === LANGUAGE_ID.yaml) {
    const { yaml } = await interopDefault(import('@codemirror/lang-yaml'))
    codemirrorLanguage = yaml()
  }
  if (languageId === LANGUAGE_ID.markdown) {
    const { markdown } = await interopDefault(import('@codemirror/lang-markdown'))
    codemirrorLanguage = markdown()
  }
  if (languageId === LANGUAGE_ID.php) {
    const { php } = await interopDefault(import('@codemirror/lang-php'))
    codemirrorLanguage = php()
  }
  if (languageId === LANGUAGE_ID.java) {
    const { java } = await interopDefault(import('@codemirror/lang-java'))
    codemirrorLanguage = java()
  }
  if (languageId === LANGUAGE_ID.graphql) {
    const { graphql } = await interopDefault(import('cm6-graphql'))
    codemirrorLanguage = graphql()
  }
  if (codemirrorLanguage) {
    codemirrorLanguageCache.set(languageId, codemirrorLanguage)
  }
  return codemirrorLanguage
}

/**
 * prettier plugin
 */
export const prettierPluginCache = new Map<string, PrettierPlugin>()
export function clearPrettierPluginCache() {
  prettierPluginCache.clear()
}
export const CACHE_KEY = {
  typescript: 'typescript',
  html: 'html',
  postcss: 'postcss',
  xml: 'xml',
  yaml: 'yaml',
  php: 'php',
  java: 'java',
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
}
export async function loadPrettierPlugin(languageId?: string) {
  if (!languageId) return

  const cacheKey = prettierPluginCachekeyMap[languageId as keyof typeof prettierPluginCachekeyMap]

  if (!cacheKey) return

  if (prettierPluginCache.has(cacheKey)) {
    return prettierPluginCache.get(cacheKey)
  }

  let prettierPlugin: PrettierPlugin | undefined

  if (cacheKey === CACHE_KEY.typescript) {
    prettierPlugin = await interopDefault(import('prettier/plugins/typescript'))
  }
  if (cacheKey === CACHE_KEY.html) {
    prettierPlugin = await interopDefault(import('prettier/plugins/html'))
  }
  if (cacheKey === CACHE_KEY.markdown) {
    prettierPlugin = await interopDefault(import('prettier/plugins/markdown'))
  }
  if (cacheKey === CACHE_KEY.postcss) {
    prettierPlugin = await interopDefault(import('prettier/plugins/postcss'))
  }
  if (cacheKey === CACHE_KEY.yaml) {
    prettierPlugin = await interopDefault(import('prettier/plugins/yaml'))
  }
  if (cacheKey === CACHE_KEY.graphql) {
    prettierPlugin = await interopDefault(import('prettier/plugins/graphql'))
  }
  if (cacheKey === CACHE_KEY.xml) {
    prettierPlugin = await interopDefault(import('@prettier/plugin-xml'))
  }
  if (cacheKey === CACHE_KEY.php) {
    prettierPlugin = await interopDefault(import('@prettier/plugin-php/standalone'))
  }
  if (cacheKey === CACHE_KEY.java) {
    prettierPlugin = await interopDefault(import('prettier-plugin-java'))
  }
  if (cacheKey === CACHE_KEY.svelte) {
    prettierPlugin = await interopDefault(import('prettier-plugin-svelte/browser'))
  }

  if (prettierPlugin) {
    prettierPluginCache.set(cacheKey, prettierPlugin)
  }

  return prettierPlugin
}
export function getAllPrettierPlugins() {
  return [...prettierPluginCache.values()]
}
