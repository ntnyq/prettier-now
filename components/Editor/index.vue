<script lang="ts" setup>
import { Codemirror } from 'vue-codemirror'
import { githubDark, githubLight } from '@/constants/theme'
import { languages } from '@/constants/language'
import type { Extension } from '@codemirror/state'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    language?: string
    extensions?: Extension[]
    placeholder?: string
    readonly?: boolean
  }>(),
  {
    modelValue: '',
    extensions: () => [],
    placeholder: '',
    readonly: false,
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
      :tab-size="2"
      :placeholder="placeholder"
      :autofocus="!readonly"
      :disabled="readonly"
      indent-with-tab
    />
  </div>
</template>
