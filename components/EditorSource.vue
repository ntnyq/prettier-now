<script lang="ts" setup>
import { watch } from 'vue'
import { useConfigStore } from '@/stores/config'
import { useEditorStore } from '@/stores/editor'

const configStore = useConfigStore()
const editorStore = useEditorStore()

let timer: ReturnType<typeof setTimeout> | undefined

watch(
  () => editorStore.sourceCode,
  () => {
    if (timer) {
      clearTimeout(timer)
    }
    if (editorStore.sourceCode.length > 0) {
      if (!configStore.autoFormat) {
        return
      }
      timer = setTimeout(() => {
        editorStore.formatCode()
      }, 300)
    } else {
      editorStore.clearWorkspace()
    }
  },
)
</script>

<template>
  <Editor
    v-model="editorStore.sourceCode"
    :language="editorStore.languageId"
  />
</template>
