<script lang="ts" setup>
import { useTemplateRef } from 'vue'

withDefaults(
  defineProps<{
    title?: string
    showClose?: boolean
    bodyClass?: string
    wrapperClass?: string
  }>(),
  {
    showClose: true,
    bodyClass: 'w-80vw max-w-480px',
    wrapperClass: 'h-80vh max-h-300px',
  },
)

const dialogRef = useTemplateRef('dialogRef')

function handleShowDialog() {
  dialogRef.value?.showModal()
}
function handleCloseDialog() {
  dialogRef.value?.close()
}
function handleClickDialog(evt: MouseEvent) {
  if (evt.target === evt.currentTarget) {
    handleCloseDialog()
  }
}

defineExpose({
  show: handleShowDialog,
  close: handleCloseDialog,
})
</script>

<template>
  <dialog
    @click="handleClickDialog"
    ref="dialogRef"
    :class="wrapperClass"
    class="border border-base rounded p-0"
  >
    <div
      class="relative h-50px flex items-center justify-center gap-1 border-b border-base text-xl font-semibold"
    >
      <h2 v-if="title">{{ title }}</h2>
      <button
        @click="handleCloseDialog"
        v-if="showClose"
        class="absolute right-1 rounded-md p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700"
        type="button"
        role="button"
      >
        <div class="i-ri:close-line" />
      </button>
    </div>
    <div
      :class="bodyClass"
      class="relative h-[calc(100%-50px)] of-y-auto p-4"
    >
      <slot />
    </div>
  </dialog>
</template>
