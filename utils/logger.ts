/**
 * @file Logger
 */

import dayjs from 'dayjs'
import { META } from '@/constants/meta'
import { useConfigStoreWithout } from '@/stores/config'

export type LogType = 'log' | 'info' | 'success' | 'warn' | 'error' | 'debug'

export interface LogOptions {
  type: LogType
}

export const logEmojiMap = new Map<LogType, string>([
  ['log', '📝'],
  ['info', 'ℹ️'],
  ['success', '✅'],
  ['warn', '🚸'],
  ['error', '❌'],
  ['debug', '🐛'],
])

export class Logger {
  static log(msg: string, options: LogOptions) {
    const configStore = useConfigStoreWithout()
    if (!configStore.debug) return

    const emoji = logEmojiMap.get(options.type satisfies LogType)
    const content: string[] = [
      `[${META.name} ${dayjs().format('HH:mm:ss')}]`,
      `${emoji} ${options.type.toUpperCase()}`,
      `- ${msg}`,
    ]
    console.log(content.join(' '))
  }

  static info(msg: string) {
    Logger.log(msg, { type: 'info' })
  }

  static success(msg: string) {
    Logger.log(msg, { type: 'success' })
  }

  static warn(msg: string) {
    Logger.log(msg, { type: 'warn' })
  }

  static error(msg: string) {
    Logger.log(msg, { type: 'error' })
  }

  static debug(msg: string) {
    Logger.log(msg, { type: 'debug' })
  }
}
