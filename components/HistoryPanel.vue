<script lang="ts" setup>
import { Check, Trash2, X } from '@lucide/vue'
import dayjs from 'dayjs'
import { onUnmounted, shallowRef } from 'vue'
import { i18n } from '#i18n'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useAppStore } from '@/stores/app'
import { useWorkspaceStore } from '@/stores/workspace'

const appStore = useAppStore()
const workspaceStore = useWorkspaceStore()
const isConfirmingClear = shallowRef(false)
let clearConfirmTimer: number | undefined

function restoreEntry(id: string) {
  if (workspaceStore.restoreHistoryEntry(id)) {
    appStore.setIsHistoryPanelVisible(false)
  }
}

function clearHistory() {
  if (isConfirmingClear.value) {
    workspaceStore.clearFormatHistory()
    isConfirmingClear.value = false
    return
  }

  isConfirmingClear.value = true
  clearConfirmTimer = window.setTimeout(() => {
    isConfirmingClear.value = false
  }, 3000)
}

onUnmounted(() => {
  if (clearConfirmTimer) {
    window.clearTimeout(clearConfirmTimer)
  }
})
</script>

<template>
  <Sheet v-model:open="appStore.isHistoryPanelVisible">
    <SheetContent
      class="w-[min(30rem,100vw)] max-w-none gap-0 p-0 [&_[data-slot=sheet-close]]:hidden"
    >
      <SheetHeader
        class="flex-row items-center justify-between gap-3 border-b border-border px-4 py-2 text-left"
      >
        <SheetTitle class="text-lg">{{ i18n.t('history') }}</SheetTitle>
        <div class="flex items-center gap-2">
          <Button
            @click="clearHistory"
            :aria-label="i18n.t('clearAll')"
            :title="i18n.t('clearAll')"
            variant="ghost"
            size="icon-sm"
            type="button"
          >
            <Check v-if="isConfirmingClear" />
            <Trash2 v-else />
          </Button>
          <Button
            @click="appStore.setIsHistoryPanelVisible(false)"
            :aria-label="i18n.t('close')"
            :title="i18n.t('close')"
            variant="ghost"
            size="icon-sm"
            type="button"
          >
            <X />
          </Button>
        </div>
      </SheetHeader>

      <div
        v-if="workspaceStore.formatHistory.length"
        class="min-h-0 flex-1 overflow-y-auto"
      >
        <div
          v-for="entry in workspaceStore.formatHistory"
          :key="entry.id"
          class="border-b border-border px-4 py-3"
        >
          <div class="flex items-start justify-between gap-3">
            <button
              @click="restoreEntry(entry.id)"
              type="button"
              class="min-w-0 flex-1 text-left"
            >
              <span class="block truncate text-sm font-medium">
                {{ entry.fileName }}
              </span>
              <span class="mt-1 block truncate text-xs opacity-60">
                {{ entry.languageId }} ·
                {{ i18n.t('ms', [+entry.formatCost.toFixed(1)]) }} ·
                {{ dayjs(entry.formattedAt).format('HH:mm:ss') }}
              </span>
            </button>
            <Button
              @click="workspaceStore.removeHistoryEntry(entry.id)"
              :aria-label="i18n.t('deleteHistoryEntry')"
              :title="i18n.t('deleteHistoryEntry')"
              variant="ghost"
              size="icon-sm"
              type="button"
            >
              <X />
            </Button>
          </div>
        </div>
      </div>

      <div
        v-else
        class="flex-center flex-1 px-6 text-center text-sm opacity-60"
      >
        {{ i18n.t('emptyHistory') }}
      </div>
    </SheetContent>
  </Sheet>
</template>
