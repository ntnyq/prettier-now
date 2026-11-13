/**
 * Finite core Prettier option values in display order.
 */
export const PRETTIER_OPTION_VALUES = {
  /**
   * Supported arrowParens values.
   */
  arrowParens: ['always', 'avoid'],
  /**
   * Supported embeddedLanguageFormatting values.
   */
  embeddedLanguageFormatting: ['auto', 'off'],
  /**
   * Supported endOfLine values.
   */
  endOfLine: ['lf', 'crlf', 'cr', 'auto'],
  /**
   * Supported experimentalOperatorPosition values.
   */
  experimentalOperatorPosition: ['start', 'end'],
  /**
   * Supported htmlWhitespaceSensitivity values.
   */
  htmlWhitespaceSensitivity: ['css', 'strict', 'ignore'],
  /**
   * Supported objectWrap values.
   */
  objectWrap: ['preserve', 'collapse'],
  /**
   * Supported proseWrap values.
   */
  proseWrap: ['preserve', 'always', 'never'],
  /**
   * Supported quoteProps values.
   */
  quoteProps: ['as-needed', 'consistent', 'preserve'],
  /**
   * Supported trailingComma values.
   */
  trailingComma: ['all', 'es5', 'none'],
} as const

/**
 * Supported target PHP versions in display order.
 */
export const PHP_VERSIONS = [
  '5.0',
  '5.1',
  '5.2',
  '5.3',
  '5.4',
  '5.5',
  '5.6',
  '7.0',
  '7.1',
  '7.2',
  '7.3',
  '7.4',
  '8.0',
  '8.1',
  '8.2',
] as const

/**
 * Supported Svelte section orders in display order.
 */
export const SVELTE_SORT_ORDERS = [
  'options-scripts-markup-styles',
  'options-scripts-styles-markup',
  'options-markup-styles-scripts',
  'options-markup-scripts-styles',
  'options-styles-markup-scripts',
  'options-styles-scripts-markup',
  'scripts-options-markup-styles',
  'scripts-options-styles-markup',
  'markup-options-styles-scripts',
  'markup-options-scripts-styles',
  'styles-options-markup-scripts',
  'styles-options-scripts-markup',
  'scripts-markup-options-styles',
  'scripts-styles-options-markup',
  'markup-styles-options-scripts',
  'markup-scripts-options-styles',
  'styles-markup-options-scripts',
  'styles-scripts-options-markup',
  'scripts-markup-styles-options',
  'scripts-styles-markup-options',
  'markup-styles-scripts-options',
  'markup-scripts-styles-options',
  'styles-markup-scripts-options',
  'styles-scripts-markup-options',
  'none',
] as const

/**
 * Finite XML plugin option values in display order.
 */
export const XML_OPTION_VALUES = {
  /**
   * Attribute quote styles.
   */
  xmlQuoteAttributes: ['preserve', 'double', 'single'],
  /**
   * Whitespace preservation modes.
   */
  xmlWhitespaceSensitivity: ['strict', 'ignore', 'preserve'],
} as const

/**
 * Supported PHP brace styles in display order.
 */
export const PHP_BRACE_STYLES = ['per-cs', '1tbs'] as const

/**
 * Finite TOML plugin option values shared by validation and settings controls.
 */
export const TOML_OPTION_VALUES = {
  /**
   * Comment normalization modes.
   */
  commentStyle: ['normalize', 'preserve'],
  /**
   * Date/time separator styles.
   */
  dateTimeDelimiter: ['T', 'space', 'preserve'],
  /**
   * String and key quote styles.
   */
  quoteStyle: ['double', 'single', 'preserve'],
  /**
   * Supported TOML syntax versions.
   */
  tomlVersion: ['v1.0.0', 'v1.1.0', 'v1.1.0-preview'],
} as const
