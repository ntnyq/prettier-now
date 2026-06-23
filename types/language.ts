import type { ThemeableValue } from '@/types'

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
  id: string

  /**
   * Human-readable language name.
   */
  name: string

  /**
   * Prettier parser name when it differs from the language id.
   */
  parser?: string
}
