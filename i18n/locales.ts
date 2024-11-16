/**
 * @file i18n locales
 */

export type LocaleMessageKey =
  | 'formatCostTime'
  | 'toggleLeftLayout'
  | 'toggleRightLayout'
  | 'toggleColorMode'
  | 'dragFileHere'
  | 'settings'
  | 'log'
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
  | 'pluginXMLOptions'
  | 'pluginPHPOptions'
  | 'pluginJavaOptions'
  | 'pluginSvelteOptions'
  | 'userConfigs'
  | 'emptyFile'
  | 'unsupportedFileFormat'

export type Messages = Record<LocaleMessageKey, string>

export const localeEn: Messages = {
  toggleLeftLayout: 'Toggle Left Layout',
  toggleRightLayout: 'Toggle Right Layout',
  toggleColorMode: 'Toggle Color Mode',
  dragFileHere: 'Drag File Here',
  settings: 'Settings',
  log: 'Log',
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
  pluginXMLOptions: 'XML Plugin Options',
  pluginPHPOptions: 'PHP Plugin Options',
  pluginJavaOptions: 'Java Plugin Options',
  pluginSvelteOptions: 'Svelte Plugin Options',
  userConfigs: 'User Configs',

  emptyFile: 'Empty File',
  unsupportedFileFormat: 'Unsupported File Format',
}

export const localeZhCN: Messages = {
  toggleLeftLayout: '切换左侧布局',
  toggleRightLayout: '切换右侧布局',
  toggleColorMode: '切换色彩模式',
  dragFileHere: '拖拽文件到这里',
  settings: '设置',
  log: '日志',
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
  pluginXMLOptions: 'XML 插件配置',
  pluginPHPOptions: 'PHP 插件配置',
  pluginJavaOptions: 'Java 插件配置',
  pluginSvelteOptions: 'Svelte 插件配置',
  userConfigs: '用户配置',

  emptyFile: '空文件',
  unsupportedFileFormat: '不支持的文件格式',
}
