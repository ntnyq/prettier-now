/**
 * @file Languages
 */

import { angular } from '@codemirror/lang-angular'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { less } from '@codemirror/lang-less'
import { markdown } from '@codemirror/lang-markdown'
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
  alias?: string[]
  extension: () => LanguageSupport | Extension[]
}

export const languages: Language[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    extension: () => javascript(),
  },
  {
    id: 'jsx',
    name: 'JSX',
    extension: () => javascript({ jsx: true }),
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    extension: () => javascript({ typescript: true }),
  },
  {
    id: 'tsx',
    name: 'TSX',
    extension: () => javascript({ jsx: true, typescript: true }),
  },
  {
    id: 'html',
    name: 'HTML',
    extension: () => html(),
  },
  {
    id: 'vue',
    name: 'Vue',
    extension: () => vue(),
  },
  {
    id: 'svelte',
    name: 'Svelte',
    extension: () => svelte(),
  },
  {
    id: 'angular',
    name: 'Angular',
    extension: () => angular(),
  },
  {
    id: 'css',
    name: 'CSS',
    extension: () => css(),
  },
  {
    id: 'scss',
    name: 'Sass',
    extension: () => sass(),
  },
  {
    id: 'less',
    name: 'Less',
    extension: () => less(),
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    extension: () => graphql(),
  },
  {
    id: 'xml',
    name: 'XML',
    extension: () => xml(),
  },
  {
    id: 'json',
    name: 'JSON',
    extension: () => json(),
  },
  {
    id: 'yaml',
    name: 'YAML',
    extension: () => yaml(),
  },
  {
    id: 'markdown',
    name: 'Markdown',
    alias: ['md'],
    extension: () => markdown(),
  },
].sort((a, b) => (a.name < b.name ? -1 : 1))
