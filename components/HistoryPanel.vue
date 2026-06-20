<script lang="ts" setup>
import dayjs from 'dayjs'
import { i18n } from '#i18n'
import { useAppStore } from '@/stores/app'
import { useWorkspaceStore } from '@/stores/workspace'

const appStore = useAppStore()
const workspaceStore = useWorkspaceStore()

function restoreEntry(id: string) {
  if (workspaceStore.restoreHistoryEntry(id)) {
    appStore.setIsHistoryPanelVisible(false)
  }
}
</script>

<template>
  <Modal
    v-model:visible="appStore.isHistoryPanelVisible"
    direction="right"
  >
    <div class="relative h-full w-120 flex flex-col">
      <div
        class="flex items-center justify-between border-b border-base px-4 py-2"
      >
        <h2 class="text-lg font-semibold">{{ i18n.t('history') }}</h2>
        <div class="flex items-center gap-2">
          <IconButton
            @click="workspaceStore.clearFormatHistory"
            :tooltip="i18n.t('clearAll')"
            icon="i-ri:delete-bin-line"
          />
          <IconButton
            @click="appStore.setIsHistoryPanelVisible(false)"
            :tooltip="i18n.t('close')"
            icon="i-ri:close-line"
          />
        </div>
      </div>

      <div
        v-if="workspaceStore.formatHistory.length"
        class="min-h-0 flex-1 overflow-y-auto"
      >
        <div
          v-for="entry in workspaceStore.formatHistory"
          :key="entry.id"
          class="border-b border-base px-4 py-3"
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
            <IconButton
              @click="workspaceStore.removeHistoryEntry(entry.id)"
              :tooltip="i18n.t('deleteHistoryEntry')"
              icon="i-ri:close-line"
            />
          </div>
        </div>
      </div>

      <div
        v-else
        class="flex-center flex-1 px-6 text-center text-sm opacity-60"
      >
        {{ i18n.t('emptyHistory') }}
      </div>
    </div>
  </Modal>
</template>
