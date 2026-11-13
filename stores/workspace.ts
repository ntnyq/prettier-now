import { defineStore } from 'pinia'
import { computed, shallowRef } from 'vue'
import { i18n } from '#i18n'
import { useHistoryStore } from '@/stores/history'
import { useLogStore } from '@/stores/log'
import { useOptionsStore } from '@/stores/options'
import { formatViaPrettier } from '@/utils/format'
import { resolveFormatOptions } from '@/utils/resolveFormatOptions'
import {
  createFormatJobsFromFiles,
  updateFormatJobLanguage,
} from '@/utils/workspace'
import type { LanguageId } from '@/types/language'
import type {
  FileImportResult,
  FormatJob,
  FormatJobResult,
} from '@/types/workspace'

const MANUAL_JOB_ID = 'manual'

function createManualJob(languageId: LanguageId = 'javascript'): FormatJob {
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
  const formatRequests = new Map<string, symbol>()
  let fileLoadRevision = 0
  // Replacing the workspace cancels batch notifications; editing one job does not.
  let workspaceRevision = 0

  const optionsStore = useOptionsStore()
  const logStore = useLogStore()
  const historyStore = useHistoryStore()

  const activeJob = computed(
    () => jobs.value.find(job => job.id === activeJobId.value) ?? jobs.value[0],
  )
  const hasMultipleJobs = computed(() => jobs.value.length > 1)
  const canClearWorkspace = computed(
    () =>
      jobs.value.length > 1
      || jobs.value.some(
        job => job.id !== MANUAL_JOB_ID || job.sourceCode || job.resultCode,
      ),
  )
  const formattedJobs = computed(() =>
    jobs.value.filter(job => job.status === 'formatted' && job.resultCode),
  )

  const languageId = computed(() => activeJob.value?.languageId ?? 'javascript')
  const sourceCode = computed({
    get: () => activeJob.value?.sourceCode ?? '',
    set(value) {
      fileLoadRevision += 1
      const job = ensureActiveJob()
      patchJob(job.id, {
        sourceCode: value,
        resultCode: '',
        status: 'pending',
        errorMessage: '',
        formatCost: 0,
      })
      invalidateFormatRequest(job.id)
    },
  })
  const resultCode = computed({
    get: () => activeJob.value?.resultCode ?? '',
    set(value) {
      const job = ensureActiveJob()
      patchJob(job.id, { resultCode: value })
    },
  })
  const formatCost = computed(() => activeJob.value?.formatCost ?? 0)

  function invalidateFormatRequest(id?: string) {
    if (id) {
      formatRequests.delete(id)
    } else {
      formatRequests.clear()
    }
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
    fileLoadRevision += 1
    const nextJobs = jobs.value.filter(job => job.id !== id)

    if (!nextJobs.length) {
      workspaceRevision += 1
    }

    jobs.value = nextJobs.length
      ? nextJobs
      : [createManualJob(languageId.value)]

    if (activeJobId.value === id) {
      activeJobId.value = jobs.value[0]?.id ?? MANUAL_JOB_ID
    }

    invalidateFormatRequest(id)
  }

  function clearWorkspace() {
    fileLoadRevision += 1
    workspaceRevision += 1
    invalidateFormatRequest()
    jobs.value = [createManualJob(languageId.value)]
    activeJobId.value = MANUAL_JOB_ID
  }

  function setLanguageId(id: LanguageId) {
    fileLoadRevision += 1
    const job = ensureActiveJob()
    invalidateFormatRequest(job.id)
    jobs.value = jobs.value.map(item =>
      item.id === job.id ? updateFormatJobLanguage(item, id) : item,
    )
  }

  async function loadFileList(
    files?: FileList | File[] | null,
  ): Promise<FileImportResult> {
    if (!files?.length) {
      return {
        status: 'empty',
      }
    }

    const revision = ++fileLoadRevision
    let nextJobs: FormatJob[]
    try {
      nextJobs = await createFormatJobsFromFiles(files)
    } catch (error) {
      return revision === fileLoadRevision
        ? {
            status: 'error',
            message:
              error instanceof Error ? error.message : 'Failed to read files',
          }
        : { status: 'superseded' }
    }

    if (revision !== fileLoadRevision) {
      return {
        status: 'superseded',
      }
    }
    if (!nextJobs.length) {
      return {
        status: 'unsupported',
      }
    }

    invalidateFormatRequest()
    jobs.value = nextJobs
    activeJobId.value = nextJobs[0]?.id ?? MANUAL_JOB_ID

    const importedWorkspaceRevision = ++workspaceRevision
    const result = await formatJobs(nextJobs.map(job => job.id))
    if (importedWorkspaceRevision !== workspaceRevision) {
      return {
        status: 'superseded',
      }
    }
    return {
      status: 'imported',
      ...result,
    }
  }

  async function formatActiveJob(): Promise<FormatJobResult> {
    const job = activeJob.value
    if (!job?.sourceCode) {
      return {
        status: 'empty',
      }
    }
    return formatJob(job.id)
  }

  async function formatJobs(jobIds = jobs.value.map(job => job.id)) {
    let successCount = 0
    const results: FormatJobResult[] = []

    for (const id of jobIds) {
      const result = await formatJob(id)
      results.push(result)
      if (result.status === 'formatted') {
        successCount += 1
      }
    }

    return {
      successCount,
      totalCount: jobIds.length,
      results,
    }
  }

  async function formatJob(id: string): Promise<FormatJobResult> {
    const job = jobs.value.find(item => item.id === id)

    if (!job) {
      return {
        status: 'superseded',
      }
    }

    const requestId = Symbol(id)
    formatRequests.set(id, requestId)
    const formatStartTime = window.performance.now()
    patchJob(id, {
      status: 'formatting',
      errorMessage: '',
    })

    try {
      const formattedCode = await formatViaPrettier(
        job.sourceCode,
        resolveFormatOptions(optionsStore.createSnapshot(), job.languageId),
      )

      if (formatRequests.get(id) !== requestId) {
        return {
          status: 'superseded',
        }
      }

      const cost = window.performance.now() - formatStartTime

      patchJob(id, {
        resultCode: formattedCode,
        formatCost: cost,
        status: 'formatted',
      })
      historyStore.addEntry({
        fileName: job.fileName,
        languageId: job.languageId,
        sourceCode: job.sourceCode,
        resultCode: formattedCode,
        formatCost: cost,
      })
      logStore.addLog({
        type: 'success',
        message: i18n.t('formatSuccess'),
        fileName: job.fileName,
        languageId: job.languageId,
      })
      return {
        status: 'formatted',
      }
    } catch (error: unknown) {
      if (formatRequests.get(id) !== requestId) {
        return {
          status: 'superseded',
        }
      }

      const message = error instanceof Error ? error.message : 'Unknown error'

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
      return {
        status: 'error',
        message,
      }
    } finally {
      if (formatRequests.get(id) === requestId) {
        formatRequests.delete(id)
      }
    }
  }

  function restoreHistoryEntry(id: string) {
    const entry = historyStore.entries.find(item => item.id === id)

    if (!entry || (!entry.sourceCode && !entry.resultCode)) {
      return false
    }

    fileLoadRevision += 1
    workspaceRevision += 1
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

    return true
  }

  return {
    jobs,
    activeJobId,
    activeJob,
    hasMultipleJobs,
    canClearWorkspace,
    formattedJobs,

    languageId,
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
    restoreHistoryEntry,
  }
})
