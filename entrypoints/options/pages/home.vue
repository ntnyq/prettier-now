<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import SettingsSheet from '@/components/settings/SettingsSheet.vue'
import WorkspaceActionBar from '@/components/workspace/WorkspaceActionBar.vue'
import { useFileHandler } from '@/composables/fileHandler'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const { loadFileList } = useFileHandler()

useEventListener('paste', (evt: ClipboardEvent) => {
  loadFileList(evt.clipboardData?.files)
})
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div class="min-h-0 flex flex-1 gap-3 overflow-y-auto">
      <WorkspaceFileList />
      <EditorSource
        v-show="appStore.showLeftLayout"
        :class="[
          appStore.showRightLayout
            ? 'max-w-[50%] min-w-[50%]'
            : 'max-w-full min-w-full',
        ]"
        class="flex-1"
      />
      <EditorResult v-show="appStore.showRightLayout" />
    </div>

    <WorkspaceActionBar />

    <DropZone />
    <DiffPanel />
    <HistoryPanel />
    <LogPanel />
    <SettingsSheet v-model:open="appStore.isSettingsSheetVisible" />
  </div>
</template>
