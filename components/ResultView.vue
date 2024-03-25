<script lang="ts" setup>
import { useEditorStore } from '@/stores/editor'

const editorStore = useEditorStore()

const handleFormat = async () => {
  editorStore.formatCode()
}
</script>

<template>
  <div class="min-w-0 flex flex-1 flex-col gap-2">
    <div class="flex flex-wrap items-center justify-end gap-3 px-4">
      <button
        @click="handleFormat"
        class="text-md rounded-md bg-$c-text-base px-3 py-1 text-$c-bg-base transition hover:opacity-80"
      >
        Format
      </button>
    </div>
    <div class="min-h-0 min-w-0 flex-1">
      <Editor
        v-model="editorStore.resultCode"
        :language="editorStore.activeLanguage"
        :options="{ readOnly: true }"
        class="h-full min-w-0 flex-1"
        auto-update
      />
    </div>
  </div>
</template>
