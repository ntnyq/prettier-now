/**
 * @file user preferences
 */

import { defineStore } from 'pinia'
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

  return {
    debug,
    silent,
  }
})

export const useConfigStoreWithout = () => {
  return useConfigStore(pinia)
}
