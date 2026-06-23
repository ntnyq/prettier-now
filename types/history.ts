import type { JsonObject } from '@/types/json'

/**
 * Persisted record for one successful formatting action.
 */
export interface FormatHistoryEntry extends JsonObject {
  /**
   * Name of the formatted source file.
   */
  fileName: string

  /**
   * Formatting duration in milliseconds.
   */
  formatCost: number

  /**
   * Unix timestamp for when formatting completed.
   */
  formattedAt: number

  /**
   * Stable history entry identifier.
   */
  id: string

  /**
   * Language identifier used to format the source.
   */
  languageId: string

  /**
   * Formatted output code.
   */
  resultCode: string

  /**
   * Original source code before formatting.
   */
  sourceCode: string
}
