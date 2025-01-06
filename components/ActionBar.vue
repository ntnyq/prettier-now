<script lang="ts" setup>
import { useClipboard, useFileDialog } from '@vueuse/core'
import { i18n } from '#i18n'
import { languageExtensions } from '@/constants/language'
import { useEditorStore } from '@/stores/editor'
import { Logger } from '@/utils/logger'
import { Toast } from '@/utils/toast'

const editorStore = useEditorStore()
const { copy } = useClipboard({ legacy: true })

const {
  open: openFileDialog,
  reset: resetSelectedFile,
  onChange: handleFileDialogChange,
} = useFileDialog({
  multiple: false,
})

handleFileDialogChange(files => {
  if (!files?.length) return

  const file = files[0]
  const fileExt = file.name.split('.').pop()?.toLowerCase()

  const languageId = languageExtensions[fileExt as keyof typeof languageExtensions]

  if (!languageId) {
    return Toast.error(i18n.t('unsupportedFileFormat'))
  }

  const reader = new FileReader()

  reader.addEventListener('load', (event: ProgressEvent<FileReader>) => {
    const content = event.target?.result ?? ''

    if (typeof content !== 'string') return

    if (!content.trim().length) {
      return Toast.error(i18n.t('emptyFile'))
    }

    editorStore.setLanguageId(languageId)
    editorStore.sourceCode = content

    editorStore.formatCode()

    resetSelectedFile()
  })

  reader.readAsText(file)
})

async function formatSource() {
  if (!editorStore.sourceCode) {
    Logger.warn('Nothing to format')
    return Toast.info('Nothing to format')
  }

  editorStore.formatCode()
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
function clearCode() {
  if (!editorStore.sourceCode && !editorStore.resultCode) {
    Logger.warn('Nothing to clear')
    return Toast.info('Nothing to clear')
  }

  editorStore.clearCode()

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
      @click="clearCode"
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
