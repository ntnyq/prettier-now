/**
 * Value that can either stay constant or change between color modes.
 */
export type ThemeableValue<T = string> =
  | T
  | {
      /**
       * Value used while dark mode is active.
       */
      dark: T

      /**
       * Value used while light mode is active.
       */
      light: T
    }
