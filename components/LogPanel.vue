<script lang="ts" setup>
import { Trash2, X } from '@lucide/vue'
import dayjs from 'dayjs'
import { i18n } from '#i18n'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useLogStore } from '@/stores/log'

const logStore = useLogStore()
</script>

<template>
  <Sheet v-model:open="logStore.isLogPanelVisible">
    <SheetContent
      class="w-[min(30rem,100vw)] max-w-none gap-0 p-0 [&_[data-slot=sheet-close]]:hidden"
    >
      <SheetHeader
        class="flex-row items-center justify-between gap-3 border-b border-border px-4 py-2 text-left"
      >
        <SheetTitle class="text-lg">{{ i18n.t('log') }}</SheetTitle>
        <div class="flex items-center gap-2">
          <Button
            @click="logStore.clearAll"
            :aria-label="i18n.t('clearAll')"
            :title="i18n.t('clearAll')"
            variant="ghost"
            size="icon-sm"
            type="button"
          >
            <Trash2 />
          </Button>
          <Button
            @click="logStore.setIsLogPanelVisible(false)"
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
        v-if="logStore.logList.length"
        class="min-h-0 flex-1 overflow-y-auto"
      >
        <div
          v-for="log in logStore.logList"
          :key="log.id"
          class="border-b border-border px-4 py-3"
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
        class="flex flex-1 items-center justify-center text-sm opacity-60"
      >
        {{ i18n.t('emptyLog') }}
      </div>
    </SheetContent>
  </Sheet>
</template>
