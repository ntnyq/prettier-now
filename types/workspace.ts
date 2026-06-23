/**
 * Lifecycle state for a queued formatting job.
 */
export type FormatJobStatus = 'error' | 'formatted' | 'formatting' | 'pending'

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
  languageId: string

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
