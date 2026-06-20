import { languageExtensions } from '@/constants/language'
import type { FormatJob } from '@/types/workspace'

function createJobId(fileName: string, index: number) {
  return `${fileName}-${index}-${crypto.randomUUID()}`
}

export function getLanguageIdForFileName(fileName: string) {
  const fileExt = fileName.split('.').pop()?.toLowerCase()

  if (!fileExt) {
    return
  }

  return languageExtensions[fileExt as keyof typeof languageExtensions]
}

export async function createFormatJobFromFile(file: File, index: number) {
  const languageId = getLanguageIdForFileName(file.name)

  if (!languageId) {
    return
  }

  const sourceCode = await file.text()

  if (!sourceCode.trim().length) {
    return
  }

  return {
    id: createJobId(file.name, index),
    fileName: file.name,
    languageId,
    sourceCode,
    resultCode: '',
    status: 'pending',
    errorMessage: '',
    formatCost: 0,
  } satisfies FormatJob
}

export async function createFormatJobsFromFiles(files: Iterable<File>) {
  const jobs: FormatJob[] = []

  for (const [index, file] of [...files].entries()) {
    const job = await createFormatJobFromFile(file, index)

    if (job) {
      jobs.push(job)
    }
  }

  return jobs
}

export function getFormattedFileName(fileName: string) {
  const extensionIndex = fileName.lastIndexOf('.')

  if (extensionIndex <= 0) {
    return `${fileName}.formatted`
  }

  return `${fileName.slice(0, extensionIndex)}.formatted${fileName.slice(extensionIndex)}`
}

export function updateFormatJobLanguage(job: FormatJob, languageId: string) {
  return {
    ...job,
    languageId,
    resultCode: '',
    status: 'pending',
    errorMessage: '',
    formatCost: 0,
  } satisfies FormatJob
}

export function downloadTextFile(fileName: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = fileName
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url))
}
