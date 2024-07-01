export type LocaleMessageKey =
  | 'formatCostTime'
  | 'toggleLeftLayout'
  | 'toggleRightLayout'
  | 'toggleColorMode'
  | 'settings'
  | 'clearAll'
  | 'copyResult'
  | 'formatSource'
  | 'sourceCode'

export type Messages = Record<LocaleMessageKey, string>

export const localeEn: Messages = {
  formatCostTime: 'Format Cost Time',
  toggleLeftLayout: 'Toggle Left Layout',
  toggleRightLayout: 'Toggle Right Layout',
  toggleColorMode: 'Toggle Color Mode',
  settings: 'Settings',
  clearAll: 'Clear All',
  copyResult: 'Copy Result',
  formatSource: 'Format Source',
  sourceCode: 'Source Code',
}

export const localeZhCN: Messages = {
  formatCostTime: '格式化耗时',
  toggleLeftLayout: '切换左侧布局',
  toggleRightLayout: '切换右侧布局',
  toggleColorMode: '切换色彩模式',
  settings: '设置',
  clearAll: '清除所有',
  copyResult: '复制结果',
  formatSource: '格式化代码',
  sourceCode: '源代码',
}
