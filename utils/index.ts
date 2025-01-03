/**
 * @file Utils
 */

/**
 * Wait for a given amount of time
 * @param ms - Time to wait in milliseconds
 * @returns Promise that resolves after the given time
 */
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Open an external URL in new tab
 * @param url - URL to open
 */
export function openExternalURL(url: string) {
  window.open(url, '_blank')
}
