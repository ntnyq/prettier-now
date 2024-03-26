/**
 * @file Editor store
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { format, plugins } from '@/utils/format'
import { PARSERS_MAP } from '@/constants/parsers'

export const useEditorStore = defineStore('editor', () => {
  const sourceCode = ref('')
  const resultCode = ref('')

  const activeLanguage = useStorage<string>('activeLanguage', 'javascript')

  const updateActiveLanguage = (language: string) => {
    activeLanguage.value = language
  }
  const formatStartTime = ref(0)
  const formatEndTime = ref(0)
  const formatCost = ref(0)

  const formatCode = async () => {
    try {
      formatStartTime.value = Date.now()

      const parser = PARSERS_MAP[activeLanguage.value as keyof typeof PARSERS_MAP]
      if (!parser) return

      const result = await format(sourceCode.value, {
        plugins,
        parser,
      })

      resultCode.value = result
    } catch (err) {
      console.log(err)
    } finally {
      formatEndTime.value = Date.now()
      formatCost.value = formatEndTime.value - formatStartTime.value
      formatStartTime.value = 0
      formatEndTime.value = 0
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
    updateActiveLanguage,

    formatCost,
    formatCode,
    clearCode,
  }
})
