import type { LanguageId } from '@/types/language'

/**
 * Lifecycle state for a queued formatting job.
 */
export type FormatJobStatus = 'error' | 'formatted' | 'formatting' | 'pending'

/**
 * Outcome of formatting one job, including requests superseded by later edits.
 */
export type FormatJobResult =
  | {
      /**
       * Formatter diagnostic shown by the command caller.
       */
      message: string
      /**
       * Formatting failed for the current request.
       */
      status: 'error'
    }
  | {
      /**
       * Formatting completed, had no source, or was superseded by a newer edit.
       */
      status: 'empty' | 'formatted' | 'superseded'
    }

/**
 * Outcome of importing and formatting a file collection.
 */
export type FileImportResult =
  | {
      /**
       * File read diagnostic shown by the command caller.
       */
      message: string
      /**
       * Reading a file failed without replacing the existing workspace.
       */
      status: 'error'
    }
  | {
      /**
       * No files were supplied, supported or retained by this request.
       */
      status: 'empty' | 'superseded' | 'unsupported'
    }
  | {
      /**
       * Outcomes used by the caller to log individual formatting attempts.
       */
      results: FormatJobResult[]
      /**
       * Supported files were loaded and their formatting attempts finished.
       */
      status: 'imported'
      /**
       * Number of successful formatting attempts.
       */
      successCount: number
      /**
       * Number of imported jobs.
       */
      totalCount: number
    }

/**
 * One file or source buffer queued for formatting.
 */
export interface FormatJob {
  /**
   * Error message captured when formatting fails.
   */
  errorMessage: string

  /**
   * Source file name shown in the workspace.
   */
  fileName: string

  /**
   * Formatting duration in milliseconds.
   */
  formatCost: number

  /**
   * Stable job identifier.
   */
  id: string

  /**
   * Language identifier selected for formatting.
   */
  languageId: LanguageId

  /**
   * Formatted output code.
   */
  resultCode: string

  /**
   * Original source code.
   */
  sourceCode: string

  /**
   * Current formatting status.
   */
  status: FormatJobStatus
}
