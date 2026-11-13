import type { JsonObject } from '@/types/json'
import type { LanguageId } from '@/types/language'

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
  languageId: LanguageId

  /**
   * Formatted output code.
   */
  resultCode: string

  /**
   * Original source code before formatting.
   */
  sourceCode: string
}
