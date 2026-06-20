/**
 * @file Supported languages
 */

import type { Language } from '@/types/language'

/**
 * supported language id
 */
export const LANGUAGE_ID = {
  angular: 'angular',
  css: 'css',
  graphql: 'graphql',
  html: 'html',
  java: 'java',
  javascript: 'javascript',
  json: 'json',
  jsx: 'jsx',
  less: 'less',
  markdown: 'markdown',
  php: 'php',
  pug: 'pug',
  scss: 'scss',
  svelte: 'svelte',
  toml: 'toml',
  tsx: 'tsx',
  typescript: 'typescript',
  vue: 'vue',
  xml: 'xml',
  yaml: 'yaml',
}

/**
 * Supported languages, both prettier and codemirror
 */
export const languages: Language[] = [
  {
    icon: 'vscode-icons:file-type-js-official',
    id: LANGUAGE_ID.javascript,
    name: 'JavaScript',
    /**
     * language javascript parser names babel
     */
    parser: 'babel',
  },
  // {
  //   id: LANGUAGE_ID.jsx,
  //   name: 'JSX',
  //   icon: '',
  //   parser: 'babel',
  // },
  {
    icon: 'vscode-icons:file-type-typescript-official',
    id: LANGUAGE_ID.typescript,
    name: 'TypeScript',
  },
  // {
  //   id: LANGUAGE_ID.tsx,
  //   name: 'TSX',
  //   icon: '',
  //   parser: 'typescript',
  // },
  {
    icon: 'vscode-icons:file-type-html',
    id: LANGUAGE_ID.html,
    name: 'HTML',
  },
  {
    icon: 'vscode-icons:file-type-vue',
    id: LANGUAGE_ID.vue,
    name: 'Vue',
  },
  {
    icon: 'vscode-icons:file-type-svelte',
    id: LANGUAGE_ID.svelte,
    name: 'Svelte',
  },
  {
    icon: 'vscode-icons:file-type-angular',
    id: LANGUAGE_ID.angular,
    name: 'Angular',
  },
  {
    icon: 'vscode-icons:file-type-css',
    id: LANGUAGE_ID.css,
    name: 'CSS',
  },
  {
    icon: 'vscode-icons:file-type-less',
    id: LANGUAGE_ID.less,
    name: 'Less',
  },
  {
    icon: 'vscode-icons:file-type-scss',
    id: LANGUAGE_ID.scss,
    name: 'Sass',
  },
  {
    icon: 'vscode-icons:file-type-xml',
    id: LANGUAGE_ID.xml,
    name: 'XML',
  },
  {
    id: LANGUAGE_ID.json,
    name: 'JSON',
    icon: {
      dark: 'vscode-icons:file-type-json',
      light: 'vscode-icons:file-type-light-json',
    },
  },
  {
    id: LANGUAGE_ID.yaml,
    name: 'YAML',
    icon: {
      dark: 'vscode-icons:file-type-yaml-official',
      light: 'vscode-icons:file-type-light-yaml-official',
    },
  },
  {
    icon: 'vscode-icons:file-type-markdown',
    id: LANGUAGE_ID.markdown,
    name: 'Markdown',
  },
  {
    icon: 'vscode-icons:file-type-php',
    id: LANGUAGE_ID.php,
    name: 'PHP',
  },
  {
    icon: 'vscode-icons:file-type-pug',
    id: LANGUAGE_ID.pug,
    name: 'Pug',
  },
  {
    icon: 'vscode-icons:file-type-java',
    id: LANGUAGE_ID.java,
    name: 'Java',
  },
  {
    icon: 'vscode-icons:file-type-graphql',
    id: LANGUAGE_ID.graphql,
    name: 'GraphQL',
  },
  {
    id: LANGUAGE_ID.toml,
    name: 'TOML',
    icon: {
      dark: 'vscode-icons:file-type-toml',
      light: 'vscode-icons:file-type-light-toml',
    },
  },
]

/**
 * extendsions => language
 *
 * Any extension need both prettier and codemirror support
 */
export const languageExtensions = {
  graphql: 'graphql',
  java: 'java',
  json: 'json',
  php: 'php',
  pug: 'pug',
  svelte: 'svelte',
  svg: 'xml',
  toml: 'toml',
  vue: 'vue',
  xml: 'xml',

  /**
   * @pg yaml
   */
  yaml: 'yaml',
  yml: 'yaml',

  /**
   * @pg html
   */
  htm: 'html',
  html: 'html',

  /**
   * @pg markdown
   */
  markdown: 'markdown',
  md: 'markdown',
  mdown: 'markdown',

  /**
   * @pg javascript
   */
  cjs: 'javascript',
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',

  /**
   * @pg typescript
   */
  cts: 'typescript',
  mts: 'typescript',
  ts: 'typescript',
  tsx: 'typescript',

  /**
   * @pg styles
   */
  css: 'css',
  less: 'less',
  scss: 'scss',
}
