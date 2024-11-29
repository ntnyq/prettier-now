/**
 * @file Supported languages
 */

// @unocss-include

import type { LanguageSupport } from '@codemirror/language'
import type { Extension } from '@codemirror/state'

export interface Language {
  id: string
  name: string
  icon: string
  extension: () => Promise<LanguageSupport | Extension[]>
}

/**
 * Supported languages
 * Both prettier and codemirror
 */
export const languages: Language[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: 'i-vscode-icons:file-type-js-official',
    extension: async () => {
      const { javascript } = await import('@codemirror/lang-javascript')
      return javascript()
    },
  },
  // {
  //   id: 'jsx',
  //   name: 'JSX',
  //   icon: '',
  //   extension: () => javascript({ jsx: true }),
  // },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: 'i-vscode-icons:file-type-typescript-official',
    extension: async () => {
      const { javascript } = await import('@codemirror/lang-javascript')
      return javascript({ typescript: true })
    },
  },
  // {
  //   id: 'tsx',
  //   name: 'TSX',
  //   icon: '',
  //   extension: () => javascript({ jsx: true, typescript: true }),
  // },
  {
    id: 'html',
    name: 'HTML',
    icon: 'i-vscode-icons:file-type-html',
    extension: async () => {
      const { html } = await import('@codemirror/lang-html')
      return html()
    },
  },
  {
    id: 'vue',
    name: 'Vue',
    icon: 'i-vscode-icons:file-type-vue',
    extension: async () => {
      const { vue } = await import('@codemirror/lang-vue')
      return vue()
    },
  },
  {
    id: 'svelte',
    name: 'Svelte',
    icon: 'i-vscode-icons:file-type-svelte',
    extension: async () => {
      const { svelte } = await import('@replit/codemirror-lang-svelte')
      return svelte()
    },
  },
  {
    id: 'angular',
    name: 'Angular',
    icon: 'i-vscode-icons:file-type-angular',
    extension: async () => {
      const { angular } = await import('@codemirror/lang-angular')
      return angular()
    },
  },
  {
    id: 'css',
    name: 'CSS',
    icon: 'i-vscode-icons:file-type-css',
    extension: async () => {
      const { css } = await import('@codemirror/lang-css')
      return css()
    },
  },
  {
    id: 'less',
    name: 'Less',
    icon: 'i-vscode-icons:file-type-less',
    extension: async () => {
      const { less } = await import('@codemirror/lang-less')
      return less()
    },
  },
  {
    id: 'scss',
    name: 'Sass',
    icon: 'i-vscode-icons:file-type-scss',
    extension: async () => {
      const { sass } = await import('@codemirror/lang-sass')
      return sass()
    },
  },
  {
    id: 'xml',
    name: 'XML',
    icon: 'i-vscode-icons:file-type-xml',
    extension: async () => {
      const { xml } = await import('@codemirror/lang-xml')
      return xml()
    },
  },
  {
    id: 'json',
    name: 'JSON',
    icon: 'i-vscode-icons:file-type-light-json',
    extension: async () => {
      const { json } = await import('@codemirror/lang-json')
      return json()
    },
  },
  {
    id: 'yaml',
    name: 'YAML',
    icon: 'i-vscode-icons:file-type-light-yaml',
    extension: async () => {
      const { yaml } = await import('@codemirror/lang-yaml')
      return yaml()
    },
  },
  {
    id: 'markdown',
    name: 'Markdown',
    icon: 'i-vscode-icons:file-type-markdown',
    extension: async () => {
      const { markdown } = await import('@codemirror/lang-markdown')
      return markdown()
    },
  },
  {
    id: 'php',
    name: 'PHP',
    icon: 'i-vscode-icons:file-type-php',
    extension: async () => {
      const { php } = await import('@codemirror/lang-php')
      return php()
    },
  },
  {
    id: 'java',
    name: 'Java',
    icon: 'i-vscode-icons:file-type-java',
    extension: async () => {
      const { java } = await import('@codemirror/lang-java')
      return java()
    },
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    icon: 'i-vscode-icons:file-type-graphql',
    extension: async () => {
      const { graphql } = await import('cm6-graphql')
      return graphql()
    },
  },
]

/**
 * language => prettier parser
 */
export const languageParsers = {
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

  // plugin php
  php: 'php',

  // plugin java
  java: 'java',

  // plugin graphql
  graphql: 'graphql',

  // plugin svelte
  svelte: 'svelte',
}

/**
 * extendsions => language
 */
export const languageExtensions = {
  js: 'javascript',
  cjs: 'javascript',
  mjs: 'javascript',
  jsx: 'javascript',

  ts: 'typescript',
  cts: 'typescript',
  mts: 'typescript',
  tsx: 'typescript',

  html: 'html',
  htm: 'html',

  vue: 'vue',

  svelte: 'svelte',

  css: 'css',
  less: 'less',
  scss: 'scss',

  xml: 'xml',
  svg: 'xml',

  json: 'json',

  yml: 'yaml',
  yaml: 'yaml',

  md: 'markdown',
  mdown: 'markdown',
  markdown: 'markdown',

  php: 'php',

  java: 'java',

  graphql: 'graphql',
}
