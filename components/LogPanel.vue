<script lang="ts" setup>
import dayjs from 'dayjs'
import { i18n } from '#i18n'
import { useLogStore } from '@/stores/log'

const logStore = useLogStore()
</script>

<template>
  <Modal
    v-model:visible="logStore.isLogPanelVisible"
    direction="right"
  >
    <div class="relative h-full w-120 flex flex-col">
      <div
        class="flex items-center justify-between border-b border-base px-4 py-2"
      >
        <h2 class="text-lg font-semibold">{{ i18n.t('log') }}</h2>
        <IconButton
          @click="logStore.clearAll"
          :tooltip="i18n.t('clearAll')"
          icon="i-ri:delete-bin-line"
        />
      </div>

      <div
        v-if="logStore.logList.length"
        class="min-h-0 flex-1 overflow-y-auto"
      >
        <div
          v-for="log in logStore.logList"
          :key="log.id"
          class="border-b border-base px-4 py-3"
        >
          <div class="flex items-center justify-between gap-3">
            <span
              :class="{
                'text-red-500': log.type === 'error',
                'text-green-600': log.type === 'success',
              }"
              class="text-xs font-semibold uppercase"
            >
              {{ log.type }}
            </span>
            <span class="text-xs opacity-60">
              {{ dayjs(log.createdAt).format('HH:mm:ss') }}
            </span>
          </div>
          <p class="mt-1 break-words text-sm">{{ log.message }}</p>
          <p
            v-if="log.fileName || log.languageId"
            class="mt-1 truncate text-xs opacity-60"
          >
            {{ [log.fileName, log.languageId].filter(Boolean).join(' · ') }}
          </p>
        </div>
      </div>

      <div
        v-else
        class="flex-center flex-1 text-sm opacity-60"
      >
        {{ i18n.t('emptyLog') }}
      </div>
    </div>
  </Modal>
</template>
