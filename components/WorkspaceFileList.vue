<script lang="ts" setup>
import {
  CheckCircle2,
  Clock3,
  LoaderCircle,
  TriangleAlert,
  X,
} from '@lucide/vue'
import { computed } from 'vue'
import { i18n } from '#i18n'
import { Button } from '@/components/ui/button'
import { useWorkspaceStore } from '@/stores/workspace'

const workspaceStore = useWorkspaceStore()

const hasVisibleJobs = computed(() => workspaceStore.jobs.length > 1)
</script>

<template>
  <aside
    v-if="hasVisibleJobs"
    class="max-w-64 min-w-56 border-r border-border bg-zinc-50 dark:bg-zinc-900"
  >
    <div
      class="flex items-center justify-between border-b border-border px-3 py-2"
    >
      <h2 class="text-sm font-semibold">{{ i18n.t('files') }}</h2>
      <span class="text-xs opacity-70">{{ workspaceStore.jobs.length }}</span>
    </div>

    <div class="max-h-full overflow-y-auto py-1">
      <div
        v-for="job in workspaceStore.jobs"
        :key="job.id"
        :class="{
          'bg-zinc-200 dark:bg-zinc-800': workspaceStore.activeJobId === job.id,
        }"
        class="flex items-start hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <button
          @click="workspaceStore.selectJob(job.id)"
          :aria-current="workspaceStore.activeJobId === job.id"
          type="button"
          class="flex min-w-0 flex-1 items-start gap-2 px-3 py-2 text-left"
        >
          <TriangleAlert
            v-if="job.status === 'error'"
            class="mt-0.5 size-4 shrink-0 text-red-500"
          />
          <CheckCircle2
            v-else-if="job.status === 'formatted'"
            class="mt-0.5 size-4 shrink-0 text-green-600"
          />
          <LoaderCircle
            v-else-if="job.status === 'formatting'"
            class="mt-0.5 size-4 shrink-0 animate-spin text-sky-600"
          />
          <Clock3
            v-else
            class="mt-0.5 size-4 shrink-0 text-zinc-500"
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
        </button>
        <Button
          @click="workspaceStore.removeJob(job.id)"
          :aria-label="i18n.t('removeFile')"
          variant="ghost"
          size="icon-sm"
          type="button"
          class="mr-1 mt-1 shrink-0 opacity-60 hover:opacity-100"
        >
          <X class="size-4" />
        </Button>
      </div>
    </div>
  </aside>
</template>
