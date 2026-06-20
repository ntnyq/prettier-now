import { defineStore } from 'pinia'
import { computed, shallowRef } from 'vue'
import { i18n } from '#i18n'
import { useStorage } from '@/composables/storage'
import { languages } from '@/constants/language'
import { useLogStore } from '@/stores/log'
import { useOptionsStore } from '@/stores/options'
import { loadCodemirrorLanguage } from '@/utils/cache'
import { formatViaPrettier } from '@/utils/format'
import {
  addFormatHistoryEntry,
  createFormatHistoryEntry,
  FormatHistoryEntryListSchema,
  removeFormatHistoryEntry,
} from '@/utils/history'
import { Logger } from '@/utils/logger'
import { Toast } from '@/utils/toast'
import {
  createFormatJobsFromFiles,
  downloadTextFile,
  getFormattedFileName,
  updateFormatJobLanguage,
} from '@/utils/workspace'
import type { FormatHistoryEntry } from '@/types/history'
import type { FormatJob } from '@/types/workspace'

const MANUAL_JOB_ID = 'manual'

function createManualJob(languageId = 'javascript'): FormatJob {
  return {
    id: MANUAL_JOB_ID,
    fileName: 'untitled',
    languageId,
    sourceCode: '',
    resultCode: '',
    status: 'pending',
    errorMessage: '',
    formatCost: 0,
  }
}

export const useWorkspaceStore = defineStore('workspace', () => {
  const jobs = shallowRef<FormatJob[]>([createManualJob()])
  const activeJobId = shallowRef(MANUAL_JOB_ID)
  const formatHistory = useStorage<FormatHistoryEntry[]>(
    'formatHistory',
    [],
    FormatHistoryEntryListSchema,
  )
  let formatRequestId = 0

  const optionsStore = useOptionsStore()
  const logStore = useLogStore()

  const activeJob = computed(
    () => jobs.value.find(job => job.id === activeJobId.value) ?? jobs.value[0],
  )
  const hasMultipleJobs = computed(() => jobs.value.length > 1)
  const formattedJobs = computed(() =>
    jobs.value.filter(job => job.status === 'formatted' && job.resultCode),
  )

  const languageId = computed(() => activeJob.value?.languageId ?? 'javascript')
  const languageParser = computed(
    () =>
      languages.find(item => item.id === languageId.value)?.parser
      || languageId.value,
  )
  const sourceCode = computed({
    get: () => activeJob.value?.sourceCode ?? '',
    set: value => {
      const job = ensureActiveJob()
      patchJob(job.id, {
        sourceCode: value,
        resultCode: '',
        status: 'pending',
        errorMessage: '',
        formatCost: 0,
      })
      invalidateFormatRequest()
    },
  })
  const resultCode = computed({
    get: () => activeJob.value?.resultCode ?? '',
    set: value => {
      const job = ensureActiveJob()
      patchJob(job.id, { resultCode: value })
    },
  })
  const formatCost = computed(() => activeJob.value?.formatCost ?? 0)

  function invalidateFormatRequest() {
    formatRequestId += 1
  }

  function ensureActiveJob() {
    if (activeJob.value) {
      return activeJob.value
    }

    const job = createManualJob()
    jobs.value = [job]
    activeJobId.value = job.id
    return job
  }

  function patchJob(id: string, patch: Partial<FormatJob>) {
    jobs.value = jobs.value.map(job =>
      job.id === id
        ? {
            ...job,
            ...patch,
          }
        : job,
    )
  }

  function selectJob(id: string) {
    if (!jobs.value.some(job => job.id === id)) {
      return
    }

    activeJobId.value = id
  }

  function removeJob(id: string) {
    const nextJobs = jobs.value.filter(job => job.id !== id)

    jobs.value = nextJobs.length
      ? nextJobs
      : [createManualJob(languageId.value)]

    if (activeJobId.value === id) {
      activeJobId.value = jobs.value[0]?.id ?? MANUAL_JOB_ID
    }

    invalidateFormatRequest()
  }

  function clearWorkspace() {
    invalidateFormatRequest()
    jobs.value = [createManualJob(languageId.value)]
    activeJobId.value = MANUAL_JOB_ID
  }

  function setLanguageId(id: string) {
    const job = ensureActiveJob()
    invalidateFormatRequest()
    jobs.value = jobs.value.map(item =>
      item.id === job.id ? updateFormatJobLanguage(item, id) : item,
    )
  }

  async function loadFileList(files?: FileList | File[] | null) {
    if (!files?.length) {
      return
    }

    const nextJobs = await createFormatJobsFromFiles(files)

    if (!nextJobs.length) {
      Logger.warn(i18n.t('unsupportedFileFormat'))
      Toast.error(i18n.t('unsupportedFileFormat'))
      return
    }

    invalidateFormatRequest()
    jobs.value = nextJobs
    activeJobId.value = nextJobs[0]?.id ?? MANUAL_JOB_ID

    await formatJobs(nextJobs.map(job => job.id))
  }

  async function formatActiveJob() {
    const job = activeJob.value

    if (!job?.sourceCode) {
      Logger.warn(i18n.t('nothingToFormat'))
      Toast.info(i18n.t('nothingToFormat'))
      return
    }

    await formatJob(job.id, { notify: true })
  }

  async function formatJobs(jobIds = jobs.value.map(job => job.id)) {
    let successCount = 0

    for (const id of jobIds) {
      const isSuccess = await formatJob(id, { notify: false })
      if (isSuccess) {
        successCount += 1
      }
    }

    if (jobIds.length > 1) {
      Toast.info(i18n.t('formatBatchSuccess', [successCount, jobIds.length]))
    }
  }

  async function formatJob(id: string, options: { notify: boolean }) {
    const requestId = ++formatRequestId
    const job = jobs.value.find(item => item.id === id)

    if (!job) {
      return false
    }

    const formatStartTime = window.performance.now()
    const parser =
      languages.find(item => item.id === job.languageId)?.parser
      || job.languageId

    patchJob(id, {
      status: 'formatting',
      errorMessage: '',
    })

    try {
      await loadCodemirrorLanguage(job.languageId)

      const formattedCode = await formatViaPrettier(job.sourceCode, {
        ...optionsStore.options,
        ...optionsStore.xmlPluginOptions,
        ...optionsStore.phpPluginOptions,
        ...optionsStore.javaPluginOptions,
        ...optionsStore.sveltePluginOptions,
        ...optionsStore.tomlPluginOptions,
        parser,
        languageId: job.languageId,
      })

      if (requestId !== formatRequestId) {
        return false
      }

      const cost = window.performance.now() - formatStartTime

      patchJob(id, {
        resultCode: formattedCode,
        formatCost: cost,
        status: 'formatted',
      })
      formatHistory.value = addFormatHistoryEntry(
        formatHistory.value,
        createFormatHistoryEntry({
          fileName: job.fileName,
          languageId: job.languageId,
          sourceCode: job.sourceCode,
          resultCode: formattedCode,
          formatCost: cost,
        }),
      )
      logStore.addLog({
        type: 'success',
        message: i18n.t('formatSuccess'),
        fileName: job.fileName,
        languageId: job.languageId,
      })
      Logger.success(i18n.t('formatSuccess'))

      if (options.notify) {
        Toast.info(i18n.t('formatSuccess'))
      }

      return true
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Unknown error'

      patchJob(id, {
        status: 'error',
        errorMessage: message,
      })
      logStore.addLog({
        type: 'error',
        message,
        fileName: job.fileName,
        languageId: job.languageId,
      })
      Logger.error(message)

      if (options.notify) {
        Toast.error(message)
      }

      return false
    }
  }

  function downloadActiveJob() {
    const job = activeJob.value

    if (!job?.resultCode) {
      Logger.warn(i18n.t('nothingToDownload'))
      Toast.info(i18n.t('nothingToDownload'))
      return
    }

    downloadTextFile(getFormattedFileName(job.fileName), job.resultCode)
  }

  function downloadAllJobs() {
    if (!formattedJobs.value.length) {
      Logger.warn(i18n.t('nothingToDownload'))
      Toast.info(i18n.t('nothingToDownload'))
      return
    }

    for (const job of formattedJobs.value) {
      downloadTextFile(getFormattedFileName(job.fileName), job.resultCode)
    }
  }

  function restoreHistoryEntry(id: string) {
    const entry = formatHistory.value.find(item => item.id === id)

    if (!entry) {
      return false
    }

    invalidateFormatRequest()
    jobs.value = [
      {
        id: `history-${entry.id}`,
        fileName: entry.fileName,
        languageId: entry.languageId,
        sourceCode: entry.sourceCode,
        resultCode: entry.resultCode,
        status: 'formatted',
        errorMessage: '',
        formatCost: entry.formatCost,
      },
    ]
    activeJobId.value = jobs.value[0]!.id
    Toast.info(i18n.t('restoreHistorySuccess'))

    return true
  }

  function removeHistoryEntry(id: string) {
    formatHistory.value = removeFormatHistoryEntry(formatHistory.value, id)
  }

  function clearFormatHistory() {
    formatHistory.value = []
  }

  return {
    jobs,
    activeJobId,
    activeJob,
    hasMultipleJobs,
    formattedJobs,
    formatHistory,

    languageId,
    languageParser,
    sourceCode,
    resultCode,
    formatCost,

    selectJob,
    removeJob,
    clearWorkspace,
    setLanguageId,
    loadFileList,
    formatActiveJob,
    formatJobs,
    downloadActiveJob,
    downloadAllJobs,
    restoreHistoryEntry,
    removeHistoryEntry,
    clearFormatHistory,
  }
})
