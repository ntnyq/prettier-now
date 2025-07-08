<script lang="ts" setup>
import { browser } from '#imports'

const isMac = navigator.userAgent.includes('Mac OS X')

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <div class="h-40 w-60 flex flex-col items-center justify-center gap-5">
    <button
      @click="openOptionsPage"
      class="btn-action !text-sm"
      type="button"
    >
      Open Options Page
    </button>
    <p class="inline-flex items-center text-lg">
      <span class="mr-2">or use</span>
      <kbd class="kbd-key">
        {{ `${isMac ? 'Option' : 'Alt'}+O` }}
      </kbd>
    </p>
  </div>
</template>
