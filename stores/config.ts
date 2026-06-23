/**
 * @file user config
 */

import { defineStore } from 'pinia'
import * as v from 'valibot'
import { useStorage } from '@/composables/storage'
import pinia from '@/stores'
import { DEFAULT_THEME_COLOR } from '@/utils/themeColor'

const ThemeColorSchema = v.pipe(v.string(), v.regex(/^#[\da-f]{6}$/i))

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

  /**
   * Primary app theme color
   */
  const themeColor = useStorage<string>(
    'themeColor',
    DEFAULT_THEME_COLOR,
    ThemeColorSchema,
  )

  return {
    debug,
    silent,
    autoFormat,
    themeColor,
  }
})

export const useConfigStoreWithout = () => {
  return useConfigStore(pinia)
}
