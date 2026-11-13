/**
 * @file CodeMirror language loaders
 */

import { StreamLanguage } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'
import { interopDefault } from '@ntnyq/utils'
import { LANGUAGE_ID } from '@/constants/language'
import type { LanguageId } from '@/types/language'
import type { CodemirrorLanguage } from '@/types/vendor'

/**
 * CodeMirror language cache keyed by language id.
 */
const codemirrorLanguageCache = new Map<LanguageId, CodemirrorLanguage>()

/**
 * CodeMirror language loader configuration.
 */
const codemirrorLoaders = {
  async [LANGUAGE_ID.javascript]() {
    const { javascript } = await interopDefault(
      import('@codemirror/lang-javascript'),
    )
    return javascript()
  },
  async [LANGUAGE_ID.typescript]() {
    const { javascript } = await interopDefault(
      import('@codemirror/lang-javascript'),
    )
    return javascript({ typescript: true })
  },
  async [LANGUAGE_ID.html]() {
    const { html } = await interopDefault(import('@codemirror/lang-html'))
    return html()
  },
  async [LANGUAGE_ID.vue]() {
    const { vue } = await interopDefault(import('@codemirror/lang-vue'))
    return vue()
  },
  async [LANGUAGE_ID.svelte]() {
    const { svelte } = await interopDefault(
      import('@replit/codemirror-lang-svelte'),
    )
    return svelte()
  },
  async [LANGUAGE_ID.angular]() {
    const { angular } = await interopDefault(import('@codemirror/lang-angular'))
    return angular()
  },
  async [LANGUAGE_ID.css]() {
    const { css } = await interopDefault(import('@codemirror/lang-css'))
    return css()
  },
  async [LANGUAGE_ID.less]() {
    const { less } = await interopDefault(import('@codemirror/lang-less'))
    return less()
  },
  async [LANGUAGE_ID.scss]() {
    const { sass } = await interopDefault(import('@codemirror/lang-sass'))
    return sass()
  },
  async [LANGUAGE_ID.xml]() {
    const { xml } = await interopDefault(import('@codemirror/lang-xml'))
    return xml()
  },
  async [LANGUAGE_ID.json]() {
    const { json } = await interopDefault(import('@codemirror/lang-json'))
    return json()
  },
  async [LANGUAGE_ID.yaml]() {
    const { yaml } = await interopDefault(import('@codemirror/lang-yaml'))
    return yaml()
  },
  async [LANGUAGE_ID.markdown]() {
    const { markdown } = await interopDefault(
      import('@codemirror/lang-markdown'),
    )
    return markdown()
  },
  async [LANGUAGE_ID.php]() {
    const { php } = await interopDefault(import('@codemirror/lang-php'))
    return php()
  },
  async [LANGUAGE_ID.java]() {
    const { java } = await interopDefault(import('@codemirror/lang-java'))
    return java()
  },
  async [LANGUAGE_ID.graphql]() {
    const { graphql } = await interopDefault(import('cm6-graphql'))
    return graphql()
  },
  async [LANGUAGE_ID.toml]() {
    const { toml } = await interopDefault(
      import('@codemirror/legacy-modes/mode/toml'),
    )
    return StreamLanguage.define(toml)
  },
  async [LANGUAGE_ID.pug]() {
    const { pug } = await interopDefault(
      import('@codemirror/legacy-modes/mode/pug'),
    )
    return StreamLanguage.define({
      ...pug,
      tokenTable: {
        indent: t.meta,
        colon: t.punctuation,
        dot: t.punctuation,
      },
    })
  },
} as const

/**
 * Load a CodeMirror language extension for a language id.
 *
 * @param languageId - Language id to load.
 * @returns CodeMirror language support when available.
 */
export async function loadCodemirrorLanguage(languageId?: LanguageId) {
  if (!languageId) {
    return
  }

  if (codemirrorLanguageCache.has(languageId)) {
    return codemirrorLanguageCache.get(languageId)
  }

  const loader = codemirrorLoaders[languageId]
  if (!loader) {
    return
  }

  const codemirrorLanguage = await loader()
  if (codemirrorLanguage) {
    codemirrorLanguageCache.set(languageId, codemirrorLanguage)
  }

  return codemirrorLanguage
}
