<script lang="ts" setup>
import { watch } from 'vue'
import { useConfigStore } from '@/stores/config'
import { useWorkspaceStore } from '@/stores/workspace'

const configStore = useConfigStore()
const workspaceStore = useWorkspaceStore()

let timer: ReturnType<typeof setTimeout> | undefined

watch(
  () => workspaceStore.sourceCode,
  () => {
    if (timer) {
      clearTimeout(timer)
    }
    if (workspaceStore.sourceCode.length > 0) {
      if (!configStore.autoFormat) {
        return
      }
      timer = setTimeout(() => {
        workspaceStore.formatActiveJob()
      }, 300)
    }
  },
)
</script>

<template>
  <Editor
    v-model="workspaceStore.sourceCode"
    :language="workspaceStore.languageId"
  />
</template>
