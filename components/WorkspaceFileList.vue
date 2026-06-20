<script lang="ts" setup>
import { computed } from 'vue'
import { i18n } from '#i18n'
import { useWorkspaceStore } from '@/stores/workspace'
import type { FormatJobStatus } from '@/types/workspace'

const workspaceStore = useWorkspaceStore()

const statusIconMap: Record<FormatJobStatus, string> = {
  error: 'i-ri:error-warning-line text-red-500',
  formatted: 'i-ri:checkbox-circle-line text-green-600',
  formatting: 'i-ri:loader-4-line animate-spin text-sky-600',
  pending: 'i-ri:time-line text-zinc-500',
}

const hasVisibleJobs = computed(() => workspaceStore.jobs.length > 1)
</script>

<template>
  <aside
    v-if="hasVisibleJobs"
    class="max-w-64 min-w-56 border-r border-base bg-zinc-50 dark:bg-zinc-900"
  >
    <div
      class="flex items-center justify-between border-b border-base px-3 py-2"
    >
      <h2 class="text-sm font-semibold">{{ i18n.t('files') }}</h2>
      <span class="text-xs opacity-70">{{ workspaceStore.jobs.length }}</span>
    </div>

    <div class="max-h-full overflow-y-auto py-1">
      <button
        @click="workspaceStore.selectJob(job.id)"
        v-for="job in workspaceStore.jobs"
        :key="job.id"
        :class="{
          'bg-zinc-200 dark:bg-zinc-800': workspaceStore.activeJobId === job.id,
        }"
        type="button"
        class="w-full flex items-start gap-2 px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <span
          :class="statusIconMap[job.status]"
          class="mt-0.5 shrink-0"
        />
        <span class="min-w-0 flex-1">
          <span class="block truncate text-sm">{{ job.fileName }}</span>
          <span class="block truncate text-xs opacity-65">
            {{ job.languageId }}
            <template v-if="job.formatCost">
              · {{ i18n.t('ms', [+job.formatCost.toFixed(1)]) }}
            </template>
          </span>
          <span
            v-if="job.errorMessage"
            class="mt-1 block truncate text-xs text-red-500"
          >
            {{ job.errorMessage }}
          </span>
        </span>
        <span
          @click.stop="workspaceStore.removeJob(job.id)"
          :aria-label="i18n.t('removeFile')"
          class="i-ri:close-line mt-0.5 shrink-0 opacity-60 hover:opacity-100"
          role="button"
        />
      </button>
    </div>
  </aside>
</template>
