/**
 * @file format via prettier
 */

import pluginAngular from 'prettier/plugins/angular'
import pluginBabel from 'prettier/plugins/babel'
import pluginEstree from 'prettier/plugins/estree'
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

export type FormatOptions = PrettierCoreOptions
  & Partial<
    PluginXMLOptions
      & PluginPHPOptions
      & PluginJavaOptions
      & PluginSvelteOptions
      & PluginTOMLOptions
  > & {
    languageId: string
  }

/**
 * prettier instance
 */
let prettier: typeof import('prettier/standalone') | undefined

/**
 * format source code via prettier
 *
 * @param source - source code
 * @param options - format options
 * @returns formatted source code
 */
export async function formatViaPrettier(
  source: string,
  options: FormatOptions,
) {
  if (!prettier) {
    prettier = await import('prettier/standalone')
  }

  const { languageId, ...formatOptions } = options

  const loadedPlugin = await loadPrettierPlugin(languageId)
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

      // current language plugin
      ...languagePlugins,
    ],
  })

  return formatted
}
