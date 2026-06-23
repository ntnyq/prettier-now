/**
 * RGB color channels.
 */
export interface RgbColor {
  /**
   * Blue channel from 0 to 255.
   */
  blue: number

  /**
   * Green channel from 0 to 255.
   */
  green: number

  /**
   * Red channel from 0 to 255.
   */
  red: number
}

/**
 * Default primary theme color stored for new users.
 */
export const DEFAULT_THEME_COLOR = '#242424'

const HEX_RGB_COLOR_RE = /^#?(?:[0-9a-f]{3}|[0-9a-f]{6})$/i
const THEME_COLOR_PROPERTIES = ['--primary', '--ring', '--sidebar-primary']
const THEME_COLOR_FOREGROUND_PROPERTIES = [
  '--primary-foreground',
  '--sidebar-primary-foreground',
]

/**
 * Clamp an RGB channel into the valid integer range.
 *
 * @param value - Raw channel value.
 * @returns Integer channel value between 0 and 255.
 */
function clampRgbChannel(value: number) {
  return Math.min(255, Math.max(0, Math.round(value)))
}

/**
 * Convert an RGB channel to a two-character hexadecimal string.
 *
 * @param value - Raw channel value.
 * @returns Two-character hexadecimal channel.
 */
function toHexChannel(value: number) {
  return clampRgbChannel(value).toString(16).padStart(2, '0')
}

/**
 * Check whether a string is an RGB hex color.
 *
 * @param value - Color string to validate.
 * @returns Whether the value is `#RGB`, `RGB`, `#RRGGBB`, or `RRGGBB`.
 */
export function isHexColor(value: string) {
  return HEX_RGB_COLOR_RE.test(value.trim())
}

/**
 * Normalize a user-provided hex color to `#RRGGBB`.
 *
 * @param value - Color string to normalize.
 * @param fallback - Color returned when value is invalid.
 * @returns Normalized hex color.
 */
export function normalizeHexColor(
  value: string,
  fallback = DEFAULT_THEME_COLOR,
) {
  const color = value.trim()

  if (!isHexColor(color)) {
    return fallback
  }

  const hex = color.replace('#', '').toLowerCase()

  if (hex.length === 3) {
    return `#${hex
      .split('')
      .map(channel => channel.repeat(2))
      .join('')}`
  }

  return `#${hex}`
}

/**
 * Convert a hex color to RGB channels.
 *
 * @param value - Hex color to convert.
 * @returns RGB channels parsed from the color.
 */
export function hexToRgb(value: string): RgbColor {
  const hex = normalizeHexColor(value).slice(1)

  return {
    red: Number.parseInt(hex.slice(0, 2), 16),
    green: Number.parseInt(hex.slice(2, 4), 16),
    blue: Number.parseInt(hex.slice(4, 6), 16),
  }
}

/**
 * Convert RGB channels to a normalized hex color.
 *
 * @param color - RGB channels to convert.
 * @returns Normalized `#RRGGBB` color.
 */
export function rgbToHex(color: RgbColor) {
  return `#${toHexChannel(color.red)}${toHexChannel(color.green)}${toHexChannel(color.blue)}`
}

/**
 * Convert a hex color to a CSS RGB color.
 *
 * @param value - Hex color to convert.
 * @returns CSS `rgb(r g b)` color.
 */
export function toRgbColor(value: string) {
  const { blue, green, red } = hexToRgb(value)

  return `rgb(${red} ${green} ${blue})`
}

/**
 * Pick a readable foreground color for a theme color.
 *
 * @param value - Theme color to evaluate.
 * @returns Dark or light foreground CSS color.
 */
export function getThemeForegroundColor(value: string) {
  const { blue, green, red } = hexToRgb(value)
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255

  return luminance > 0.6 ? 'rgb(24 24 27)' : 'rgb(255 255 255)'
}

/**
 * Apply theme color CSS variables to an element.
 *
 * @param value - Theme color to apply.
 * @param element - Element that receives CSS variable overrides.
 */
export function applyThemeColorVars(
  value: string,
  element = document.documentElement,
) {
  const color = toRgbColor(value)
  const foregroundColor = getThemeForegroundColor(value)

  for (const property of THEME_COLOR_PROPERTIES) {
    element.style.setProperty(property, color)
  }

  for (const property of THEME_COLOR_FOREGROUND_PROPERTIES) {
    element.style.setProperty(property, foregroundColor)
  }
}
