<script lang="ts" setup>
import { watch } from 'vue'
import { useConfigStore } from '@/stores/config'
import { useEditorStore } from '@/stores/editor'

const configStore = useConfigStore()
const editorStore = useEditorStore()

watch(
  () => editorStore.sourceCode,
  () => {
    if (editorStore.sourceCode.length > 0) {
      if (!configStore.autoFormat) return
      editorStore.formatCode()
    } else {
      editorStore.clearCode()
    }
  },
)
</script>

<template>
  <Editor
    v-model="editorStore.sourceCode"
    :language="editorStore.activeLanguage"
  />
</template>
