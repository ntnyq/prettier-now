/**
 * @file cache
 */

import { StreamLanguage } from '@codemirror/language'
import { interopDefault } from '@ntnyq/utils'
import { LANGUAGE_ID } from '@/constants/language'
import type { CodemirrorLanguage, PrettierPlugin } from '@/types/vendor'

/**
 * codemirror language cache
 */
export const codemirrorLanguageCache = new Map<string, CodemirrorLanguage>()

/**
 * clear codemirror language cache
 */
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
  if (!languageId) {
    return
  }

  if (codemirrorLanguageCache.has(languageId)) {
    return codemirrorLanguageCache.get(languageId)
  }

  let codemirrorLanguage: CodemirrorLanguage | undefined

  if (languageId === LANGUAGE_ID.javascript) {
    const { javascript } = await interopDefault(
      import('@codemirror/lang-javascript'),
    )
    codemirrorLanguage = javascript()
  } else if (languageId === LANGUAGE_ID.jsx) {
    const { javascript } = await interopDefault(
      import('@codemirror/lang-javascript'),
    )
    codemirrorLanguage = javascript({ jsx: true })
  } else if (languageId === LANGUAGE_ID.typescript) {
    const { javascript } = await interopDefault(
      import('@codemirror/lang-javascript'),
    )
    codemirrorLanguage = javascript({ typescript: true })
  } else if (languageId === LANGUAGE_ID.tsx) {
    const { javascript } = await interopDefault(
      import('@codemirror/lang-javascript'),
    )
    codemirrorLanguage = javascript({ jsx: true, typescript: true })
  } else if (languageId === LANGUAGE_ID.html) {
    const { html } = await interopDefault(import('@codemirror/lang-html'))
    codemirrorLanguage = html()
  } else if (languageId === LANGUAGE_ID.vue) {
    const { vue } = await interopDefault(import('@codemirror/lang-vue'))
    codemirrorLanguage = vue()
  } else if (languageId === LANGUAGE_ID.svelte) {
    const { svelte } = await interopDefault(
      import('@replit/codemirror-lang-svelte'),
    )
    codemirrorLanguage = svelte()
  } else if (languageId === LANGUAGE_ID.angular) {
    const { angular } = await interopDefault(import('@codemirror/lang-angular'))
    codemirrorLanguage = angular()
  } else if (languageId === LANGUAGE_ID.css) {
    const { css } = await interopDefault(import('@codemirror/lang-css'))
    codemirrorLanguage = css()
  } else if (languageId === LANGUAGE_ID.less) {
    const { less } = await interopDefault(import('@codemirror/lang-less'))
    codemirrorLanguage = less()
  } else if (languageId === LANGUAGE_ID.scss) {
    const { sass } = await interopDefault(import('@codemirror/lang-sass'))
    codemirrorLanguage = sass()
  } else if (languageId === LANGUAGE_ID.xml) {
    const { xml } = await interopDefault(import('@codemirror/lang-xml'))
    codemirrorLanguage = xml()
  } else if (languageId === LANGUAGE_ID.json) {
    const { json } = await interopDefault(import('@codemirror/lang-json'))
    codemirrorLanguage = json()
  } else if (languageId === LANGUAGE_ID.yaml) {
    const { yaml } = await interopDefault(import('@codemirror/lang-yaml'))
    codemirrorLanguage = yaml()
  } else if (languageId === LANGUAGE_ID.markdown) {
    const { markdown } = await interopDefault(
      import('@codemirror/lang-markdown'),
    )
    codemirrorLanguage = markdown()
  } else if (languageId === LANGUAGE_ID.php) {
    const { php } = await interopDefault(import('@codemirror/lang-php'))
    codemirrorLanguage = php()
  } else if (languageId === LANGUAGE_ID.java) {
    const { java } = await interopDefault(import('@codemirror/lang-java'))
    codemirrorLanguage = java()
  } else if (languageId === LANGUAGE_ID.graphql) {
    const { graphql } = await interopDefault(import('cm6-graphql'))
    codemirrorLanguage = graphql()
  } else if (languageId === LANGUAGE_ID.toml) {
    const { toml } = await interopDefault(
      import('@codemirror/legacy-modes/mode/toml'),
    )
    codemirrorLanguage = StreamLanguage.define(toml)
  } else if (languageId === LANGUAGE_ID.pug) {
    const { pug } = await interopDefault(
      import('@codemirror/legacy-modes/mode/pug'),
    )
    codemirrorLanguage = StreamLanguage.define(pug)
  }

  if (codemirrorLanguage) {
    codemirrorLanguageCache.set(languageId, codemirrorLanguage)
  }

  return codemirrorLanguage
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

  let prettierPlugin: PrettierPlugin | undefined

  if (cacheKey === CACHE_KEY.typescript) {
    prettierPlugin = await interopDefault(import('prettier/plugins/typescript'))
  } else if (cacheKey === CACHE_KEY.html) {
    prettierPlugin = await interopDefault(import('prettier/plugins/html'))
  } else if (cacheKey === CACHE_KEY.markdown) {
    prettierPlugin = await interopDefault(import('prettier/plugins/markdown'))
  } else if (cacheKey === CACHE_KEY.postcss) {
    prettierPlugin = await interopDefault(import('prettier/plugins/postcss'))
  } else if (cacheKey === CACHE_KEY.yaml) {
    prettierPlugin = await interopDefault(import('prettier/plugins/yaml'))
  } else if (cacheKey === CACHE_KEY.graphql) {
    prettierPlugin = await interopDefault(import('prettier/plugins/graphql'))
  } else if (cacheKey === CACHE_KEY.xml) {
    prettierPlugin = await interopDefault(import('@prettier/plugin-xml'))
  } else if (cacheKey === CACHE_KEY.php) {
    prettierPlugin = await interopDefault(
      import('@prettier/plugin-php/standalone'),
    )
  } else if (cacheKey === CACHE_KEY.java) {
    prettierPlugin = await interopDefault(import('prettier-plugin-java'))
  } else if (cacheKey === CACHE_KEY.svelte) {
    prettierPlugin = await interopDefault(
      import('prettier-plugin-svelte/browser'),
    )
  } else if (cacheKey === CACHE_KEY.toml) {
    prettierPlugin = await interopDefault(import('prettier-plugin-toml'))
  } else if (cacheKey === CACHE_KEY.pug) {
    prettierPlugin = await interopDefault(import('@prettier/plugin-pug'))
  }

  if (prettierPlugin) {
    prettierPluginCache.set(cacheKey, prettierPlugin)
  }

  return prettierPlugin
}
export function getAllPrettierPlugins() {
  return [...prettierPluginCache.values()]
}
