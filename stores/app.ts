/**
 * @file App
 */

import { defineStore } from 'pinia'
import { useStorage } from '@/composables/storage'

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
