/**
 * @file Log store
 */

import { useToggle } from '@vueuse/core'
import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

export interface Log {}

export const useLogStore = defineStore('log', () => {
  const logList = shallowRef<Log[]>([])
  const [isLogPanelVisible, setIsLogPanelVisible] = useToggle()

  function clearAll() {
    logList.value = []
  }

  return {
    logList,

    clearAll,

    isLogPanelVisible,
    setIsLogPanelVisible,
  }
})
