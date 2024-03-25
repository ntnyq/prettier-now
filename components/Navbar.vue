<script lang="ts" setup>
import { ref } from 'vue'
import { toggleDark } from '@/hooks/useDark'
import { version } from '@/package.json'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const formatCost = ref(23)
</script>

<template>
  <nav class="flex flex-wrap items-center justify-between p-2">
    <div class="flex gap-1">
      <img
        src="/icon/48.png"
        class="h-6 w-6"
        alt="Logo"
      />
      <h1 class="text-lg font-bold">Prettier Now</h1>
      <small>v{{ version }}</small>
    </div>

    <div class="flex gap-2">
      <LanguageSelect />
      <div class="p-1 opacity-80">{{ +formatCost.toFixed(1) }}ms</div>
      <button
        type="button"
        title="Open Prettier Options"
        class="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700"
      >
        <div class="i-ri-settings-line" />
      </button>
      <button
        @click="appStore.toggleLeftLayout"
        title="Toggle Left Layout"
        class="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700"
      >
        <div
          v-if="appStore.showLeftLayout"
          class="i-ri-layout-column-fill"
        />
        <div
          v-else
          class="i-ri-layout-left-line"
        />
      </button>
      <button
        @click="appStore.toggleRightLayout"
        title="Toggle Right Layout"
        class="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700"
      >
        <div
          v-if="appStore.showRightLayout"
          class="i-ri-layout-column-fill rotate-180"
        />
        <div
          v-else
          class="i-ri-layout-left-line rotate-180"
        />
      </button>
      <button
        @click="toggleDark()"
        class="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700"
      >
        <div class="i-ri-sun-line dark:i-ri-moon-line" />
      </button>
      <a
        href="https://github.com/ntnyq/prettier-now"
        target="_blank"
        class="h-8 w-8 flex inline-flex items-center items-center justify-center rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700"
      >
        <div class="i-ri-github-line" />
      </a>
    </div>
  </nav>
</template>
