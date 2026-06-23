/**
 * @file Utils
 */

/**
 * Open an external URL in a new tab.
 *
 * @param url - URL to open.
 */
export function openExternalURL(url: string) {
  const externalWindow = window.open(url, '_blank', 'noopener,noreferrer')
  if (externalWindow) {
    externalWindow.opener = null
  }
}
