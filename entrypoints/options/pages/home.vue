<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import SettingsDialog from '@/components/settings/SettingsDialog.vue'
import WorkspaceActionBar from '@/components/workspace/WorkspaceActionBar.vue'
import { useWorkspaceActions } from '@/composables/workspaceActions'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const { loadFiles } = useWorkspaceActions()

useEventListener('paste', (evt: ClipboardEvent) => {
  loadFiles(evt.clipboardData?.files)
})
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div class="min-h-0 flex flex-1 gap-3 overflow-y-auto">
      <WorkspaceFileList />
      <EditorSource
        v-show="appStore.isSourceEditorVisible"
        :class="[
          appStore.isResultEditorVisible
            ? 'max-w-[50%] min-w-[50%]'
            : 'max-w-full min-w-full',
        ]"
        class="flex-1"
      />
      <EditorResult v-show="appStore.isResultEditorVisible" />
    </div>

    <WorkspaceActionBar />

    <DropZone />
    <DiffPanel />
    <HistoryPanel />
    <LogPanel />
    <SettingsDialog v-model:open="appStore.isSettingsDialogOpen" />
  </div>
</template>
