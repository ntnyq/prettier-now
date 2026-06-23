/**
 * @file Logger
 */

import dayjs from 'dayjs'
import { META } from '@/constants/meta'
import { useConfigStoreWithout } from '@/stores/config'

/**
 * Log message category.
 */
export type LogType = 'log' | 'info' | 'success' | 'warn' | 'error' | 'debug'

/**
 * Logger call options.
 */
export interface LogOptions {
  /**
   * Message category to print.
   */
  type: LogType
}

/**
 * Emoji prefix used for each log category.
 */
export const logEmojiMap = new Map<LogType, string>([
  ['log', '📝'],
  ['info', 'ℹ️'],
  ['success', '✅'],
  ['warn', '🚸'],
  ['error', '❌'],
  ['debug', '🐛'],
])

/**
 * Debug-aware application logger.
 */
export const Logger = {
  /**
   * Print a categorized message when debug logging is enabled.
   *
   * @param msg - Message to print.
   * @param options - Log options.
   */
  log(msg: string, options: LogOptions) {
    const configStore = useConfigStoreWithout()
    if (!configStore.debug) {
      return
    }

    const emoji = logEmojiMap.get(options.type satisfies LogType)
    const content: string[] = [
      `[${META.name} ${dayjs().format('HH:mm:ss')}]`,
      `${emoji} ${options.type.toUpperCase()}`,
      `- ${msg}`,
    ]
    console.log(content.join(' '))
  },

  /**
   * Print an info message when debug logging is enabled.
   *
   * @param msg - Message to print.
   */
  info(msg: string) {
    Logger.log(msg, { type: 'info' })
  },

  /**
   * Print a success message when debug logging is enabled.
   *
   * @param msg - Message to print.
   */
  success(msg: string) {
    Logger.log(msg, { type: 'success' })
  },

  /**
   * Print a warning message when debug logging is enabled.
   *
   * @param msg - Message to print.
   */
  warn(msg: string) {
    Logger.log(msg, { type: 'warn' })
  },

  /**
   * Print an error message when debug logging is enabled.
   *
   * @param msg - Message to print.
   */
  error(msg: string) {
    Logger.log(msg, { type: 'error' })
  },

  /**
   * Print a debug message when debug logging is enabled.
   *
   * @param msg - Message to print.
   */
  debug(msg: string) {
    Logger.log(msg, { type: 'debug' })
  },
}
