<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { i18n } from '#i18n'
import { browser } from '#imports'
import { toggleDark } from '@/composables/dark'
import { version } from '@/package.json'
import { useAppStore } from '@/stores/app'
import { useEditorStore } from '@/stores/editor'
// import { useLogStore } from '@/stores/log'

const route = useRoute()
const router = useRouter()
// const logStore = useLogStore()
const appStore = useAppStore()
const editorStore = useEditorStore()

const logoUrl = browser.runtime.getURL('/icons/48.png')
</script>

<template>
  <div
    class="flex flex-wrap items-center justify-between border-b border-base p-2"
  >
    <RouterLink
      to="/"
      class="flex gap-1"
    >
      <img
        :src="logoUrl"
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
          v-tooltip="{ content: i18n.t('formatCostTime') }"
          class="p-1 opacity-80"
        >
          {{ i18n.t('ms', [+editorStore.formatCost.toFixed(1)]) }}
        </div>
        <IconButton
          @click="router.push({ name: 'Options' })"
          :tooltip="i18n.t('settings')"
          icon="i-ri:settings-line"
        />
        <IconButton
          @click="appStore.toggleLeftLayout"
          :icon="
            appStore.showLeftLayout
              ? 'i-ri:layout-column-fill'
              : 'i-ri:layout-left-line'
          "
          :tooltip="i18n.t('toggleLeftLayout')"
        />
        <IconButton
          @click="appStore.toggleRightLayout"
          :icon="
            appStore.showRightLayout
              ? 'i-ri:layout-column-fill'
              : 'i-ri:layout-left-line'
          "
          :tooltip="i18n.t('toggleRightLayout')"
          icon-class="rotate-180"
        />
        <!--
          <IconButton
          @click="logStore.setIsLogPanelVisible(true)"
          :tooltip="t('log')"
          icon="i-lucide:logs"
          /> 
        -->
      </template>
      <IconButton
        @click="router.push({ name: 'Home' })"
        v-else
        :tooltip="i18n.t('home')"
        icon="i-ri:home-3-line"
      />
      <IconButton
        @click="toggleDark"
        :tooltip="i18n.t('toggleColorMode')"
        icon="i-ri:sun-line dark:i-ri:moon-line"
      />
      <MoreAction />
    </div>
  </div>
</template>
