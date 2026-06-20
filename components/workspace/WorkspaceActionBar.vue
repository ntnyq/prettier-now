<script lang="ts" setup>
import {
  Copy,
  Download,
  EllipsisVertical,
  FileDown,
  FilePlus,
  Sparkles,
  Trash2,
} from '@lucide/vue'
import { useClipboard, useFileDialog } from '@vueuse/core'
import { i18n } from '#i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useFileHandler } from '@/composables/fileHandler'
import { useWorkspaceStore } from '@/stores/workspace'
import { Logger } from '@/utils/logger'
import { Toast } from '@/utils/toast'

const workspaceStore = useWorkspaceStore()
const { loadFileList } = useFileHandler()
const { copy } = useClipboard({ legacy: true })

const {
  open: openFileDialog,
  reset: resetSelectedFile,
  onChange: handleFileDialogChange,
} = useFileDialog({
  multiple: true,
})

handleFileDialogChange(async files => {
  try {
    await loadFileList(files)
  } finally {
    resetSelectedFile()
  }
})

async function formatSource() {
  await workspaceStore.formatActiveJob()
}

async function copyResult() {
  if (!workspaceStore.resultCode) {
    Logger.warn(i18n.t('nothingToCopy'))
    return Toast.info(i18n.t('nothingToCopy'))
  }

  try {
    await copy(workspaceStore.resultCode)
    Logger.success(i18n.t('copiedToClipboard'))
    Toast.info(i18n.t('copiedToClipboard'))
  } catch {
    Logger.error(i18n.t('failedToCopyToClipboard'))
    Toast.error(i18n.t('failedToCopyToClipboard'))
  }
}

function clearAll() {
  if (!workspaceStore.sourceCode && !workspaceStore.resultCode) {
    Logger.warn(i18n.t('nothingToClear'))
    return Toast.info(i18n.t('nothingToClear'))
  }

  workspaceStore.clearWorkspace()

  Logger.success(i18n.t('clearSuccess'))
  Toast.info(i18n.t('clearSuccess'))
}

function selectFile() {
  openFileDialog()
}
</script>

<template>
  <TooltipProvider>
    <div
      class="flex flex-wrap items-center justify-center gap-2 border-t border-border bg-background/95 px-4 py-3 shadow-[0_-1px_12px_rgba(15,23,42,0.06)] backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            @click="selectFile"
            :aria-label="i18n.t('selectFile')"
            variant="outline"
            size="icon-lg"
            type="button"
          >
            <FilePlus class="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{{ i18n.t('selectFile') }}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            @click="copyResult"
            :aria-label="i18n.t('copyResult')"
            variant="outline"
            size="icon-lg"
            type="button"
          >
            <Copy class="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{{ i18n.t('copyResult') }}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            @click="workspaceStore.downloadActiveJob"
            :aria-label="i18n.t('downloadResult')"
            variant="outline"
            size="icon-lg"
            type="button"
          >
            <Download class="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{{ i18n.t('downloadResult') }}</TooltipContent>
      </Tooltip>

      <Button
        @click="formatSource"
        size="lg"
        type="button"
        class="min-w-[10.5rem] shadow-sm"
      >
        <Sparkles class="size-4" />
        {{ i18n.t('formatSource') }}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            :aria-label="`${i18n.t('downloadAll')} / ${i18n.t('clearAll')}`"
            variant="outline"
            size="icon-lg"
            type="button"
          >
            <EllipsisVertical class="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          class="w-48"
        >
          <DropdownMenuItem @click="workspaceStore.downloadAllJobs">
            <FileDown class="size-4" />
            {{ i18n.t('downloadAll') }}
          </DropdownMenuItem>
          <DropdownMenuItem
            @click="clearAll"
            variant="destructive"
          >
            <Trash2 class="size-4" />
            {{ i18n.t('clearAll') }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </TooltipProvider>
</template>
