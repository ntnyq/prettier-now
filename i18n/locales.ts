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
  | 'ms'
  | 'zhCN'
  | 'en'
  | 'prettierOptions'
  | 'userConfigs'

export type Messages = Record<LocaleMessageKey, string>

export const localeEn: Messages = {
  toggleLeftLayout: 'Toggle Left Layout',
  toggleRightLayout: 'Toggle Right Layout',
  toggleColorMode: 'Toggle Color Mode',
  settings: 'Settings',
  sourceCode: 'Source Code',
  formatCostTime: 'Format Cost Time',
  ms: '{n}ms',

  clearAll: 'Clear All',
  copyResult: 'Copy Result',
  formatSource: 'Format Source',

  zhCN: '中文',
  en: 'English',

  prettierOptions: 'Prettier Options',
  userConfigs: 'User Configs',
}

export const localeZhCN: Messages = {
  toggleLeftLayout: '切换左侧布局',
  toggleRightLayout: '切换右侧布局',
  toggleColorMode: '切换色彩模式',
  settings: '设置',
  sourceCode: '源代码',
  formatCostTime: '格式化耗时',
  ms: '{n}毫秒',

  clearAll: '清除所有',
  copyResult: '复制结果',
  formatSource: '格式化代码',

  zhCN: '中文',
  en: 'English',

  prettierOptions: 'Prettier 配置',
  userConfigs: '用户配置',
}
