<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { i18n } from '#i18n'
import { useFileHandler } from '@/composables/fileHandler'

const { loadFileList } = useFileHandler()

const isDragging = ref(false)

let dragCounter = 0

function isFileDrag(evt: DragEvent) {
  return evt.dataTransfer?.types && evt.dataTransfer.types.includes('Files')
}
function onDragEnter(evt: DragEvent) {
  evt.preventDefault()
  if (!isFileDrag(evt)) {
    return
  }

  dragCounter++
  isDragging.value = true
}
function onDragLeave(evt: DragEvent) {
  evt.preventDefault()
  if (!isFileDrag(evt)) {
    return
  }

  dragCounter--

  if (dragCounter <= 0) {
    isDragging.value = false
  }
}
function onDragOver(evt: DragEvent) {
  evt.preventDefault()
}
function onDrop(evt: DragEvent) {
  evt.preventDefault()
  if (!isFileDrag(evt)) {
    return
  }

  isDragging.value = false
  dragCounter = 0

  loadFileList(evt.dataTransfer?.files)
}

onMounted(() => {
  useEventListener('dragenter', onDragEnter)
  useEventListener('dragleave', onDragLeave)
  useEventListener('dragover', onDragOver)
  useEventListener('drop', onDrop)
})
</script>

<template>
  <div
    v-if="isDragging"
    class="pointer-events-auto fixed inset-0 z-dropzone p-10 backdrop-blur-5"
  >
    <div
      class="border-dashed- h-full w-full flex-center flex-col border-3 border-base rounded-2xl bg-white/50 dark:bg-black:50"
    >
      <p class="text-xl">
        {{ i18n.t('dragFileHere') }}
      </p>
    </div>
  </div>
</template>
