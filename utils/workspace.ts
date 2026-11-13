import { languageExtensions } from '@/constants/language'
import type { LanguageId } from '@/types/language'
import type { FormatJob } from '@/types/workspace'

/**
 * Create a unique format job id.
 *
 * @param fileName - Source file name.
 * @param index - File index in the selected file list.
 * @returns Unique format job id.
 */
function createJobId(fileName: string, index: number) {
  return `${fileName}-${index}-${crypto.randomUUID()}`
}

/**
 * Resolve the language id for a file name.
 *
 * @param fileName - File name to inspect.
 * @returns Matching language id when supported.
 */
export function getLanguageIdForFileName(fileName: string) {
  const fileExt = fileName.split('.').pop()?.toLowerCase()

  if (!fileExt) {
    return
  }

  return Object.hasOwn(languageExtensions, fileExt)
    ? languageExtensions[fileExt as keyof typeof languageExtensions]
    : undefined
}

/**
 * Create a format job from a file.
 *
 * @param file - File to read.
 * @param index - File index in the selected file list.
 * @returns Format job when the file is supported and non-empty.
 */
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

/**
 * Create format jobs from a file collection.
 *
 * @param files - Files selected by the user.
 * @returns Format jobs for supported non-empty files.
 */
export async function createFormatJobsFromFiles(
  files: Iterable<File> | ArrayLike<File>,
) {
  const jobs: FormatJob[] = []

  for (const [index, file] of Array.from(files).entries()) {
    const job = await createFormatJobFromFile(file, index)

    if (job) {
      jobs.push(job)
    }
  }

  return jobs
}

/**
 * Create the default output file name for a formatted file.
 *
 * @param fileName - Original file name.
 * @returns File name with `.formatted` inserted before the extension.
 */
export function getFormattedFileName(fileName: string) {
  const extensionIndex = fileName.lastIndexOf('.')

  if (extensionIndex <= 0) {
    return `${fileName}.formatted`
  }

  return `${fileName.slice(0, extensionIndex)}.formatted${fileName.slice(extensionIndex)}`
}

/**
 * Update a format job after the user changes its language.
 *
 * @param job - Existing format job.
 * @param languageId - New language id.
 * @returns Reset format job with the selected language.
 */
export function updateFormatJobLanguage(
  job: FormatJob,
  languageId: LanguageId,
) {
  return {
    ...job,
    languageId,
    resultCode: '',
    status: 'pending',
    errorMessage: '',
    formatCost: 0,
  } satisfies FormatJob
}
