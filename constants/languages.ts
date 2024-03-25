/**
 * @file Languages
 */

export interface Language {
  id: string
  label: string
  icon: string
}

/**
 * 语言
 */
export const LANGUAGES: Language[] = [
  {
    id: 'javascript',
    label: 'JavaScript',
    icon: 'i-vscode-icons:file-type-js-official',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    icon: 'i-vscode-icons:file-type-typescript',
  },
  {
    id: 'vue',
    label: 'Vue',
    icon: 'i-vscode-icons:file-type-vue',
  },
  {
    id: 'html',
    label: 'HTML',
    icon: 'i-vscode-icons:file-type-html',
  },
  {
    id: 'css',
    label: 'CSS',
    icon: 'i-vscode-icons:file-type-css',
  },
  {
    id: 'yaml',
    label: 'YAML',
    icon: 'i-vscode-icons:file-type-light-yaml',
  },
  {
    id: 'markdown',
    label: 'Markdown',
    icon: 'i-vscode-icons:file-type-markdown',
  },
]
