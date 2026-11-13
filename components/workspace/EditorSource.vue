<script lang="ts" setup>
import { watch } from 'vue'
import { useWorkspaceActions } from '@/composables/workspaceActions'
import { useConfigStore } from '@/stores/config'
import { useWorkspaceStore } from '@/stores/workspace'

const { formatActiveJob } = useWorkspaceActions()
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

    const timer = setTimeout(() => formatActiveJob(), 300)
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
