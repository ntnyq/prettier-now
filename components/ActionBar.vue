<script lang="ts" setup>
import 'vercel-toast/css'
import copy from 'copy-text-to-clipboard'
import { createToast, destroyAllToasts } from 'vercel-toast'
import { useEditorStore } from '@/stores/editor'

const editorStore = useEditorStore()

interface ToastOptions {
  isError?: boolean
}

const toast = (msg: string, options: ToastOptions = {}) => {
  destroyAllToasts()
  if (options.isError) {
    const msgNode = document.createElement('div')
    msgNode.innerHTML = `<span style="font-weight: bold; color: red;">❌ Error</span>: ${msg}`
    createToast(msgNode, { timeout: 2e3 })
  } else {
    createToast(msg, { timeout: 2e3 })
  }
}

const handleFormat = async () => {
  if (!editorStore.sourceCode) {
    return toast('Nothing to format')
  }
  try {
    await editorStore.formatCode()
    toast('Format Success')
  } catch (err: unknown) {
    toast((err as Error)?.message || 'Unknown error', { isError: true })
  }
}
const copyResult = () => {
  if (!editorStore.resultCode) {
    return toast('Nothing to copy')
  }

  const isSuccess = copy(editorStore.resultCode)

  isSuccess ? toast('Copied to clipboard') : toast('Failed to copy to clipboard', { isError: true })
}
const clearCode = () => {
  if (!editorStore.sourceCode && !editorStore.resultCode) {
    return toast('Nothing to clear')
  }

  editorStore.clearCode()
  toast('Clear Success')
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
      Clear All
    </button>
    <button
      @click="copyResult"
      type="button"
      class="btn-action"
    >
      Copy Result
    </button>
    <button
      @click="handleFormat"
      type="button"
      class="btn-action"
    >
      Format Source
    </button>
  </div>
</template>
