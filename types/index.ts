/**
 * Themeable value
 */
export type ThemeableValue<T = string> =
  | T
  | {
      dark: T
      light: T
    }
