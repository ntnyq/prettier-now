<script lang="ts" setup>
import './monaco.worker'
import { defu } from 'defu'
import { computed, shallowRef, watch } from 'vue'
import { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { isDark } from '@/hooks/useDark'
import type { EditorInstance, EditorModel, EditorOptions } from '@/components/Editor/types'

const props = withDefaults(
  defineProps<{
    language?: string
    options?: EditorOptions
    autoUpdate?: boolean
  }>(),
  {
    options: () => ({}),
  },
)

const inputValue = defineModel<string>()
const editorElRef = shallowRef<HTMLDivElement>()
const editorInstance = shallowRef<EditorInstance | null>(null)
const editorModel = shallowRef<EditorModel | null>(null)
const language = computed(() => props.language || props.options.language)
const options = computed(() =>
  defu(props.options, {
    automaticLayout: true,
    theme: isDark.value ? 'vs-dark' : 'vs',
    fontSize: 14,
    tabSize: 2,
    minimap: {
      enabled: false,
    },
  }),
)

watch(
  () => inputValue.value,
  () => {
    if (!props.autoUpdate) return
    editorModel.value?.setValue(inputValue.value ?? '')
  },
)

watch(
  () => props.language,
  () => {
    editorModel.value?.dispose()
    editorModel.value = editor.createModel(inputValue.value ?? '', language.value)
    editorInstance.value?.setModel(editorModel.value)
  },
)

watch(
  () => props.options,
  () => {
    editorInstance.value?.updateOptions(options.value)
  },
)

watch(editorElRef, (newEl, odlEl) => {
  if (!editorElRef.value || odlEl) {
    return
  }
  editorInstance.value = editor.create(editorElRef.value, options.value)
  editorModel.value = editor.createModel(inputValue.value ?? '', language.value)

  editorInstance.value.layout()
  editorInstance.value.setModel(editorModel.value)

  editorInstance.value.onDidChangeModelContent(() => {
    inputValue.value = editorModel.value?.getValue() ?? ''
  })
})
</script>

<template>
  <div
    :key="options.theme"
    ref="editorElRef"
    class="v-monaco-editor"
  />
</template>
