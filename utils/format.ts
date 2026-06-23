/**
 * @file format via prettier
 */

import pluginAngular from 'prettier/plugins/angular'
import pluginBabel from 'prettier/plugins/babel'
import pluginEstree from 'prettier/plugins/estree'
import pluginPostcss from 'prettier/plugins/postcss'
import { LANGUAGE_ID } from '@/constants/language'
import { loadPrettierPlugin } from '@/utils/cache'
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
const PRELOADED_PLUGIN_LANGUAGE_IDS = new Set([
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
    languageId: string
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

  const loadedPlugin = PRELOADED_PLUGIN_LANGUAGE_IDS.has(languageId)
    ? undefined
    : await loadPrettierPlugin(languageId)
  const languagePlugins: PrettierPlugin[] = loadedPlugin ? [loadedPlugin] : []
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
