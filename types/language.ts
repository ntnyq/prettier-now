import type { ThemeableValue } from '@/types'

/**
 * Define a Language
 */
export interface Language {
  /**
   * language icon
   */
  icon: ThemeableValue<string>

  /**
   * language id, unique
   */
  id: string

  /**
   * language name
   */
  name: string

  /**
   * language parser, provided by prettier plugin, mostly same as language id
   */
  parser?: string
}
