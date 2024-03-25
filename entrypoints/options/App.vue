<script lang="ts" setup>
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
</script>

<template>
  <main class="h-screen flex flex-col">
    <Navbar class="mb-1" />
    <div class="min-h-0 flex flex-1 gap-3">
      <EditorSource
        v-show="appStore.showLeftLayout"
        :class="[appStore.showRightLayout ? 'max-w-1/2 min-w1/2' : 'max-w-full min-w-full']"
        class="flex-1"
      />
      <ResultView v-show="appStore.showRightLayout" />
    </div>
  </main>
</template>
