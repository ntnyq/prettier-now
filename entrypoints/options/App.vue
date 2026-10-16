<script setup lang="ts">
import 'vue-sonner/style.css'
import { i18n } from '#i18n'
import CodeBlockSourceInfo from '@/components/codeBlocks/CodeBlockSourceInfo.vue'
import ExtractedCodeImportPanel from '@/components/codeBlocks/ExtractedCodeImportPanel.vue'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useCodeBlockImport } from '@/composables/codeBlockImport'
import { useThemeColor } from '@/composables/themeColor'
import { useWorkspaceStore } from '@/stores/workspace'

useThemeColor()
const { pendingItems, error, isBusy, resolve, retry } = useCodeBlockImport()
const workspaceStore = useWorkspaceStore()
</script>

<template>
  <TooltipProvider>
    <main class="h-screen min-w-[720px] flex flex-col">
      <Navbar class="h-[var(--h-header)]" />
      <p
        v-if="error"
        role="alert"
        class="px-4 py-2 text-sm text-destructive"
      >
        {{ i18n.t(`codeBlocksErrors.${error}`) }}
        <button
          @click="retry"
          type="button"
          class="underline"
        >
          {{ i18n.t('codeBlocksRetry') }}
        </button>
      </p>
      <ExtractedCodeImportPanel
        @resolve="resolve"
        :pending-items
        :is-busy
      />
      <CodeBlockSourceInfo
        v-if="workspaceStore.activeJob?.origin"
        :origin="workspaceStore.activeJob.origin"
      />
      <RouterView class="min-h-0 flex-1" />
    </main>
    <Toaster class="pointer-events-auto" />
  </TooltipProvider>
</template>
