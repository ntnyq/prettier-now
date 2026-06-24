/**
 * @file Background
 */

import { i18n } from '#i18n'
import { browser, defineBackground } from '#imports'
import { COMMANDS } from '@/constants/command'
import { FOCUSED_EDITOR_MESSAGE } from '@/constants/focusedEditor'
import { CONTEXT_MENU_ID } from '@/constants/meta'

type BackgroundMessageKey = 'formatFocusedEditor' | 'openOptionsPage'
type BackgroundMessageTranslator = (key: BackgroundMessageKey) => string

/**
 * Register extension context menus from a clean slate.
 *
 * @param t - Message translator.
 */
export async function registerContextMenus(
  t: BackgroundMessageTranslator,
): Promise<void> {
  await browser.contextMenus.removeAll()

  browser.contextMenus.create({
    id: CONTEXT_MENU_ID.openOptionsPage,
    title: t('openOptionsPage'),
  })

  browser.contextMenus.create({
    contexts: ['editable'],
    id: CONTEXT_MENU_ID.formatFocusedEditor,
    title: t('formatFocusedEditor'),
  })
}

export default defineBackground({
  type: 'module',
  main() {
    async function formatFocusedTab(tabId?: number) {
      if (!tabId) {
        return
      }

      await browser.tabs.sendMessage(tabId, {
        type: FOCUSED_EDITOR_MESSAGE.formatFocusedEditor,
      })
    }

    async function formatActiveTab() {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      })

      await formatFocusedTab(tab?.id)
    }

    registerContextMenus(key => i18n.t(key)).catch((err: unknown) => {
      const message = (err as Error)?.message || 'Failed to register menus'
      console.error(message)
    })

    browser.contextMenus.onClicked.addListener(async (params, tab) => {
      if (params.menuItemId === CONTEXT_MENU_ID.formatFocusedEditor) {
        await formatFocusedTab(tab?.id)
        return
      }

      if (params.menuItemId === CONTEXT_MENU_ID.openOptionsPage) {
        browser.runtime.openOptionsPage()
      }
    })

    browser.commands.onCommand.addListener(async command => {
      if (command === COMMANDS.formatFocusedEditor) {
        await formatActiveTab()
      }

      if (command === COMMANDS.openOptionsPage) {
        await browser.runtime.openOptionsPage()
      }
    })

    browser.runtime.onInstalled.addListener(() => {
      if (import.meta.env.COMMAND === 'serve') {
        browser.runtime.openOptionsPage()
      }
    })
  },
})
