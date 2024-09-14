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
import prettier from 'prettier/standalone'
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

export const format = (source: string, options: Options = {}) => {
  return prettier.format(source, options)
}
