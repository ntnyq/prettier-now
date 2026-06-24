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
 * Request sent from the content script to the extension formatter page.
 */
export interface FocusedEditorFormatterRequest {
  /**
   * Correlation id used to match the response to the request.
   */
  requestId: string

  /**
   * Source text to format.
   */
  source: string

  /**
   * Formatter request message type.
   */
  type: typeof import('@/constants/focusedEditor').FOCUSED_EDITOR_MESSAGE.formatterFormatRequest

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
 * Successful response from the extension formatter page.
 */
export interface FocusedEditorFormatterSuccessResponse {
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

  /**
   * Correlation id copied from the matching request.
   */
  requestId: string

  /**
   * Formatter response message type.
   */
  type: typeof import('@/constants/focusedEditor').FOCUSED_EDITOR_MESSAGE.formatterFormatResponse
}

/**
 * Failed response from the extension formatter page.
 */
export interface FocusedEditorFormatterErrorResponse {
  /**
   * Error message captured while formatting.
   */
  errorMessage: string

  /**
   * Discriminant indicating failed formatting.
   */
  ok: false

  /**
   * Correlation id copied from the matching request.
   */
  requestId: string

  /**
   * Formatter response message type.
   */
  type: typeof import('@/constants/focusedEditor').FOCUSED_EDITOR_MESSAGE.formatterFormatResponse
}

/**
 * Formatter response returned from the extension formatter page.
 */
export type FocusedEditorFormatterResponse =
  | FocusedEditorFormatterErrorResponse
  | FocusedEditorFormatterSuccessResponse
