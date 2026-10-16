<script lang="ts" setup>
import { computed, shallowRef, watch } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { isDark } from '@/composables/dark'
import { loadCodemirrorLanguage } from '@/utils/cache'
import { githubDark, githubLight } from './theme'
import type { ViewUpdate } from '@codemirror/view'
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
const emit = defineEmits<{ userChange: [source: string] }>()
const code = defineModel<string>()
function handleUpdate(update: ViewUpdate) {
  if (
    update.docChanged
    && update.transactions.some(transaction =>
      ['input', 'delete', 'undo', 'redo', 'move'].some(event =>
        transaction.isUserEvent(event),
      ),
    )
  ) {
    emit('userChange', update.state.doc.toString())
  }
}

const languageExtension = shallowRef<CodemirrorExtension>()
let languageLoadRequestId = 0

const resolvedExtensions = computed<CodemirrorExtension[]>(() => [
  // External extensions
  ...props.extensions,
  // Language extension
  ...(languageExtension.value ? [languageExtension.value] : []),
  // Theme extension
  isDark.value ? githubDark : githubLight,
])

watch(
  () => props.language,
  async language => {
    const requestId = ++languageLoadRequestId

    if (!language) {
      languageExtension.value = undefined
      return
    }

    const extension = await loadCodemirrorLanguage(language)

    if (requestId !== languageLoadRequestId) {
      return
    }

    languageExtension.value = extension
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="relative">
    <Codemirror
      @update="handleUpdate"
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
