/**
 * @file file
 */

import { i18n } from '#i18n'
import { languageExtensions } from '@/constants/language'
import { useEditorStore } from '@/stores/editor'
import { Logger } from '@/utils/logger'
import { Toast } from '@/utils/toast'

export function useFileHandler() {
  const editorStore = useEditorStore()
  const fileReadErrorMessage = 'Failed to read file'

  async function loadFile(file?: File | null) {
    if (!file) {
      return
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase()

    const languageId =
      languageExtensions[fileExt as keyof typeof languageExtensions]

    if (!languageId) {
      return Toast.error(i18n.t('unsupportedFileFormat'))
    }

    try {
      const fileContent = await file.text()

      if (!fileContent.trim().length) {
        return Toast.error(i18n.t('emptyFile'))
      }

      editorStore.setLanguageId(languageId)
      editorStore.setSourceCode(fileContent)

      await editorStore.formatCode()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : fileReadErrorMessage
      Logger.error(message)
      Toast.error(fileReadErrorMessage)
    }
  }

  async function loadFileList(files?: FileList | null) {
    if (!files?.length) {
      return
    }

    await loadFile(files[0])
  }

  return {
    loadFile,
    loadFileList,
  }
}
