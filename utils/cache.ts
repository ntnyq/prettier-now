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
 * CodeMirror language loader configuration
 */
const codemirrorLoaders = {
  [LANGUAGE_ID.javascript]: async () => {
    const { javascript } = await interopDefault(
      import('@codemirror/lang-javascript'),
    )
    return javascript()
  },
  [LANGUAGE_ID.jsx]: async () => {
    const { javascript } = await interopDefault(
      import('@codemirror/lang-javascript'),
    )
    return javascript({ jsx: true })
  },
  [LANGUAGE_ID.typescript]: async () => {
    const { javascript } = await interopDefault(
      import('@codemirror/lang-javascript'),
    )
    return javascript({ typescript: true })
  },
  [LANGUAGE_ID.tsx]: async () => {
    const { javascript } = await interopDefault(
      import('@codemirror/lang-javascript'),
    )
    return javascript({ jsx: true, typescript: true })
  },
  [LANGUAGE_ID.html]: async () => {
    const { html } = await interopDefault(import('@codemirror/lang-html'))
    return html()
  },
  [LANGUAGE_ID.vue]: async () => {
    const { vue } = await interopDefault(import('@codemirror/lang-vue'))
    return vue()
  },
  [LANGUAGE_ID.svelte]: async () => {
    const { svelte } = await interopDefault(
      import('@replit/codemirror-lang-svelte'),
    )
    return svelte()
  },
  [LANGUAGE_ID.angular]: async () => {
    const { angular } = await interopDefault(import('@codemirror/lang-angular'))
    return angular()
  },
  [LANGUAGE_ID.css]: async () => {
    const { css } = await interopDefault(import('@codemirror/lang-css'))
    return css()
  },
  [LANGUAGE_ID.less]: async () => {
    const { less } = await interopDefault(import('@codemirror/lang-less'))
    return less()
  },
  [LANGUAGE_ID.scss]: async () => {
    const { sass } = await interopDefault(import('@codemirror/lang-sass'))
    return sass()
  },
  [LANGUAGE_ID.xml]: async () => {
    const { xml } = await interopDefault(import('@codemirror/lang-xml'))
    return xml()
  },
  [LANGUAGE_ID.json]: async () => {
    const { json } = await interopDefault(import('@codemirror/lang-json'))
    return json()
  },
  [LANGUAGE_ID.yaml]: async () => {
    const { yaml } = await interopDefault(import('@codemirror/lang-yaml'))
    return yaml()
  },
  [LANGUAGE_ID.markdown]: async () => {
    const { markdown } = await interopDefault(
      import('@codemirror/lang-markdown'),
    )
    return markdown()
  },
  [LANGUAGE_ID.php]: async () => {
    const { php } = await interopDefault(import('@codemirror/lang-php'))
    return php()
  },
  [LANGUAGE_ID.java]: async () => {
    const { java } = await interopDefault(import('@codemirror/lang-java'))
    return java()
  },
  [LANGUAGE_ID.graphql]: async () => {
    const { graphql } = await interopDefault(import('cm6-graphql'))
    return graphql()
  },
  [LANGUAGE_ID.toml]: async () => {
    const { toml } = await interopDefault(
      import('@codemirror/legacy-modes/mode/toml'),
    )
    return StreamLanguage.define(toml)
  },
  [LANGUAGE_ID.pug]: async () => {
    const { pug } = await interopDefault(
      import('@codemirror/legacy-modes/mode/pug'),
    )
    return StreamLanguage.define(pug)
  },
} as const

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

  const loader = codemirrorLoaders[languageId as keyof typeof codemirrorLoaders]
  if (!loader) {
    return
  }

  const codemirrorLanguage = await loader()
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
