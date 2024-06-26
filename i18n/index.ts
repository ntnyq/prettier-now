/**
 * @file i18n
 */

import { createI18n as createI18nInstance } from 'vue-i18n'
import { useConfigStoreWithout } from '@/stores/config'
import { localeEn as en, localeZhCN as zhCN } from './locales'

const messages = {
  'zh-CN': zhCN,
  en,
}

const createI18n = () => {
  const configStore = useConfigStoreWithout()

  return createI18nInstance({
    legacy: false,
    locale: configStore.locale,
    fallbackLocale: 'en',
    messages,
    missingWarn: true,
    silentFallbackWarn: false,
    silentTranslationWarn: false,
  })
}

export const i18n = createI18n()

export default i18n
