<script lang="ts" setup>
import { computed } from 'vue'
import { i18n } from '#i18n'
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
  <Modal
    v-model:visible="appStore.isDiffPanelVisible"
    direction="right"
  >
    <div class="relative h-full w-160 flex flex-col">
      <div
        class="flex items-center justify-between border-b border-base px-4 py-2"
      >
        <h2 class="text-lg font-semibold">{{ i18n.t('diff') }}</h2>
        <IconButton
          @click="appStore.setIsDiffPanelVisible(false)"
          :tooltip="i18n.t('close')"
          icon="i-ri:close-line"
        />
      </div>

      <div
        v-if="hasDiff"
        class="min-h-0 flex-1 overflow-auto text-sm font-mono"
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
          class="border-base/50 grid grid-cols-[64px_32px_1fr] min-w-max border-b"
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
        class="flex-center flex-1 px-6 text-center text-sm opacity-60"
      >
        {{ i18n.t('emptyDiff') }}
      </div>
    </div>
  </Modal>
</template>
