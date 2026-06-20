/**
 * @file Log store
 */

import { useToggle } from '@vueuse/core'
import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import type { LogType } from '@/utils/logger'

export interface Log {
  id: string
  createdAt: number
  type: LogType
  message: string
  fileName?: string
  languageId?: string
}

export interface AddLogInput {
  type: LogType
  message: string
  fileName?: string
  languageId?: string
}

export const useLogStore = defineStore('log', () => {
  const logList = shallowRef<Log[]>([])
  const [isLogPanelVisible, setIsLogPanelVisible] = useToggle()

  function addLog(input: AddLogInput) {
    logList.value = [
      {
        id: `${Date.now()}-${logList.value.length}`,
        createdAt: Date.now(),
        ...input,
      },
      ...logList.value,
    ].slice(0, 100)
  }

  function clearAll() {
    logList.value = []
  }

  return {
    logList,

    addLog,
    clearAll,

    isLogPanelVisible,
    setIsLogPanelVisible,
  }
})
