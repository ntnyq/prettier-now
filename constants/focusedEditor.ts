/**
 * @file Focused editor formatting protocol
 */

export const FOCUSED_EDITOR_EVENT = Object.freeze({
  getValueRequest: 'prettier-now:focused-editor:get-value-request',
  getValueResponse: 'prettier-now:focused-editor:get-value-response',
  setValueRequest: 'prettier-now:focused-editor:set-value-request',
  setValueResponse: 'prettier-now:focused-editor:set-value-response',
})

export const FOCUSED_EDITOR_MESSAGE = Object.freeze({
  formatFocusedEditor: 'prettier-now:format-focused-editor',
  formatSource: 'prettier-now:format-source',
})

export const FOCUSED_EDITOR_REQUEST_TIMEOUT = 1000
