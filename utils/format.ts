/**
 * @file format
 */

import pluginBabel from 'prettier/plugins/babel'
import pluginEstree from 'prettier/plugins/estree'
import pluginHtml from 'prettier/plugins/html'
import pluginMarkdown from 'prettier/plugins/markdown'
import pluginPostCSS from 'prettier/plugins/postcss'
import pluginTypeScript from 'prettier/plugins/typescript'
import pluginYaml from 'prettier/plugins/yaml'
import { format } from 'prettier/standalone'
import type { Options, Plugin } from 'prettier'

export const plugins: Plugin[] = [
  pluginEstree,
  pluginBabel,
  pluginMarkdown,
  pluginHtml,
  pluginTypeScript,
  pluginYaml,
  pluginPostCSS,
]

export function formatViaPrettier(source: string, options: Options = {}) {
  return format(source, options)
}
