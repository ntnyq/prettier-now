<script lang="ts" setup>
import { computed } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { isDark } from '@/composables/dark'
import { languages } from '@/constants/language'
import { githubDark, githubLight } from './theme'
import type { Extension } from '@codemirror/state'

const props = withDefaults(
  defineProps<{
    language?: string
    extensions?: Extension[]
    placeholder?: string
    disabled?: boolean
    tabSize?: number
    indentWithTab?: boolean
  }>(),
  {
    extensions: () => [],
    placeholder: '',
    disabled: false,
    tabSize: 2,
    indentWithTab: true,
  },
)
const code = defineModel<string>()

const resolvedExtensions = computed<Extension[]>(() => [
  // External extension
  ...props.extensions,

  // Language extension
  ...(props.language ? [languages.find(item => item.id === props.language)!.extension()] : []),

  // Theme extension
  isDark.value ? githubDark : githubLight,
])
</script>

<template>
  <div class="relative">
    <Codemirror
      v-model="code"
      :extensions="resolvedExtensions"
      :tab-size="tabSize"
      :placeholder="placeholder"
      :autofocus="!disabled"
      :disabled="disabled"
      :indent-with-tab="indentWithTab"
    />
  </div>
</template>
