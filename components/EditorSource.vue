<script lang="ts" setup>
import { watch } from 'vue'
import { useConfigStore } from '@/stores/config'
import { useWorkspaceStore } from '@/stores/workspace'

const configStore = useConfigStore()
const workspaceStore = useWorkspaceStore()

watch(
  [
    () => workspaceStore.activeJobId,
    () => workspaceStore.sourceCode,
    () => configStore.autoFormat,
  ],
  ([jobId, source, autoFormat], [previousJobId], onCleanup) => {
    if (!autoFormat || !source.length || jobId !== previousJobId) {
      return
    }

    const timer = setTimeout(() => workspaceStore.formatActiveJob(), 300)
    onCleanup(() => clearTimeout(timer))
  },
)
</script>

<template>
  <Editor
    v-model="workspaceStore.sourceCode"
    :language="workspaceStore.languageId"
  />
</template>
