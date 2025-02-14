/**
 * @file file
 */

import { languageExtensions } from '@/constants/language'
import { useEditorStore } from '@/stores/editor'
import { Toast } from '@/utils/toast'
import { i18n } from '#i18n'

export function useFileHandler() {
  const editorStore = useEditorStore()

  async function loadFileList(files?: FileList | null) {
    if (!files) return

    const file = files[0]
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    const fileContent = await file.text()

    const languageId =
      languageExtensions[fileExt as keyof typeof languageExtensions]

    if (!languageId) {
      return Toast.error(i18n.t('unsupportedFileFormat'))
    }
    if (!fileContent.trim().length) {
      return Toast.error(i18n.t('emptyFile'))
    }

    editorStore.setLanguageId(languageId)
    editorStore.sourceCode = fileContent

    editorStore.formatCode()
  }

  return {
    loadFileList,
  }
}
