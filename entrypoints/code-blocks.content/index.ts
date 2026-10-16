import overlayCss from './style.css?inline'
import * as v from 'valibot'
import { i18n } from '#i18n'
import { browser, createShadowRootUi, defineContentScript } from '#imports'
import { createCodeBlockController } from '@/utils/codeBlocks/controller'
import { mountCodeBlockOverlay } from '@/utils/codeBlocks/overlay'
import {
  codeBlockFailure,
  CodeBlockMessageSchema,
} from '@/utils/codeBlocks/protocol'
import { readCodeBlockSettings } from '@/utils/codeBlocks/settings'
import { createCodeBlockSubmission } from '@/utils/codeBlocks/submission'
import type { ExtractedCodeBlock } from '@/types/codeBlocks'

export default defineContentScript({
  matches: ['http://*/*', 'https://*/*', 'file:///*'],
  allFrames: false,
  cssInjectionMode: 'manual',
  async main(ctx) {
    if (window.top !== window) {
      return
    }
    let overlay: ReturnType<typeof mountCodeBlockOverlay> | undefined
    let ui: Awaited<ReturnType<typeof createShadowRootUi>> | undefined
    let enabled = false
    let settingsRevision = 0
    let disposed = false
    let mounting = false
    const buttonRequests = new Map<string, string>()
    const controller = createCodeBlockController(() => {
      syncOverlay()
    })

    async function enqueue(
      requestId: string,
      items: ExtractedCodeBlock[],
      mode: 'popup' | 'button',
    ) {
      const response = await browser.runtime.sendMessage({
        type: 'code-blocks/enqueue',
        version: 1,
        requestId,
        items,
        mode,
      })
      if (!response?.ok) {
        throw new Error(response?.error ?? 'STORAGE_UNAVAILABLE')
      }
      return response
    }

    const submission = createCodeBlockSubmission(controller, enqueue)

    async function sendButton(blockId: string) {
      const requestId = buttonRequests.get(blockId) ?? crypto.randomUUID()
      buttonRequests.set(blockId, requestId)
      try {
        const result = await submission.submit(
          requestId,
          [blockId],
          controller.revision,
          'button',
        )
        if (result.error) {
          return i18n.t(`codeBlocksErrors.${result.error}`)
        }
        if (!result.sentCount && !result.queued) {
          const failure = result.results?.find(
            (item: { error?: string }) => item.error,
          )
          if (failure) {
            throw new Error(failure.error)
          }
        }
        buttonRequests.delete(blockId)
        return i18n.t(result.queued ? 'codeBlocksQueued' : 'codeBlocksImported')
      } catch (error) {
        const failure = codeBlockFailure(error).error
        if (failure === 'REQUEST_EXPIRED' || failure === 'BLOCK_STALE') {
          buttonRequests.delete(blockId)
        }
        return i18n.t(`codeBlocksErrors.${failure}`)
      }
    }

    async function syncOverlay() {
      if (!enabled || disposed) {
        return
      }
      if (!controller.candidates.size) {
        overlay?.dispose()
        overlay = undefined
        ui?.remove()
        ui = undefined
        return
      }
      if (!ui && !mounting) {
        mounting = true
        try {
          const created = await createShadowRootUi(ctx, {
            name: 'prettier-now-code-blocks',
            css: overlayCss,
            position: 'inline',
            anchor: 'body',
            isolateEvents: ['click', 'keydown', 'keyup'],
            onMount(container) {
              overlay = mountCodeBlockOverlay(container, controller, sendButton)
            },
            onRemove() {
              overlay?.dispose()
              overlay = undefined
            },
          })
          if (!enabled || disposed) {
            return
          }
          ui = created
          ui.mount()
        } finally {
          mounting = false
        }
      }
      overlay?.sync()
    }

    async function applySettings() {
      const revision = ++settingsRevision
      try {
        const settings = await readCodeBlockSettings()
        if (revision !== settingsRevision || disposed) {
          return
        }
        enabled =
          settings.codeBlockButtons
          && !settings.codeBlockHiddenHosts.includes(location.hostname)
          && !browser.extension.inIncognitoContext
        if (enabled) {
          controller.start()
        } else {
          controller.stop()
          overlay?.dispose()
          overlay = undefined
          ui?.remove()
          ui = undefined
        }
      } catch {
        enabled = false
        controller.stop()
        ui?.remove()
        ui = undefined
        // The popup exposes settings-read errors and a retry action.
      }
    }

    const listener: Parameters<
      typeof browser.runtime.onMessage.addListener
    >[0] = (input, sender, sendResponse) => {
      if (
        !input
        || !['code-blocks/scan', 'code-blocks/submit'].includes(input.type)
      ) {
        return undefined
      }
      const parsed = v.safeParse(CodeBlockMessageSchema, input)
      if (
        !parsed.success
        || sender.id !== browser.runtime.id
        || sender.url !== browser.runtime.getURL('/popup.html')
      ) {
        sendResponse(codeBlockFailure('INVALID_MESSAGE'))
        return undefined
      }
      const message = parsed.output
      const run = async () => {
        if (browser.extension.inIncognitoContext) {
          throw new Error('PRIVATE_WINDOW_UNSUPPORTED')
        }
        if (message.type === 'code-blocks/scan') {
          return {
            ok: true,
            ...(await controller.scan()),
            hostname: location.hostname,
          }
        }
        if (message.type === 'code-blocks/submit') {
          return submission.submit(
            message.requestId,
            message.blockIds,
            message.documentRevision,
            'popup',
          )
        }
        throw new Error('INVALID_MESSAGE')
      }
      run().catch(codeBlockFailure).then(sendResponse)
      return true
    }
    const settingsListener: Parameters<
      typeof browser.storage.onChanged.addListener
    >[0] = (changes, area) => {
      if (
        area === 'local'
        && ('codeBlockButtons' in changes || 'codeBlockHiddenHosts' in changes)
      ) {
        applySettings()
      }
    }
    browser.runtime.onMessage.addListener(listener)
    browser.storage.onChanged.addListener(settingsListener)
    ctx.addEventListener(window, 'wxt:locationchange', () => {
      controller.navigate()
      buttonRequests.clear()
      applySettings()
    })
    function dispose() {
      disposed = true
      controller.dispose()
      ui?.remove()
      submission.dispose()
      buttonRequests.clear()
      browser.runtime.onMessage.removeListener(listener)
      browser.storage.onChanged.removeListener(settingsListener)
    }
    ctx.onInvalidated(dispose)
    ctx.addEventListener(window, 'pagehide', event => {
      if (!event.persisted) {
        dispose()
        return
      }
      enabled = false
      settingsRevision += 1
      controller.stop()
      ui?.remove()
      ui = undefined
    })
    ctx.addEventListener(window, 'pageshow', event => {
      if (event.persisted && !disposed) {
        controller.navigate()
        applySettings()
      }
    })
    await applySettings()
  },
})
