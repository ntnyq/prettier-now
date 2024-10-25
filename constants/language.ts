/**
 * @file Supported languages
 */

/**
 * @unocss-include
 */

import { angular } from '@codemirror/lang-angular'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { java } from '@codemirror/lang-java'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { less } from '@codemirror/lang-less'
import { markdown } from '@codemirror/lang-markdown'
import { php } from '@codemirror/lang-php'
import { sass } from '@codemirror/lang-sass'
import { vue } from '@codemirror/lang-vue'
import { xml } from '@codemirror/lang-xml'
import { yaml } from '@codemirror/lang-yaml'
import { svelte } from '@replit/codemirror-lang-svelte'
import { graphql } from 'cm6-graphql'
import type { LanguageSupport } from '@codemirror/language'
import type { Extension } from '@codemirror/state'

export interface Language {
  id: string
  name: string
  icon: string
  extension: () => LanguageSupport | Extension[]
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
    extension: () => javascript(),
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
    extension: () => javascript({ typescript: true }),
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
    extension: () => html(),
  },
  {
    id: 'vue',
    name: 'Vue',
    icon: 'i-vscode-icons:file-type-vue',
    extension: () => vue(),
  },
  {
    id: 'svelte',
    name: 'Svelte',
    icon: 'i-vscode-icons:file-type-svelte',
    extension: () => svelte(),
  },
  {
    id: 'angular',
    name: 'Angular',
    icon: 'i-vscode-icons:file-type-angular',
    extension: () => angular(),
  },
  {
    id: 'css',
    name: 'CSS',
    icon: 'i-vscode-icons:file-type-css',
    extension: () => css(),
  },
  {
    id: 'less',
    name: 'Less',
    icon: 'i-vscode-icons:file-type-less',
    extension: () => less(),
  },
  {
    id: 'scss',
    name: 'Sass',
    icon: 'i-vscode-icons:file-type-scss',
    extension: () => sass(),
  },
  {
    id: 'xml',
    name: 'XML',
    icon: 'i-vscode-icons:file-type-xml',
    extension: () => xml(),
  },
  {
    id: 'json',
    name: 'JSON',
    icon: 'i-vscode-icons:file-type-light-json',
    extension: () => json(),
  },
  {
    id: 'yaml',
    name: 'YAML',
    icon: 'i-vscode-icons:file-type-light-yaml',
    extension: () => yaml(),
  },
  {
    id: 'markdown',
    name: 'Markdown',
    icon: 'i-vscode-icons:file-type-markdown',
    extension: () => markdown(),
  },
  {
    id: 'php',
    name: 'PHP',
    icon: 'i-vscode-icons:file-type-php',
    extension: () => php(),
  },
  {
    id: 'java',
    name: 'Java',
    icon: 'i-vscode-icons:file-type-java',
    extension: () => java(),
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    icon: 'i-vscode-icons:file-type-graphql',
    extension: () => graphql(),
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
