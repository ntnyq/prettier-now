export type LocaleMessageKey =
  | 'formatCostTime'
  | 'toggleLeftLayout'
  | 'toggleRightLayout'
  | 'toggleColorMode'
  | 'settings'
  | 'home'
  | 'clearAll'
  | 'copyResult'
  | 'formatSource'
  | 'sourceCode'
  | 'feedback'
  | 'changelog'
  | 'about'
  | 'aboutApp'
  | 'ms'
  | 'zhCN'
  | 'en'
  | 'prettierOptions'
  | 'pluginSvelteOptions'
  | 'pluginXMLOptions'
  | 'userConfigs'

export type Messages = Record<LocaleMessageKey, string>

export const localeEn: Messages = {
  toggleLeftLayout: 'Toggle Left Layout',
  toggleRightLayout: 'Toggle Right Layout',
  toggleColorMode: 'Toggle Color Mode',
  settings: 'Settings',
  home: 'Home',
  sourceCode: 'Source Code',
  feedback: 'Feedback',
  changelog: 'ChangeLog',
  about: 'About',
  aboutApp: 'About {name}',
  formatCostTime: 'Format Cost Time',
  ms: '{n}ms',

  clearAll: 'Clear All',
  copyResult: 'Copy Result',
  formatSource: 'Format Source',

  zhCN: '中文',
  en: 'English',

  prettierOptions: 'Prettier Options',
  pluginSvelteOptions: 'Svelte Plugin Options',
  pluginXMLOptions: 'XML Plugin Options',
  userConfigs: 'User Configs',
}

export const localeZhCN: Messages = {
  toggleLeftLayout: '切换左侧布局',
  toggleRightLayout: '切换右侧布局',
  toggleColorMode: '切换色彩模式',
  settings: '设置',
  home: '首页',
  sourceCode: '源代码',
  feedback: '意见反馈',
  changelog: '更新日志',
  about: '关于',
  aboutApp: '关于 {name}',
  formatCostTime: '格式化耗时',
  ms: '{n}毫秒',

  clearAll: '清除所有',
  copyResult: '复制结果',
  formatSource: '格式化代码',

  zhCN: '中文',
  en: 'English',

  prettierOptions: 'Prettier 配置',
  pluginSvelteOptions: 'Svelte 插件配置',
  pluginXMLOptions: 'XML 插件件配置',
  userConfigs: '用户配置',
}
