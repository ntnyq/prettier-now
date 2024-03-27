/**
 * @file Background
 */

import { COMMANDS } from '@/constants/command'

export default defineBackground({
  main() {
    browser.commands.onCommand.addListener(async command => {
      if (command !== COMMANDS.openOptionsPage) return
      browser.runtime.openOptionsPage()
    })
  },
})
