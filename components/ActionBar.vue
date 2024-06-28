<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useClipboard } from '@vueuse/core'
import { useEditorStore } from '@/stores/editor'
import { Toast } from '@/utils/toast'
import { Logger } from '@/utils/logger'

const { t } = useI18n()
const editorStore = useEditorStore()
const { copy } = useClipboard({ legacy: true })

const handleFormat = async () => {
  if (!editorStore.sourceCode) {
    Logger.warn('Nothing to format')
    return Toast.info('Nothing to format')
  }

  try {
    await editorStore.formatCode()

    Logger.success('Format Success')
    Toast.info('Format Success')
  } catch (err: unknown) {
    Logger.error((err as Error)?.message || 'Unknown error')
    Toast.error((err as Error)?.message || 'Unknown error')
  }
}
const copyResult = async () => {
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
const clearCode = () => {
  if (!editorStore.sourceCode && !editorStore.resultCode) {
    Logger.warn('Nothing to clear')
    return Toast.info('Nothing to clear')
  }

  editorStore.clearCode()

  Logger.success('Clear Success')
  Toast.info('Clear Success')
}
</script>

<template>
  <div
    class="flex flex-wrap items-center justify-center gap-3 border-t border-base bg-zinc-100 p-4 dark:bg-zinc-800"
  >
    <button
      @click="clearCode"
      type="button"
      class="btn-action"
    >
      {{ t('clearAll') }}
    </button>
    <button
      @click="copyResult"
      type="button"
      class="btn-action"
    >
      {{ t('copyResult') }}
    </button>
    <button
      @click="handleFormat"
      type="button"
      class="btn-action"
    >
      {{ t('formatSource') }}
    </button>
  </div>
</template>
