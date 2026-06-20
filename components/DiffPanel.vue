<script lang="ts" setup>
import { X } from '@lucide/vue'
import { computed } from 'vue'
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
import { createLineDiff } from '@/utils/diff'

const appStore = useAppStore()
const workspaceStore = useWorkspaceStore()

const diffLines = computed(() =>
  createLineDiff(workspaceStore.sourceCode, workspaceStore.resultCode),
)
const hasDiff = computed(() => diffLines.value.length > 0)
</script>

<template>
  <Sheet v-model:open="appStore.isDiffPanelVisible">
    <SheetContent
      class="w-[min(40rem,100vw)] max-w-none gap-0 p-0 [&_[data-slot=sheet-close]]:hidden"
    >
      <SheetHeader
        class="flex-row items-center justify-between gap-3 border-b border-border px-4 py-2 text-left"
      >
        <SheetTitle class="text-lg">{{ i18n.t('diff') }}</SheetTitle>
        <Button
          @click="appStore.setIsDiffPanelVisible(false)"
          :aria-label="i18n.t('close')"
          :title="i18n.t('close')"
          variant="ghost"
          size="icon-sm"
          type="button"
        >
          <X />
        </Button>
      </SheetHeader>

      <div
        v-if="hasDiff"
        class="min-h-0 flex-1 overflow-auto font-mono text-sm"
      >
        <div
          v-for="line in diffLines"
          :key="line.id"
          :class="{
            'bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-100':
              line.kind === 'added',
            'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-100':
              line.kind === 'removed',
          }"
          class="grid min-w-max grid-cols-[64px_32px_1fr] border-b border-border/50"
        >
          <span class="select-none px-3 py-1 text-right opacity-50">
            {{ line.lineNumber }}
          </span>
          <span class="select-none px-2 py-1">
            {{
              line.kind === 'added' ? '+' : line.kind === 'removed' ? '-' : ''
            }}
          </span>
          <pre class="whitespace-pre-wrap break-all px-2 py-1">{{
            line.text
          }}</pre>
        </div>
      </div>

      <div
        v-else
        class="flex flex-1 items-center justify-center px-6 text-center text-sm opacity-60"
      >
        {{ i18n.t('emptyDiff') }}
      </div>
    </SheetContent>
  </Sheet>
</template>
