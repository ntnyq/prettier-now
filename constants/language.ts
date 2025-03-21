/**
 * @file Supported languages
 */

// @unocss-include

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
    icon: 'i-vscode-icons:file-type-js-official',
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
    icon: 'i-vscode-icons:file-type-typescript-official',
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
    icon: 'i-vscode-icons:file-type-html',
    id: LANGUAGE_ID.html,
    name: 'HTML',
  },
  {
    icon: 'i-vscode-icons:file-type-vue',
    id: LANGUAGE_ID.vue,
    name: 'Vue',
  },
  {
    icon: 'i-vscode-icons:file-type-svelte',
    id: LANGUAGE_ID.svelte,
    name: 'Svelte',
  },
  {
    icon: 'i-vscode-icons:file-type-angular',
    id: LANGUAGE_ID.angular,
    name: 'Angular',
  },
  {
    icon: 'i-vscode-icons:file-type-css',
    id: LANGUAGE_ID.css,
    name: 'CSS',
  },
  {
    icon: 'i-vscode-icons:file-type-less',
    id: LANGUAGE_ID.less,
    name: 'Less',
  },
  {
    icon: 'i-vscode-icons:file-type-scss',
    id: LANGUAGE_ID.scss,
    name: 'Sass',
  },
  {
    icon: 'i-vscode-icons:file-type-xml',
    id: LANGUAGE_ID.xml,
    name: 'XML',
  },
  {
    id: LANGUAGE_ID.json,
    name: 'JSON',
    icon: {
      dark: 'i-vscode-icons:file-type-json',
      light: 'i-vscode-icons:file-type-light-json',
    },
  },
  {
    id: LANGUAGE_ID.yaml,
    name: 'YAML',
    icon: {
      dark: 'i-vscode-icons:file-type-yaml-official',
      light: 'i-vscode-icons:file-type-light-yaml-official',
    },
  },
  {
    icon: 'i-vscode-icons:file-type-markdown',
    id: LANGUAGE_ID.markdown,
    name: 'Markdown',
  },
  {
    icon: 'i-vscode-icons:file-type-php',
    id: LANGUAGE_ID.php,
    name: 'PHP',
  },
  {
    icon: 'i-vscode-icons:file-type-java',
    id: LANGUAGE_ID.java,
    name: 'Java',
  },
  {
    icon: 'i-vscode-icons:file-type-graphql',
    id: LANGUAGE_ID.graphql,
    name: 'GraphQL',
  },
  {
    id: LANGUAGE_ID.toml,
    name: 'TOML',
    icon: {
      dark: 'i-vscode-icons:file-type-toml',
      light: 'i-vscode-icons:file-type-light-toml',
    },
  },
  // {
  //   icon: 'i-vscode-icons:file-type-pug',
  //   id: LANGUAGE_ID.pug,
  //   name: 'Pug',
  // },
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
