/**
 * @file Supported languages
 */

/**
 * @unocss-include
 */

import { angular } from '@codemirror/lang-angular'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
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
    id: 'php',
    name: 'PHP',
    icon: 'i-vscode-icons:file-type-php',
    extension: () => php(),
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    icon: 'i-vscode-icons:file-type-graphql',
    extension: () => graphql(),
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
]
