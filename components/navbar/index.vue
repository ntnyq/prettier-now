<script lang="ts" setup>
import {
  Columns2,
  GitMerge,
  Home,
  Moon,
  PanelLeft,
  Settings,
  Sun,
} from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import { i18n } from '#i18n'
import { browser } from '#imports'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toggleDark } from '@/composables/dark'
import { version } from '@/package.json'
import { useAppStore } from '@/stores/app'
import { useWorkspaceStore } from '@/stores/workspace'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const workspaceStore = useWorkspaceStore()

const logoUrl = browser.runtime.getURL('/icons/48.png')
</script>

<template>
  <div
    class="flex flex-wrap items-center justify-between border-b border-border p-2"
  >
    <RouterLink
      to="/"
      class="flex gap-1"
    >
      <img
        :src="logoUrl"
        :alt="i18n.t('logoAlt')"
        class="h-6 w-6"
      />
      <h1 class="text-lg font-bold">{{ i18n.t('appName') }}</h1>
      <small>v{{ version }}</small>
    </RouterLink>

    <div class="flex items-center gap-2">
      <template v-if="route.name === 'Home'">
        <LanguageSelect />

        <Tooltip>
          <TooltipTrigger as-child>
            <div class="p-1 text-sm opacity-80">
              {{ i18n.t('ms', [+workspaceStore.formatCost.toFixed(1)]) }}
            </div>
          </TooltipTrigger>
          <TooltipContent>{{ i18n.t('formatCostTime') }}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              @click="appStore.setIsSettingsSheetVisible(true)"
              :aria-label="i18n.t('settings')"
              variant="ghost"
              size="icon-sm"
              type="button"
            >
              <Settings class="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{{ i18n.t('settings') }}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              @click="appStore.setIsDiffPanelVisible(true)"
              :aria-label="i18n.t('diff')"
              variant="ghost"
              size="icon-sm"
              type="button"
            >
              <GitMerge class="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{{ i18n.t('diff') }}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              @click="appStore.toggleLeftLayout"
              :aria-label="i18n.t('toggleLeftLayout')"
              variant="ghost"
              size="icon-sm"
              type="button"
            >
              <Columns2
                v-if="appStore.showLeftLayout"
                class="size-4"
              />
              <PanelLeft
                v-else
                class="size-4"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{{ i18n.t('toggleLeftLayout') }}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              @click="appStore.toggleRightLayout"
              :aria-label="i18n.t('toggleRightLayout')"
              variant="ghost"
              size="icon-sm"
              type="button"
            >
              <Columns2
                v-if="appStore.showRightLayout"
                class="size-4"
              />
              <PanelLeft
                v-else
                class="size-4 rotate-180"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{{ i18n.t('toggleRightLayout') }}</TooltipContent>
        </Tooltip>
      </template>
      <Tooltip v-else>
        <TooltipTrigger as-child>
          <Button
            @click="router.push({ name: 'Home' })"
            :aria-label="i18n.t('home')"
            variant="ghost"
            size="icon-sm"
            type="button"
          >
            <Home class="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{{ i18n.t('home') }}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            @click="toggleDark"
            :aria-label="i18n.t('toggleColorMode')"
            variant="ghost"
            size="icon-sm"
            type="button"
          >
            <Sun class="size-4 dark:hidden" />
            <Moon class="hidden size-4 dark:block" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{{ i18n.t('toggleColorMode') }}</TooltipContent>
      </Tooltip>
      <MoreAction :show-workspace-actions="route.name === 'Home'" />
    </div>
  </div>
</template>
