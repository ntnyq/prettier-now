<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
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
      <EditorSource
        v-show="appStore.showLeftLayout"
        :class="[
          appStore.showRightLayout
            ? 'max-w-1/2 min-w-1/2'
            : 'max-w-full min-w-full',
        ]"
        class="flex-1"
      />
      <EditorResult v-show="appStore.showRightLayout" />
    </div>

    <ActionBar />

    <DropZone />
    <LogPanel />
  </div>
</template>
