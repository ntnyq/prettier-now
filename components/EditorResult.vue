<script lang="ts" setup>
import { useWorkspaceStore } from '@/stores/workspace'

const workspaceStore = useWorkspaceStore()
</script>

<template>
  <div class="min-w-0 flex flex-1">
    <Editor
      v-model="workspaceStore.resultCode"
      :language="workspaceStore.languageId"
      class="h-full min-w-0 flex-1"
      disabled
    />
  </div>
</template>
