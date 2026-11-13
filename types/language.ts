import type { LANGUAGE_ID } from '@/constants/language'
import type { ThemeableValue } from '@/types'

/**
 * Identifier accepted by the supported formatter languages.
 */
export type LanguageId = (typeof LANGUAGE_ID)[keyof typeof LANGUAGE_ID]

/**
 * Supported formatting language definition.
 */
export interface Language {
  /**
   * Icon name or theme-aware icon names for the language.
   */
  icon: ThemeableValue<string>

  /**
   * Unique language identifier used by options and stores.
   */
  id: LanguageId

  /**
   * Human-readable language name.
   */
  name: string

  /**
   * Prettier parser name when it differs from the language id.
   */
  parser?: string
}
