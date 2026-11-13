import { i18n } from '#i18n'
import { useWorkspaceStore } from '@/stores/workspace'
import { downloadTextFile } from '@/utils/download'
import { Logger } from '@/utils/logger'
import { Toast } from '@/utils/toast'
import { getFormattedFileName } from '@/utils/workspace'
import type { FormatJobResult } from '@/types/workspace'

/**
 * Run workspace UI commands and present their outcomes to the user.
 */
export function useWorkspaceActions() {
  const workspaceStore = useWorkspaceStore()

  /**
   * Preserve debug output for both manual and imported formatting attempts.
   *
   * @param result - Outcome of one current formatting request.
   */
  function logFormatResult(result: FormatJobResult) {
    if (result.status === 'error') {
      Logger.error(result.message)
    } else if (result.status === 'formatted') {
      Logger.success(i18n.t('formatSuccess'))
    }
  }

  /**
   * Format the active job and report only the current request's outcome.
   */
  async function formatActiveJob() {
    const result = await workspaceStore.formatActiveJob()
    logFormatResult(result)
    if (result.status === 'error') {
      Toast.error(result.message)
    } else if (result.status === 'empty') {
      Logger.warn(i18n.t('nothingToFormat'))
      Toast.info(i18n.t('nothingToFormat'))
    } else if (result.status === 'formatted') {
      Toast.info(i18n.t('formatSuccess'))
    }
  }

  /**
   * Load selected, dropped or pasted files and report import/batch outcomes.
   *
   * @param files - User-provided file collection.
   */
  async function loadFiles(files?: FileList | File[] | null) {
    const result = await workspaceStore.loadFileList(files)
    if (result.status === 'error') {
      Logger.error(result.message)
      Toast.error(result.message)
    } else if (result.status === 'unsupported') {
      Logger.warn(i18n.t('unsupportedFileFormat'))
      Toast.error(i18n.t('unsupportedFileFormat'))
    } else if (result.status === 'imported') {
      result.results.forEach(logFormatResult)
      if (result.totalCount === 1 && result.results[0]?.status === 'error') {
        Toast.error(result.results[0].message)
      }
      if (result.totalCount > 1) {
        Toast.info(
          i18n.t('formatBatchSuccess', [
            result.successCount,
            result.totalCount,
          ]),
        )
      }
    }
  }

  /**
   * Download successful output, or explain why there is nothing to download.
   *
   * @param all - Whether to download all formatted jobs instead of the active job.
   */
  function downloadResults(all = false) {
    const jobs = all
      ? workspaceStore.formattedJobs
      : workspaceStore.activeJob?.resultCode
        ? [workspaceStore.activeJob]
        : []
    if (!jobs.length) {
      Logger.warn(i18n.t('nothingToDownload'))
      Toast.info(i18n.t('nothingToDownload'))
      return
    }
    for (const job of jobs) {
      downloadTextFile(getFormattedFileName(job.fileName), job.resultCode)
    }
  }

  /**
   * Reset the complete workspace, including files other than the active one.
   */
  function clearWorkspace() {
    if (!workspaceStore.canClearWorkspace) {
      Logger.warn(i18n.t('nothingToClear'))
      Toast.info(i18n.t('nothingToClear'))
      return
    }
    workspaceStore.clearWorkspace()
    Logger.success(i18n.t('clearSuccess'))
    Toast.info(i18n.t('clearSuccess'))
  }

  return {
    formatActiveJob,
    loadFiles,
    downloadResults,
    clearWorkspace,
  }
}
