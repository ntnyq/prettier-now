<script lang="ts" setup>
import { useEditorStore } from '@/stores/editor'

const editorStore = useEditorStore()
</script>

<template>
  <div class="min-w-0 flex flex-1">
    <Editor
      v-model="editorStore.resultCode"
      :language="editorStore.activeLanguageId"
      class="h-full min-w-0 flex-1"
      disabled
    />
  </div>
</template>
