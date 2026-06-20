/**
 * Define a Language
 */
export interface Language {
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
