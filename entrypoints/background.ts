/**
 * @file Background
 */

import { browser, defineBackground } from '#imports'
import { COMMANDS } from '@/constants/command'

const ContextMenuId = Object.freeze({
  openOptionsPage: 'open-options-page',
})

export default defineBackground({
  type: 'module',
  main() {
    browser.contextMenus.create({
      id: ContextMenuId.openOptionsPage,
      title: 'Open Options Page',
    })

    browser.contextMenus.onClicked.addListener(params => {
      if (params.menuItemId === ContextMenuId.openOptionsPage) {
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
