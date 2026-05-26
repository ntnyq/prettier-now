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
    Logger.warn(i18n.t('nothingToFormat'))
    return Toast.info(i18n.t('nothingToFormat'))
  }

  await editorStore.formatCode()
}
async function copyResult() {
  if (!editorStore.resultCode) {
    Logger.warn(i18n.t('nothingToCopy'))
    return Toast.info(i18n.t('nothingToCopy'))
  }

  try {
    await copy(editorStore.resultCode)
    Logger.success(i18n.t('copiedToClipboard'))
    Toast.info(i18n.t('copiedToClipboard'))
  } catch {
    Logger.error(i18n.t('failedToCopyToClipboard'))
    Toast.error(i18n.t('failedToCopyToClipboard'))
  }
}
function clearAll() {
  if (!editorStore.sourceCode && !editorStore.resultCode) {
    Logger.warn(i18n.t('nothingToClear'))
    return Toast.info(i18n.t('nothingToClear'))
  }

  editorStore.clearWorkspace()

  Logger.success(i18n.t('clearSuccess'))
  Toast.info(i18n.t('clearSuccess'))
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
