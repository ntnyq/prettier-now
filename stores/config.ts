/**
 * @file user preferences
 */

import { defineStore } from 'pinia'
import { useStorage } from '@/composables/useStorage'
import pinia from '@/stores'

export const useConfigStore = defineStore('config', () => {
  /**
   * If debug is true, log will be shown in console
   */
  const debug = useStorage<boolean>('debug', false)

  /**
   * If silent is true, no toast will be shown
   */
  const silent = useStorage<boolean>('silent', false)

  /**
   * Locale
   */
  const locale = useStorage<string>('locale', 'en')

  /**
   * Auto format source code after pasting
   */
  const autoFormat = useStorage<boolean>('autoFormat', false)

  return {
    debug,
    silent,
    locale,
    autoFormat,
  }
})

export const useConfigStoreWithout = () => {
  return useConfigStore(pinia)
}
