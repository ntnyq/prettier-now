<script lang="ts" setup>
import { useEditorStore } from '@/stores/editor'

const editorStore = useEditorStore()
</script>

<template>
  <Editor
    v-model="editorStore.sourceCode"
    :language="editorStore.activeLanguage"
  />
</template>
