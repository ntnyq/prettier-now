/**
 * @file App
 */

import { defineStore } from 'pinia'
import { useStorage } from '@/composables/storage'

export const useAppStore = defineStore('app', () => {
  const isSourceEditorVisible = useStorage<boolean>('showLeftLayout', true)
  const isResultEditorVisible = useStorage<boolean>('showRightLayout', true)
  const isDiffPanelVisible = useStorage<boolean>('isDiffPanelVisible', false)
  const isHistoryPanelVisible = useStorage<boolean>(
    'isHistoryPanelVisible',
    false,
  )
  const isSettingsDialogOpen = useStorage<boolean>(
    'isSettingsSheetVisible',
    false,
  )

  const toggleSourceEditor = () => {
    isSourceEditorVisible.value = !isSourceEditorVisible.value
  }
  const toggleResultEditor = () => {
    isResultEditorVisible.value = !isResultEditorVisible.value
  }
  const setIsDiffPanelVisible = (visible: boolean) => {
    isDiffPanelVisible.value = visible
  }
  const setIsHistoryPanelVisible = (visible: boolean) => {
    isHistoryPanelVisible.value = visible
  }
  const setSettingsDialogOpen = (visible: boolean) => {
    isSettingsDialogOpen.value = visible
  }

  return {
    isDiffPanelVisible,
    isHistoryPanelVisible,
    isSettingsDialogOpen,
    isSourceEditorVisible,
    isResultEditorVisible,
    setIsDiffPanelVisible,
    setIsHistoryPanelVisible,
    setSettingsDialogOpen,
    toggleSourceEditor,
    toggleResultEditor,
  }
})
