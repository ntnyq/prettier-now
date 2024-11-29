/**
 * @file Editor store
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '@/composables/storage'
import { languageParsers } from '@/constants/language'
import { useOptionsStore } from '@/stores/options'
import { formatViaPrettier, plugins } from '@/utils/format'
import { Logger } from '@/utils/logger'
import { Toast } from '@/utils/toast'

export const useEditorStore = defineStore('editor', () => {
  const sourceCode = ref('')
  const resultCode = ref('')

  const optionsStore = useOptionsStore()

  const activeLanguageId = useStorage<string>('activeLanguageId', 'javascript')

  const setActiveLanguageId = (languageId: string) => {
    activeLanguageId.value = languageId
  }

  const formatStartTime = ref(0)
  const formatEndTime = ref(0)
  const formatCost = ref(0)

  const formatCode = async () => {
    const parser = languageParsers[activeLanguageId.value as keyof typeof languageParsers]
    if (!parser) return

    formatStartTime.value = Date.now()

    try {
      const result = await formatViaPrettier(sourceCode.value, {
        ...optionsStore.options,
        ...optionsStore.xmlPluginOptions,
        ...optionsStore.phpPluginOptions,
        ...optionsStore.javaPluginOptions,
        ...optionsStore.sveltePluginOptions,
        plugins,
        parser,
      })

      resultCode.value = result
      formatEndTime.value = Date.now()
      formatCost.value = formatEndTime.value - formatStartTime.value
      formatStartTime.value = 0
      formatEndTime.value = 0

      Logger.success('Format Success')
      Toast.info('Format Success')
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Unknown error'
      Logger.error(message)
      Toast.error(message)
    }
  }

  const clearCode = () => {
    sourceCode.value = ''
    resultCode.value = ''
    formatCost.value = 0
  }

  return {
    sourceCode,
    resultCode,

    activeLanguageId,
    setActiveLanguageId,

    formatCost,
    formatCode,
    clearCode,
  }
})
