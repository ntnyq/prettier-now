<script lang="ts" setup>
import { computed, shallowRef, watch } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { isDark } from '@/composables/dark'
import { loadCodemirrorLanguage } from '@/utils/codemirrorLanguages'
import { githubDark, githubLight } from './theme'
import type { LanguageId } from '@/types/language'
import type { CodemirrorExtension } from '@/types/vendor'

const props = withDefaults(
  defineProps<{
    language?: LanguageId
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

const resolvedExtensions = computed<CodemirrorExtension[]>(() => [
  // External extensions
  ...props.extensions,
  // Language extension
  ...(languageExtension.value ? [languageExtension.value] : []),
  // Theme extension
  isDark.value ? githubDark : githubLight,
])

let languageLoadRequestId = 0

watch(
  () => props.language,
  async language => {
    const requestId = ++languageLoadRequestId

    if (!language) {
      languageExtension.value = undefined
      return
    }

    try {
      const extension = await loadCodemirrorLanguage(language)
      if (requestId === languageLoadRequestId) {
        languageExtension.value = extension
      }
    } catch (error) {
      if (requestId === languageLoadRequestId) {
        languageExtension.value = undefined
        console.error('Failed to load editor language', error)
      }
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="relative">
    <Codemirror
      v-model="code"
      :extensions="resolvedExtensions"
      :tab-size
      :placeholder
      :autofocus="!disabled"
      :disabled
      :indent-with-tab
    />
  </div>
</template>
