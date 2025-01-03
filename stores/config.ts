/**
 * @file user config
 */

import { defineStore } from 'pinia'
import { useStorage } from '@/composables/storage'
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
   * Auto format source code after pasting
   */
  const autoFormat = useStorage<boolean>('autoFormat', false)

  return {
    debug,
    silent,
    autoFormat,
  }
})

export const useConfigStoreWithout = () => {
  return useConfigStore(pinia)
}
