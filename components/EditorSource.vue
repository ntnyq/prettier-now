<script lang="ts" setup>
import { nextTick, onBeforeUnmount, watch } from 'vue'
import { useConfigStore } from '@/stores/config'
import { useWorkspaceStore } from '@/stores/workspace'

const configStore = useConfigStore()
const workspaceStore = useWorkspaceStore()
let timer: ReturnType<typeof setTimeout> | undefined
let isDisposed = false

function cancelAutoFormat() {
  clearTimeout(timer)
  timer = undefined
}

async function handleUserChange(source: string) {
  cancelAutoFormat()
  const jobId = workspaceStore.activeJobId
  // CodeMirror emits its ViewUpdate before vue-codemirror updates v-model.
  // Wait for that source mutation and its cancellation watcher to finish first.
  await nextTick()
  if (
    isDisposed
    || !configStore.autoFormat
    || !source
    || workspaceStore.activeJobId !== jobId
    || workspaceStore.sourceCode !== source
  ) {
    return
  }
  timer = setTimeout(() => {
    if (
      configStore.autoFormat
      && workspaceStore.activeJobId === jobId
      && workspaceStore.sourceCode === source
    ) {
      workspaceStore.formatActiveJob()
    }
  }, 300)
}

watch(
  () => [
    workspaceStore.activeJobId,
    workspaceStore.sourceCode,
    workspaceStore.languageId,
    configStore.autoFormat,
  ],
  cancelAutoFormat,
  { flush: 'sync' },
)
onBeforeUnmount(() => {
  isDisposed = true
  cancelAutoFormat()
})
</script>

<template>
  <Editor
    @user-change="handleUserChange"
    v-model="workspaceStore.sourceCode"
    :language="workspaceStore.languageId"
  />
</template>
