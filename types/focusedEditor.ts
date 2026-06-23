/**
 * @file Focused editor formatting types
 */

/**
 * Detail payload requesting the active editor content.
 */
export interface FocusedEditorGetValueRequestDetail {
  /**
   * Correlation id used to match the response to the request.
   */
  requestId: string
}

/**
 * Detail payload returned after reading the active editor content.
 */
export interface FocusedEditorGetValueResponseDetail {
  /**
   * Correlation id copied from the matching request.
   */
  requestId: string

  /**
   * Error message captured when the editor content could not be read.
   */
  errorMessage?: string

  /**
   * Language or editor hints collected from the focused element.
   */
  hints?: string[]

  /**
   * Source text read from the focused editor.
   */
  source?: string
}

/**
 * Detail payload requesting replacement of the active editor content.
 */
export interface FocusedEditorSetValueRequestDetail {
  /**
   * Correlation id used to match the response to the request.
   */
  requestId: string

  /**
   * New source text written into the focused editor.
   */
  value: string
}

/**
 * Detail payload returned after attempting to replace editor content.
 */
export interface FocusedEditorSetValueResponseDetail {
  /**
   * Correlation id copied from the matching request.
   */
  requestId: string

  /**
   * Error message captured when the editor content could not be replaced.
   */
  errorMessage?: string
}

/**
 * Request sent to the background formatter for focused editor source.
 */
export interface FormatSourceRequest {
  /**
   * Source text to format.
   */
  source: string

  /**
   * Focused editor message type for formatting source.
   */
  type: typeof import('@/constants/focusedEditor').FOCUSED_EDITOR_MESSAGE.formatSource

  /**
   * Language id used when the source language cannot be inferred.
   */
  fallbackLanguageId?: string

  /**
   * Language or editor hints used to infer the source language.
   */
  hints?: string[]

  /**
   * Page URL used as an additional language inference hint.
   */
  url?: string
}

/**
 * Successful response from focused editor source formatting.
 */
export interface FormatSourceSuccessResponse {
  /**
   * Formatted source text.
   */
  formatted: string

  /**
   * Language id selected for formatting.
   */
  languageId: string

  /**
   * Discriminant indicating successful formatting.
   */
  ok: true
}

/**
 * Failed response from focused editor source formatting.
 */
export interface FormatSourceErrorResponse {
  /**
   * Error message captured while formatting.
   */
  errorMessage: string

  /**
   * Discriminant indicating failed formatting.
   */
  ok: false
}

/**
 * Formatter response for focused editor source.
 */
export type FormatSourceResponse =
  | FormatSourceErrorResponse
  | FormatSourceSuccessResponse
