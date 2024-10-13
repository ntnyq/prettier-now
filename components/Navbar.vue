<script lang="ts" setup>
import { useI18n } from 'petite-vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { toggleDark } from '@/hooks/useDark'
import { version } from '@/package.json'
import { useAppStore } from '@/stores/app'
import { useEditorStore } from '@/stores/editor'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const editorStore = useEditorStore()
</script>

<template>
  <div class="flex flex-wrap items-center justify-between border-b border-base p-2">
    <RouterLink
      to="/"
      class="flex gap-1"
    >
      <img
        src="/icon/48.png"
        class="h-6 w-6"
        alt="Logo"
      />
      <h1 class="text-lg font-bold">Prettier Now</h1>
      <small>v{{ version }}</small>
    </RouterLink>

    <div class="flex gap-2">
      <template v-if="route.name === 'Home'">
        <LanguageSelect />
        <div
          v-tooltip="{ content: t('formatCostTime') }"
          class="p-1 opacity-80"
        >
          {{ t('ms', { n: +editorStore.formatCost.toFixed(1) }) }}
        </div>
        <button
          @click="router.push({ name: 'Options' })"
          v-tooltip="{ content: t('settings') }"
          type="button"
          class="btn-icon"
        >
          <div class="i-ri-settings-line" />
        </button>
        <button
          @click="appStore.toggleLeftLayout"
          v-tooltip="{ content: t('toggleLeftLayout') }"
          class="btn-icon"
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
          v-tooltip="{ content: t('toggleRightLayout') }"
          class="btn-icon"
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
      </template>
      <button
        @click="router.push({ name: 'Home' })"
        v-tooltip="{ content: t('home') }"
        v-else
        type="button"
        class="btn-icon"
      >
        <div class="i-ri-home-3-line" />
      </button>
      <button
        @click="toggleDark"
        v-tooltip="{ content: t('toggleColorMode') }"
        class="btn-icon"
      >
        <div class="i-ri-sun-line dark:i-ri-moon-line" />
      </button>
      <a
        v-tooltip="{ content: t('sourceCode') }"
        href="https://github.com/ntnyq/prettier-now"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-icon"
        role="button"
      >
        <div class="i-ri-github-fill" />
      </a>
    </div>
  </div>
</template>
