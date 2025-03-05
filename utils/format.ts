/**
 * @file format via prettier
 */

import pluginAngular from 'prettier/plugins/angular'
import pluginBabel from 'prettier/plugins/babel'
import pluginEstree from 'prettier/plugins/estree'
import { getAllPrettierPlugins, loadPrettierPlugin } from '@/utils/cache'
import type {
  PluginJavaOptions,
  PluginPHPOptions,
  PluginSvelteOptions,
  PluginTOMLOptions,
  PluginXMLOptions,
  PrettierCoreOptions,
} from '@/types/options'
import type { PrettierPlugin } from '@/types/vendor'

/**
 * preload plugins
 */
export const preloadPlugins: PrettierPlugin[] = [
  // javascript, json and sharable parsers
  pluginBabel,
  pluginEstree,
  pluginAngular,
]

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
  await loadPrettierPlugin(options.languageId)

  return prettier.format(source, {
    ...formatOptions,
    plugins: [
      // built-in plugins
      ...preloadPlugins,

      // get cached plugins
      ...getAllPrettierPlugins(),
    ],
  })
}
