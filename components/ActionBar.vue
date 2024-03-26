<script lang="ts" setup>
import 'vercel-toast/css'
import copy from 'copy-text-to-clipboard'
import { createToast, destroyAllToasts } from 'vercel-toast'
import { useEditorStore } from '@/stores/editor'

const editorStore = useEditorStore()

const toast = (msg: string) => {
  destroyAllToasts()
  createToast(msg, { timeout: 2e3 })
}

const handleFormat = async () => {
  if (!editorStore.sourceCode) {
    return toast('Nothing to format')
  }
  try {
    await editorStore.formatCode()
    toast('Format Success')
  } catch {
    toast('Ops, something happened')
  }
}
const copyResult = () => {
  if (!editorStore.sourceCode) {
    return toast('Nothing to copy')
  }

  const isSuccess = copy(editorStore.resultCode)

  isSuccess ? toast('Copied to clipboard') : toast('Failed to copy to clipboard')
}
const clearCode = () => {
  if (!editorStore.sourceCode) {
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
      class="text-md rounded-md bg-$c-text-base px-3 py-1 text-$c-bg-base transition hover:opacity-80"
    >
      Clear
    </button>
    <button
      @click="copyResult"
      type="button"
      class="text-md rounded-md bg-$c-text-base px-3 py-1 text-$c-bg-base transition hover:opacity-80"
    >
      Copy
    </button>
    <button
      @click="handleFormat"
      type="button"
      class="text-md rounded-md bg-$c-text-base px-3 py-1 text-$c-bg-base transition hover:opacity-80"
    >
      Format
    </button>
  </div>
</template>
