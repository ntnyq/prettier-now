/**
 * @file Editor store
 */

import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useStorage } from '@/composables/storage'
import { languages } from '@/constants/language'
import { useOptionsStore } from '@/stores/options'
import { loadCodemirrorLanguage } from '@/utils/cache'
import { formatViaPrettier } from '@/utils/format'
import { Logger } from '@/utils/logger'
import { Toast } from '@/utils/toast'

export const useEditorStore = defineStore('editor', () => {
  const sourceCode = ref('')
  const resultCode = ref('')
  const formatCost = ref(0)

  const optionsStore = useOptionsStore()

  const languageId = useStorage<string>('languageId', 'javascript')

  const languageParser = computed(
    () =>
      languages.find(item => item.id === languageId.value)?.parser
      || languageId.value,
  )

  function setLanguageId(id: string) {
    languageId.value = id
  }
  function setSourceCode(code = '') {
    sourceCode.value = code
  }

  function clearWorkspace() {
    sourceCode.value = ''
    resultCode.value = ''
    formatCost.value = 0
  }

  async function formatCode() {
    const formatStartTime = window.performance.now()

    // ensure codemirror language is loaded
    await loadCodemirrorLanguage(languageId.value)

    try {
      const formattedCode = await formatViaPrettier(sourceCode.value, {
        ...optionsStore.options,
        ...optionsStore.xmlPluginOptions,
        ...optionsStore.phpPluginOptions,
        ...optionsStore.javaPluginOptions,
        ...optionsStore.sveltePluginOptions,
        parser: languageParser.value,
        languageId: languageId.value,
      })

      resultCode.value = formattedCode
      formatCost.value = window.performance.now() - formatStartTime

      Logger.success('Format successfully')
      Toast.info('Format successfully')
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Unknown error'
      Logger.error(message)
      Toast.error(message)
    }
  }

  watch(
    languageId,
    newLanguageId => {
      loadCodemirrorLanguage(newLanguageId)
    },
    {
      immediate: true,
      flush: 'post',
    },
  )

  return {
    sourceCode,
    setSourceCode,
    resultCode,

    languageId,
    setLanguageId,

    formatCost,

    formatCode,
    clearWorkspace,
  }
})
