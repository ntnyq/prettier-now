/**
 * @file format via prettier
 */

import pluginAngular from 'prettier/plugins/angular'
import pluginBabel from 'prettier/plugins/babel'
import pluginEstree from 'prettier/plugins/estree'
import type { Options, Plugin } from 'prettier'
import type {
  PluginJavaOptions,
  PluginPHPOptions,
  PluginSvelteOptions,
  PluginXMLOptions,
} from '@/types/options'

/**
 * preload plugins
 */
export const preloadPlugins: Plugin[] = [
  // javascript, json and sharable parsers
  pluginBabel,
  pluginEstree,
  pluginAngular,
]

export type FormatOptions = Options &
  Partial<PluginXMLOptions & PluginPHPOptions & PluginJavaOptions & PluginSvelteOptions>

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
export async function formatViaPrettier(source: string, options: FormatOptions = {}) {
  if (!prettier) {
    prettier = await import('prettier/standalone')
  }
  return prettier.format(source, options)
}
