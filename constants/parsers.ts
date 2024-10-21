/**
 * @file Language to parser map
 */

/**
 * language => prettier parser
 */
export const PARSERS_MAP = {
  // plugin babel
  javascript: 'babel',
  json: 'json',
  json5: 'json5',
  jsonc: 'jsonc',

  // plugin markdown
  mdx: 'mdx',
  remark: 'remark',
  markdown: 'markdown',

  // plugin typescript
  typescript: 'typescript',

  // plugin postCSS
  css: 'css',
  less: 'less',
  sass: 'scss',
  scss: 'scss',

  // plugin HTML
  html: 'html',
  vue: 'vue',
  angular: 'angular',

  // plugin yaml
  yaml: 'yaml',

  // plugin xml
  xml: 'xml',

  // plugin graphql
  graphql: 'graphql',

  // plugin svelte
  svelte: 'svelte',
}
