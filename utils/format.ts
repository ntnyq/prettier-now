/**
 * @file format via prettier
 */

import pluginAngular from 'prettier/plugins/angular'
import pluginBabel from 'prettier/plugins/babel'
import pluginEstree from 'prettier/plugins/estree'
import pluginPostcss from 'prettier/plugins/postcss'
import { LANGUAGE_ID } from '@/constants/language'
import { loadPrettierPlugin } from '@/utils/prettierPlugins'
import type { LanguageId } from '@/types/language'
import type {
  PluginJavaOptions,
  PluginPHPOptions,
  PluginSvelteOptions,
  PluginTOMLOptions,
  PluginXMLOptions,
  PrettierCoreOptions,
} from '@/types/options'
import type { PrettierPlugin } from '@/types/vendor'

const PUG_DEFAULT_FORMAT_OPTIONS = {
  pugEmptyAttributesForceQuotes: [],
  pugSortAttributesBeginning: [],
  pugSortAttributesEnd: [],
} as const
const TYPESCRIPT_CONTAINER_LANGUAGE_IDS = new Set<LanguageId>([
  LANGUAGE_ID.vue,
  LANGUAGE_ID.svelte,
  LANGUAGE_ID.markdown,
  LANGUAGE_ID.html,
  LANGUAGE_ID.angular,
])
const PRELOADED_PLUGIN_LANGUAGE_IDS = new Set<LanguageId>([
  LANGUAGE_ID.css,
  LANGUAGE_ID.less,
  LANGUAGE_ID.scss,
])

/**
 * Formatting options passed to the standalone Prettier runner.
 */
export type FormatOptions = PrettierCoreOptions
  & Partial<
    PluginXMLOptions
      & PluginPHPOptions
      & PluginJavaOptions
      & PluginSvelteOptions
      & PluginTOMLOptions
  > & {
    /**
     * Language identifier used to resolve the parser and plugin.
     */
    languageId: LanguageId
  }

/**
 * Lazily loaded Prettier standalone instance.
 */
let prettier: typeof import('prettier/standalone') | undefined

/**
 * Format source code via Prettier.
 *
 * @param source - Source code to format.
 * @param options - Format options.
 * @returns Formatted source code.
 */
export async function formatViaPrettier(
  source: string,
  options: FormatOptions,
) {
  if (!prettier) {
    prettier = await import('prettier/standalone')
  }

  const { languageId, ...formatOptions } = options

  // Null represents an inherited TOML setting in storage, but Prettier rejects
  // null plugin values. Omit them before Prettier validates its options.
  for (const [name, value] of Object.entries(formatOptions)) {
    if (value === null) {
      delete formatOptions[name]
    }
  }

  const loadedPlugin = PRELOADED_PLUGIN_LANGUAGE_IDS.has(languageId)
    ? undefined
    : await loadPrettierPlugin(languageId)
  const languagePlugins: PrettierPlugin[] = loadedPlugin ? [loadedPlugin] : []
  if (
    TYPESCRIPT_CONTAINER_LANGUAGE_IDS.has(languageId)
    && formatOptions.embeddedLanguageFormatting !== 'off'
  ) {
    const typescriptPlugin = await loadPrettierPlugin(LANGUAGE_ID.typescript)
    if (typescriptPlugin) {
      languagePlugins.push(typescriptPlugin)
    }
  }
  if (
    languageId === LANGUAGE_ID.markdown
    && formatOptions.embeddedLanguageFormatting !== 'off'
  ) {
    const embeddedPlugins = await Promise.all(
      [LANGUAGE_ID.html, LANGUAGE_ID.yaml, LANGUAGE_ID.graphql].map(language =>
        loadPrettierPlugin(language),
      ),
    )
    languagePlugins.push(
      ...embeddedPlugins.filter(plugin => plugin !== undefined),
    )
  }
  const languageOptions =
    languageId === LANGUAGE_ID.pug ? PUG_DEFAULT_FORMAT_OPTIONS : {}

  const formatted = await prettier.format(source, {
    ...languageOptions,
    ...formatOptions,
    plugins: [
      // preload plugins javascript, json and sharable parsers
      pluginBabel,
      pluginEstree,
      pluginAngular,
      pluginPostcss,

      // current language plugin
      ...languagePlugins,
    ],
  })

  return formatted
}
