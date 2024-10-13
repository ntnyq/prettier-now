/**
 * @file Editor store
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { PARSERS_MAP } from '@/constants/parsers'
import { useStorage } from '@/hooks/useStorage'
import { useOptionsStore } from '@/stores/options'
import { formatViaPrettier, plugins } from '@/utils/format'
import { Logger } from '@/utils/logger'
import { Toast } from '@/utils/toast'

export const useEditorStore = defineStore('editor', () => {
  const sourceCode = ref('')
  const resultCode = ref('')

  const optionsStore = useOptionsStore()

  const activeLanguage = useStorage<string>('activeLanguage', 'javascript')

  const setActiveLanguage = (language: string) => {
    activeLanguage.value = language
  }

  const formatStartTime = ref(0)
  const formatEndTime = ref(0)
  const formatCost = ref(0)

  const formatCode = async () => {
    const parser = PARSERS_MAP[activeLanguage.value as keyof typeof PARSERS_MAP]
    if (!parser) return

    formatStartTime.value = Date.now()

    try {
      const result = await formatViaPrettier(sourceCode.value, {
        ...optionsStore.options,
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

    activeLanguage,
    setActiveLanguage,

    formatCost,
    formatCode,
    clearCode,
  }
})
