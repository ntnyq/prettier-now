/**
 * @file format
 */

import prettier from 'prettier/standalone'
import pluginEstree from 'prettier/plugins/estree'
import pluginBabel from 'prettier/plugins/babel'
import pluginMarkdown from 'prettier/plugins/markdown'
import pluginHtml from 'prettier/plugins/html'
import pluginTypeScript from 'prettier/plugins/typescript'
import pluginYaml from 'prettier/plugins/yaml'
import type { Options, Plugin } from 'prettier'

export const plugins: Plugin[] = [
  pluginEstree,
  pluginBabel,
  pluginMarkdown,
  pluginHtml,
  pluginTypeScript,
  pluginYaml,
]

export const format = (source: string, options: Options = {}) => {
  return prettier.format(source, options)
}
