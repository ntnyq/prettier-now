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
    extension: async () => {
      const { javascript } = await import('@codemirror/lang-javascript')
      return javascript()
    },
    icon: 'i-vscode-icons:file-type-js-official',
    id: 'javascript',
    name: 'JavaScript',
  },
  // {
  //   id: 'jsx',
  //   name: 'JSX',
  //   icon: '',
  //   extension: () => javascript({ jsx: true }),
  // },
  {
    extension: async () => {
      const { javascript } = await import('@codemirror/lang-javascript')
      return javascript({ typescript: true })
    },
    icon: 'i-vscode-icons:file-type-typescript-official',
    id: 'typescript',
    name: 'TypeScript',
  },
  // {
  //   id: 'tsx',
  //   name: 'TSX',
  //   icon: '',
  //   extension: () => javascript({ jsx: true, typescript: true }),
  // },
  {
    extension: async () => {
      const { html } = await import('@codemirror/lang-html')
      return html()
    },
    icon: 'i-vscode-icons:file-type-html',
    id: 'html',
    name: 'HTML',
  },
  {
    extension: async () => {
      const { vue } = await import('@codemirror/lang-vue')
      return vue()
    },
    icon: 'i-vscode-icons:file-type-vue',
    id: 'vue',
    name: 'Vue',
  },
  {
    extension: async () => {
      const { svelte } = await import('@replit/codemirror-lang-svelte')
      return svelte()
    },
    icon: 'i-vscode-icons:file-type-svelte',
    id: 'svelte',
    name: 'Svelte',
  },
  {
    extension: async () => {
      const { angular } = await import('@codemirror/lang-angular')
      return angular()
    },
    icon: 'i-vscode-icons:file-type-angular',
    id: 'angular',
    name: 'Angular',
  },
  {
    extension: async () => {
      const { css } = await import('@codemirror/lang-css')
      return css()
    },
    icon: 'i-vscode-icons:file-type-css',
    id: 'css',
    name: 'CSS',
  },
  {
    extension: async () => {
      const { less } = await import('@codemirror/lang-less')
      return less()
    },
    icon: 'i-vscode-icons:file-type-less',
    id: 'less',
    name: 'Less',
  },
  {
    extension: async () => {
      const { sass } = await import('@codemirror/lang-sass')
      return sass()
    },
    icon: 'i-vscode-icons:file-type-scss',
    id: 'scss',
    name: 'Sass',
  },
  {
    extension: async () => {
      const { xml } = await import('@codemirror/lang-xml')
      return xml()
    },
    icon: 'i-vscode-icons:file-type-xml',
    id: 'xml',
    name: 'XML',
  },
  {
    extension: async () => {
      const { json } = await import('@codemirror/lang-json')
      return json()
    },
    icon: 'i-vscode-icons:file-type-light-json',
    id: 'json',
    name: 'JSON',
  },
  {
    extension: async () => {
      const { yaml } = await import('@codemirror/lang-yaml')
      return yaml()
    },
    icon: 'i-vscode-icons:file-type-light-yaml',
    id: 'yaml',
    name: 'YAML',
  },
  {
    extension: async () => {
      const { markdown } = await import('@codemirror/lang-markdown')
      return markdown()
    },
    icon: 'i-vscode-icons:file-type-markdown',
    id: 'markdown',
    name: 'Markdown',
  },
  {
    extension: async () => {
      const { php } = await import('@codemirror/lang-php')
      return php()
    },
    icon: 'i-vscode-icons:file-type-php',
    id: 'php',
    name: 'PHP',
  },
  {
    extension: async () => {
      const { java } = await import('@codemirror/lang-java')
      return java()
    },
    icon: 'i-vscode-icons:file-type-java',
    id: 'java',
    name: 'Java',
  },
  {
    extension: async () => {
      const { graphql } = await import('cm6-graphql')
      return graphql()
    },
    icon: 'i-vscode-icons:file-type-graphql',
    id: 'graphql',
    name: 'GraphQL',
  },
]

/**
 * language => prettier parser
 */
export const languageParsers = {
  /**
   * plugin babel
   */
  javascript: 'babel',
  json: 'json',
  json5: 'json5',
  jsonc: 'jsonc',

  /**
   * plugin typescript
   */
  typescript: 'typescript',

  /**
   * plugin postcss
   */
  css: 'css',
  less: 'less',
  sass: 'scss',
  scss: 'scss',

  /**
   * plugin markdown
   */
  markdown: 'markdown',
  mdx: 'mdx',
  remark: 'remark',

  /**
   * plugin php
   */
  php: 'php',

  /**
   * plugin svelte
   */
  svelte: 'svelte',

  /**
   * plugin html
   */
  angular: 'angular',
  html: 'html',
  vue: 'vue',

  /**
   * plugin xml
   */
  xml: 'xml',

  /**
   * plugin yaml
   */
  yaml: 'yaml',

  /**
   * plugin graphql
   */
  graphql: 'graphql',

  /**
   * plugin java
   */
  java: 'java',
}

/**
 * extendsions => language
 */
export const languageExtensions = {
  /**
   * javascript
   */
  cjs: 'javascript',
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',

  /**
   * typescript
   */
  cts: 'typescript',
  mts: 'typescript',
  ts: 'typescript',
  tsx: 'typescript',

  /**
   * css
   */
  css: 'css',
  less: 'less',
  scss: 'scss',

  /**
   * markdown
   */
  markdown: 'markdown',
  md: 'markdown',
  mdown: 'markdown',

  /**
   * frameworks
   */
  svelte: 'svelte',
  vue: 'vue',

  /**
   * extensions
   */
  htm: 'html',
  html: 'html',
  json: 'json',
  svg: 'xml',
  xml: 'xml',
  yaml: 'yaml',
  yml: 'yaml',

  /**
   * others
   */
  graphql: 'graphql',
  java: 'java',
  php: 'php',
}
