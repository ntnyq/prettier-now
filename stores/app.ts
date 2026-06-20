/**
 * @file App
 */

import { defineStore } from 'pinia'
import { useStorage } from '@/composables/storage'

export const useAppStore = defineStore('app', () => {
  const showLeftLayout = useStorage<boolean>('showLeftLayout', true)
  const showRightLayout = useStorage<boolean>('showRightLayout', true)
  const isDiffPanelVisible = useStorage<boolean>('isDiffPanelVisible', false)
  const isHistoryPanelVisible = useStorage<boolean>(
    'isHistoryPanelVisible',
    false,
  )

  const toggleLeftLayout = () => {
    showLeftLayout.value = !showLeftLayout.value
  }
  const toggleRightLayout = () => {
    showRightLayout.value = !showRightLayout.value
  }
  const setIsDiffPanelVisible = (visible: boolean) => {
    isDiffPanelVisible.value = visible
  }
  const setIsHistoryPanelVisible = (visible: boolean) => {
    isHistoryPanelVisible.value = visible
  }

  return {
    isDiffPanelVisible,
    isHistoryPanelVisible,
    showLeftLayout,
    showRightLayout,
    setIsDiffPanelVisible,
    setIsHistoryPanelVisible,
    toggleLeftLayout,
    toggleRightLayout,
  }
})
