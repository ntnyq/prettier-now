/**
 * @file Toast
 */

import { getActivePinia } from 'pinia'
import { toast } from 'vue-sonner'
import { useConfigStore, useConfigStoreWithout } from '@/stores/config'
import type { ExternalToast } from 'vue-sonner'

/**
 * Application toast options.
 */
export interface ToastOptions extends ExternalToast {
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

  /**
   * Time before dismissing the toast.
   *
   * @default 2000
   */
  timeout?: number
}

/**
 * Silent-mode-aware toast helper.
 */
export const Toast = {
  /**
   * Show an informational or error toast.
   *
   * @param msg - Toast message.
   * @param options - Toast display options.
   */
  show(msg: string, options: ToastOptions = {}) {
    const { clearAll, isError, timeout, ...toastOptions } = {
      clearAll: true,
      isError: false,
      timeout: 2e3,
      ...options,
    }
    const configStore = getActivePinia()
      ? useConfigStore()
      : useConfigStoreWithout()

    if (configStore.silent) {
      return
    }

    if (clearAll) {
      Toast.clearAll()
    }

    const sonnerOptions = {
      ...toastOptions,
      duration: toastOptions.duration ?? timeout,
    }

    if (isError) {
      toast.error(msg, sonnerOptions)
      return
    }

    toast.info(msg, sonnerOptions)
  },

  /**
   * Show an informational toast.
   *
   * @param msg - Toast message.
   * @param options - Toast display options.
   */
  info(msg: string, options: Omit<ToastOptions, 'isError'> = {}) {
    Toast.show(msg, options)
  },

  /**
   * Show an error toast.
   *
   * @param msg - Toast message.
   * @param options - Toast display options.
   */
  error(msg: string, options: Omit<ToastOptions, 'isError'> = {}) {
    Toast.show(msg, { ...options, isError: true })
  },

  /**
   * Dismiss all visible toasts.
   */
  clearAll() {
    toast.dismiss()
  },
}
