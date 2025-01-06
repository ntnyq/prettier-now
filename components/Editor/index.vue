<script lang="ts" setup>
import { useIntervalFn } from '@vueuse/core'
import { computed, shallowRef, watch } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { isDark } from '@/composables/dark'
import { codemirrorLanguageCache } from '@/utils/cache'
import { githubDark, githubLight } from './theme'
import type { CodemirrorExtension } from '@/types/vendor'

const props = withDefaults(
  defineProps<{
    language?: string
    extensions?: CodemirrorExtension[]
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

const languageExtension = shallowRef<CodemirrorExtension>()

const { pause, resume } = useIntervalFn(() => {
  if (!props.language) return

  if (codemirrorLanguageCache.has(props.language)) {
    languageExtension.value = codemirrorLanguageCache.get(props.language)!
    pause()
  }
}, 200)

const resolvedExtensions = computed<CodemirrorExtension[]>(() => [
  // External extension
  ...props.extensions,

  ...(languageExtension.value ? [languageExtension.value] : []),

  // Theme extension
  isDark.value ? githubDark : githubLight,
])

watch(
  () => props.language,
  () => {
    resume()
  },
)
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
