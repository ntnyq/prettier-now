/**
 * @file Background
 */

import { i18n } from '#i18n'
import { browser, defineBackground } from '#imports'
import { COMMANDS } from '@/constants/command'
import { FOCUSED_EDITOR_MESSAGE } from '@/constants/focusedEditor'
import { CONTEXT_MENU_ID } from '@/constants/meta'
import { formatViaPrettier } from '@/utils/format'
import { readStoredFormatOptions } from '@/utils/formatOptions'
import {
  inferLanguageFromEditorContext,
  resolveLanguageParser,
} from '@/utils/languageInference'
import type {
  FormatSourceRequest,
  FormatSourceResponse,
} from '@/types/focusedEditor'

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

    browser.contextMenus.create({
      id: CONTEXT_MENU_ID.openOptionsPage,
      title: i18n.t('openOptionsPage'),
    })

    browser.contextMenus.create({
      contexts: ['editable'],
      id: CONTEXT_MENU_ID.formatFocusedEditor,
      title: i18n.t('formatFocusedEditor'),
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

    browser.runtime.onMessage.addListener(
      async (
        message: FormatSourceRequest,
      ): Promise<FormatSourceResponse | undefined> => {
        if (message.type !== FOCUSED_EDITOR_MESSAGE.formatSource) {
          return
        }

        try {
          const languageId = inferLanguageFromEditorContext({
            fallbackLanguageId: message.fallbackLanguageId,
            hints: message.hints,
            source: message.source,
            url: message.url,
          })
          const parser = resolveLanguageParser(languageId)
          const options = await readStoredFormatOptions(languageId, parser)
          const formatted = await formatViaPrettier(message.source, options)

          return {
            formatted,
            languageId,
            ok: true,
          }
        } catch (err: unknown) {
          return {
            errorMessage: (err as Error)?.message || 'Failed to format editor',
            ok: false,
          }
        }
      },
    )

    browser.runtime.onInstalled.addListener(() => {
      if (import.meta.env.COMMAND === 'serve') {
        browser.runtime.openOptionsPage()
      }
    })
  },
})
