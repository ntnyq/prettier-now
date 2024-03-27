/**
 * @file App
 */

import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const showLeftLayout = useStorage<boolean>('showLeftLayout', true)
  const showRightLayout = useStorage<boolean>('showRightLayout', true)

  const toggleLeftLayout = () => {
    showLeftLayout.value = !showLeftLayout.value
  }
  const toggleRightLayout = () => {
    showRightLayout.value = !showRightLayout.value
  }

  return {
    showLeftLayout,
    showRightLayout,
    toggleLeftLayout,
    toggleRightLayout,
  }
})
