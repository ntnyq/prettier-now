<script lang="ts" setup>
import { computed, shallowRef } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { isDark } from '@/hooks/useDark'
import { languages } from './language'
import { githubDark, githubLight } from './theme'
import type { Extension } from '@codemirror/state'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    language?: string
    extensions?: Extension[]
    placeholder?: string
    readonly?: boolean
    tabSize?: number
    indentWithTab?: boolean
  }>(),
  {
    modelValue: '',
    extensions: () => [],
    placeholder: '',
    readonly: false,
    tabSize: 2,
    indentWithTab: true,
  },
)
const emits = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const code = computed({
  get() {
    return props.modelValue
  },
  set(val: string) {
    emits('update:modelValue', val)
  },
})

const codeMirrorRef = shallowRef<InstanceType<typeof Codemirror>>()
const resolvedExtensions = computed<Extension[]>(() => {
  return [
    // External extension
    ...(props.extensions ?? []),

    ...(props.language ? [languages.find(item => item.id === props.language)!.extension()] : []),

    // Theme extension
    isDark.value ? githubDark : githubLight,
  ]
})

const handleContentChange = (content: string) => {
  emits('change', content)
}
</script>

<template>
  <div class="">
    <Codemirror
      @change="handleContentChange"
      v-model="code"
      ref="codeMirrorRef"
      :extensions="resolvedExtensions"
      :tab-size="tabSize"
      :placeholder="placeholder"
      :autofocus="!readonly"
      :disabled="readonly"
      :indent-with-tab="indentWithTab"
    />
  </div>
</template>
