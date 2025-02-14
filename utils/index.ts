/**
 * @file Utils
 */

/**
 * Open an external URL in new tab
 * @param url - URL to open
 */
export function openExternalURL(url: string) {
  window.open(url, '_blank')
}
