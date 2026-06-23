/**
 * @file Extension commands
 */

export const COMMANDS = Object.freeze({
  formatFocusedEditor: 'formatFocusedEditor',
  openOptionsPage: 'openOptionsPage',
})
export type Command = keyof typeof COMMANDS
