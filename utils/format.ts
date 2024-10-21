/**
 * @file format
 */

import pluginXml from '@prettier/plugin-xml'
import pluginAngular from 'prettier/plugins/angular'
import pluginBabel from 'prettier/plugins/babel'
import pluginEstree from 'prettier/plugins/estree'
import pluginGraphql from 'prettier/plugins/graphql'
import pluginHtml from 'prettier/plugins/html'
import pluginMarkdown from 'prettier/plugins/markdown'
import pluginPostCSS from 'prettier/plugins/postcss'
import pluginTypeScript from 'prettier/plugins/typescript'
import pluginYaml from 'prettier/plugins/yaml'
import { format } from 'prettier/standalone'
// @ts-expect-error missing types
import * as pluginSvelte from 'prettier-plugin-svelte/browser'
import type { Options, Plugin } from 'prettier'
import type { PluginSvelteOptions, PluginXMLOptions } from '@/types/options'

export const plugins: Plugin[] = [
  pluginAngular,
  pluginBabel,
  pluginEstree,
  pluginGraphql,
  pluginHtml,
  pluginMarkdown,
  pluginPostCSS,
  pluginYaml,
  pluginSvelte,
  pluginTypeScript,
  pluginXml,
]

export type FormatOptions = Options & Partial<PluginXMLOptions> & Partial<PluginSvelteOptions>

export function formatViaPrettier(source: string, options: FormatOptions = {}) {
  return format(source, options)
}
