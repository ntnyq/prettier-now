/**
 * @file Log store
 */

import { defineStore } from 'pinia'

export interface Log {}

export const useLogStore = defineStore('log', () => {
  const logList = shallowRef<Log[]>([])

  function clearAll() {
    logList.value = []
  }

  return {
    logList,

    clearAll,
  }
})
