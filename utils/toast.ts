/**
 * @file Toast
 */

import 'vercel-toast/css'
import { createToast, destroyAllToasts } from 'vercel-toast'
import { useConfigStoreWithout } from '@/stores/config'
import type { ToastOptions as Options } from 'vercel-toast'

export interface ToastOptions extends Options {
  /**
   * Show as error toast
   *
   * @default false
   */
  isError?: boolean

  /**
   * Clear all toasts before showing this toast
   *
   * @default true
   */
  clearAll?: boolean
}

export const Toast = {
  show(msg: string, options: ToastOptions = {}) {
    const opts = {
      // Default options
      clearAll: true,
      isError: false,
      timeout: 2e3,

      // Custom options
      ...options,
    }
    const configStore = useConfigStoreWithout()
    if (configStore.silent) return

    if (opts.clearAll) {
      Toast.clearAll()
    }

    if (opts.isError) {
      const msgNode = document.createElement('div')
      msgNode.innerHTML = `<span style="font-weight: bold; color: red;">❌ Error</span>: ${msg}`
      createToast(msgNode, opts)
    } else {
      createToast(msg, opts)
    }
  },

  info(msg: string, options: Omit<ToastOptions, 'isError'> = {}) {
    Toast.show(msg, options)
  },

  error(msg: string, options: Omit<ToastOptions, 'isError'> = {}) {
    Toast.show(msg, { ...options, isError: true })
  },

  clearAll() {
    destroyAllToasts()
  },
}
