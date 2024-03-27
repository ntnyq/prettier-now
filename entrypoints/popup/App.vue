<script lang="ts" setup>
import { browser } from 'wxt/browser'

const isMac = navigator.userAgent.includes('Mac OS X')

const openOptionsPage = () => {
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
    <p class="text-lg">
      or use
      <kbd
        class="border border-gray-300 rounded bg-gray-200 px-2 py-1 text-sm text-gray-700 font-mono shadow"
      >
        {{ `${isMac ? 'Option' : 'Alt'}+O` }}
      </kbd>
    </p>
  </div>
</template>
