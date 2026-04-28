<script lang="ts" setup>
import { useClipboard, useFileDialog } from '@vueuse/core'
import { i18n } from '#i18n'
import { useFileHandler } from '@/composables/fileHandler'
import { useEditorStore } from '@/stores/editor'
import { Logger } from '@/utils/logger'
import { Toast } from '@/utils/toast'

const editorStore = useEditorStore()
const { loadFileList } = useFileHandler()
const { copy } = useClipboard({ legacy: true })

const {
  open: openFileDialog,
  reset: resetSelectedFile,
  onChange: handleFileDialogChange,
} = useFileDialog({
  multiple: false,
})

handleFileDialogChange(async files => {
  try {
    await loadFileList(files)
  } finally {
    resetSelectedFile()
  }
})

async function formatSource() {
  if (!editorStore.sourceCode) {
    Logger.warn('Nothing to format')
    return Toast.info('Nothing to format')
  }

  await editorStore.formatCode()
}
async function copyResult() {
  if (!editorStore.resultCode) {
    Logger.warn('Nothing to copy')
    return Toast.info('Nothing to copy')
  }

  try {
    await copy(editorStore.resultCode)
    Logger.success('Copied to clipboard')
    Toast.info('Copied to clipboard')
  } catch {
    Logger.error('Failed to copy to clipboard')
    Toast.error('Failed to copy to clipboard')
  }
}
function clearAll() {
  if (!editorStore.sourceCode && !editorStore.resultCode) {
    Logger.warn('Nothing to clear')
    return Toast.info('Nothing to clear')
  }

  editorStore.clearWorkspace()

  Logger.success('Clear Success')
  Toast.info('Clear Success')
}
function selectFile() {
  openFileDialog()
}
</script>

<template>
  <div
    class="flex flex-wrap items-center justify-center gap-3 border-t border-base bg-zinc-100 p-4 dark:bg-zinc-800"
  >
    <ActionButton
      @click="selectFile"
      :label="i18n.t('selectFile')"
    />
    <ActionButton
      @click="clearAll"
      :label="i18n.t('clearAll')"
    />
    <ActionButton
      @click="copyResult"
      :label="i18n.t('copyResult')"
    />
    <ActionButton
      @click="formatSource"
      :label="i18n.t('formatSource')"
    />
  </div>
</template>
