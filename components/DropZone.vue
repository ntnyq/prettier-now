<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { i18n } from '#i18n'
import { languageExtensions } from '@/constants/language'
import { useEditorStore } from '@/stores/editor'
import { Toast } from '@/utils/toast'

const editorStore = useEditorStore()

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
async function onImportFile(files?: FileList | null) {
  if (!files) return

  const file = files[0]
  const fileExt = file.name.split('.').pop()?.toLowerCase()
  const fileContent = await file.text()

  const languageId = languageExtensions[fileExt as keyof typeof languageExtensions]

  if (!languageId) {
    return Toast.error(i18n.t('unsupportedFileFormat'))
  }
  if (!fileContent.trim().length) {
    return Toast.error(i18n.t('emptyFile'))
  }

  editorStore.setActiveLanguageId(languageId)
  editorStore.sourceCode = fileContent

  editorStore.formatCode()
}
async function onDrop(evt: DragEvent) {
  evt.preventDefault()
  if (!isFileDrag(evt)) {
    return
  }

  isDragging.value = false
  dragCounter = 0

  await onImportFile(evt.dataTransfer?.files)
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
