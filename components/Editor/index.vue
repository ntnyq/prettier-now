<script lang="ts" setup>
import * as monaco from 'monaco-editor'
import {
  computed,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import { isDark } from '@/composables/dark'
import { getMonacoLanguage } from '@/utils/cache'

const props = withDefaults(
  defineProps<{
    language?: string
    placeholder?: string
    disabled?: boolean
    tabSize?: number
    indentWithTab?: boolean
  }>(),
  {
    placeholder: '',
    disabled: false,
    tabSize: 2,
    indentWithTab: true,
  },
)
const code = defineModel<string>()

const editorContainer = useTemplateRef<HTMLElement>('editorContainer')
const editorInstance = shallowRef<monaco.editor.IStandaloneCodeEditor>()

const monacoLanguage = computed(() => getMonacoLanguage(props.language))
const theme = computed(() => (isDark.value ? 'vs-dark' : 'vs'))

onMounted(() => {
  if (!editorContainer.value) {
    return
  }

  editorInstance.value = monaco.editor.create(editorContainer.value, {
    value: code.value || '',
    language: monacoLanguage.value,
    theme: theme.value,
    readOnly: props.disabled,
    tabSize: props.tabSize,
    insertSpaces: !props.indentWithTab,
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineNumbers: 'on',
    renderWhitespace: 'selection',
    wordWrap: 'on',
  })

  // Listen to content changes
  editorInstance.value.onDidChangeModelContent(() => {
    if (!editorInstance.value) {
      return
    }
    const value = editorInstance.value.getValue()
    if (value !== code.value) {
      code.value = value
    }
  })
})

// Watch code changes from outside
watch(
  () => code.value,
  newValue => {
    if (!editorInstance.value) {
      return
    }
    const currentValue = editorInstance.value.getValue()
    if (newValue !== currentValue) {
      editorInstance.value.setValue(newValue || '')
    }
  },
)

// Watch language changes
watch(monacoLanguage, newLanguage => {
  if (!editorInstance.value) {
    return
  }
  const model = editorInstance.value.getModel()
  if (model) {
    monaco.editor.setModelLanguage(model, newLanguage)
  }
})

// Watch theme changes
watch(theme, newTheme => {
  if (!editorInstance.value) {
    return
  }
  monaco.editor.setTheme(newTheme)
})

// Watch disabled state changes
watch(
  () => props.disabled,
  newDisabled => {
    if (!editorInstance.value) {
      return
    }
    editorInstance.value.updateOptions({ readOnly: newDisabled })
  },
)

onBeforeUnmount(() => {
  editorInstance.value?.dispose()
})
</script>

<template>
  <div
    ref="editorContainer"
    class="h-full w-full"
  />
</template>
