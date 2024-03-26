<script lang="ts" setup>
import { useEditorStore } from '@/stores/editor'

const editorStore = useEditorStore()

const handleSourceChange = (source: string) => {
  if (source.length > 0) return
  editorStore.clearCode()
}
</script>

<template>
  <Editor
    @change="handleSourceChange"
    v-model="editorStore.sourceCode"
    :language="editorStore.activeLanguage"
  />
</template>
