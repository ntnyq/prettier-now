/**
 * @file user preferences
 */

import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  /**
   * If debug is true, log will be shown in console
   */
  const debug = useStorage('debug', false)

  /**
   * If silent is true, no toast will be shown
   */
  const silent = useStorage('silent', false)

  return {
    debug,
    silent,
  }
})
