/**
 * @file Background
 */

import { browser, defineBackground } from '#imports'
import { COMMANDS } from '@/constants/command'
import { CONTEXT_MENU_ID } from '@/constants/meta'

export default defineBackground({
  type: 'module',
  main() {
    browser.contextMenus.create({
      id: CONTEXT_MENU_ID.openOptionsPage,
      title: 'Open Options Page',
    })

    browser.contextMenus.onClicked.addListener(params => {
      if (params.menuItemId === CONTEXT_MENU_ID.openOptionsPage) {
        browser.runtime.openOptionsPage()
      }
    })

    browser.commands.onCommand.addListener(async command => {
      if (command !== COMMANDS.openOptionsPage) {
        return
      }
      browser.runtime.openOptionsPage()
    })

    browser.runtime.onInstalled.addListener(() => {
      if (import.meta.env.COMMAND === 'serve') {
        browser.runtime.openOptionsPage()
      }
    })
  },
})
