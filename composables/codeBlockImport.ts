import * as v from 'valibot'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { browser } from '#imports'
import { useWorkspaceStore } from '@/stores/workspace'
import {
  codeBlockFailure,
  CodeBlockIdSchema,
  CodeBlockMessageSchema,
  CodeBlockRequestSchema,
} from '@/utils/codeBlocks/protocol'
import type {
  CodeBlockImportRequest,
  ExtractedCodeBlock,
} from '@/types/codeBlocks'
import type { CodeBlockError } from '@/utils/codeBlocks/protocol'

/**
 * One unconsumed item awaiting a supported language selection.
 */
export interface PendingCodeBlock {
  /**
   * Composite identity across requests.
   */
  key: string
  /**
   * Parent request with source and expiry information.
   */
  request: CodeBlockImportRequest
  /**
   * Original immutable snapshot.
   */
  item: ExtractedCodeBlock
}

/**
 * Receive dedicated-workspace imports and retain local ACK decisions for retries.
 */
export function useCodeBlockImport() {
  const workspaceStore = useWorkspaceStore()
  const pendingItems = ref<PendingCodeBlock[]>([])
  const error = ref<CodeBlockError>()
  const isBusy = ref(false)
  const workspaceId = new URL(location.href).searchParams.get('workspace')
  const decisions = new Map<string, 'imported' | 'discarded'>()
  let tabId: number | undefined
  let disposed = false
  let polling: ReturnType<typeof setInterval> | undefined
  let pulling: Promise<void> | undefined
  let pullAgain = false

  async function send(
    type: 'register' | 'list' | 'read' | 'ack',
    extra: Record<string, unknown> = {},
  ) {
    const result = await browser.runtime.sendMessage({
      type: `code-blocks/${type}`,
      version: 1,
      workspaceId,
      tabId,
      ...extra,
    })
    if (!result?.ok) {
      throw new Error(result?.error ?? 'STORAGE_UNAVAILABLE')
    }
    return result
  }

  async function acknowledge(request: CodeBlockImportRequest) {
    const results = request.items.flatMap(item => {
      const status = decisions.get(`${request.requestId}/${item.id}`)
      return status ? [{ itemId: item.id, status }] : []
    })
    if (results.length) {
      await send('ack', { requestId: request.requestId, results })
    }
    // Retain decisions: a delayed read must not resurrect removed jobs.
  }

  async function pull() {
    if (!workspaceId || disposed || tabId === undefined) {
      return
    }
    if (pulling) {
      pullAgain = true
      return pulling
    }
    pulling = (async () => {
      try {
        const response = await send('register')
        const ids = v.parse(
          v.pipe(v.array(CodeBlockIdSchema), v.maxLength(20)),
          response.requestIds,
        )
        const next: PendingCodeBlock[] = []
        for (const requestId of ids) {
          const response = await send('read', { requestId })
          const request = v.parse(CodeBlockRequestSchema, response.request)
          if (disposed) {
            return
          }
          if (
            request.workspaceId !== workspaceId
            || request.expiresAt <= Date.now()
          ) {
            throw new Error('REQUEST_EXPIRED')
          }
          const confirmed = request.items.filter(
            item =>
              !decisions.has(`${requestId}/${item.id}`)
              && item.language.status === 'supported'
              && !item.language.requiresConfirmation,
          )
          workspaceStore.appendExtractedJobs(
            confirmed.map(item => ({
              requestId,
              item,
              languageId: item.language.languageId!,
              source: request.source,
            })),
          )
          for (const item of confirmed) {
            decisions.set(`${requestId}/${item.id}`, 'imported')
          }
          for (const item of request.items) {
            const key = `${requestId}/${item.id}`
            if (!decisions.has(key)) {
              next.push({ key, request, item })
            }
          }
          pendingItems.value = [
            ...pendingItems.value.filter(
              entry => entry.request.requestId !== requestId,
            ),
            ...next.filter(entry => entry.request.requestId === requestId),
          ]
          await acknowledge(request)
        }
        if (!disposed) {
          pendingItems.value = next.filter(entry => !decisions.has(entry.key))
        }
        error.value = undefined
      } catch (error_) {
        if (!disposed) {
          error.value = codeBlockFailure(error_).error
        }
      }
    })().finally(() => {
      pulling = undefined
      if (pullAgain && !disposed) {
        pullAgain = false
        pull()
      }
    })
    return pulling
  }

  async function resolve(key: string, languageId?: string) {
    const entry = pendingItems.value.find(item => item.key === key)
    if (!entry || isBusy.value) {
      return
    }
    if (entry.request.expiresAt <= Date.now()) {
      error.value = 'REQUEST_EXPIRED'
      pendingItems.value = pendingItems.value.filter(item => item.key !== key)
      return
    }
    isBusy.value = true
    try {
      if (languageId) {
        workspaceStore.appendExtractedJobs([
          {
            requestId: entry.request.requestId,
            source: entry.request.source,
            item: entry.item,
            languageId,
          },
        ])
      }
      decisions.set(key, languageId ? 'imported' : 'discarded')
      pendingItems.value = pendingItems.value.filter(item => item.key !== key)
      await acknowledge(entry.request)
    } catch (error_) {
      error.value = codeBlockFailure(error_).error
    } finally {
      isBusy.value = false
    }
  }

  const handleMessage: Parameters<
    typeof browser.runtime.onMessage.addListener
  >[0] = (message: unknown, sender, sendResponse) => {
    const parsed = v.safeParse(CodeBlockMessageSchema, message)
    if (
      parsed.success
      && parsed.output.type === 'code-blocks/ping'
      && parsed.output.workspaceId === workspaceId
      && parsed.output.tabId === tabId
      && sender.id === browser.runtime.id
      && !disposed
    ) {
      sendResponse({ nonce: parsed.output.nonce })
      return undefined
    }
    if (
      parsed.success
      && parsed.output.type === 'code-blocks/available'
      && parsed.output.workspaceId === workspaceId
    ) {
      pull()
    }
    return undefined
  }

  function refresh() {
    if (document.visibilityState === 'visible') {
      pull()
    }
  }

  onMounted(async () => {
    if (!v.safeParse(CodeBlockIdSchema, workspaceId).success) {
      return
    }
    browser.runtime.onMessage.addListener(handleMessage)
    document.addEventListener('visibilitychange', refresh)
    polling = setInterval(() => {
      const unexpired = pendingItems.value.filter(
        entry => entry.request.expiresAt > Date.now(),
      )
      if (unexpired.length !== pendingItems.value.length) {
        pendingItems.value = unexpired
        error.value = 'REQUEST_EXPIRED'
      }
      refresh()
    }, 15000)
    try {
      const tab = await browser.tabs.getCurrent()
      if (disposed) {
        return
      }
      if (tab?.incognito) {
        throw new Error('PRIVATE_WINDOW_UNSUPPORTED')
      }
      tabId = tab?.id
      if (tabId === undefined) {
        throw new Error('PAGE_UNAVAILABLE')
      }
      await pull()
    } catch (error_) {
      error.value = codeBlockFailure(error_).error
    }
  })

  onBeforeUnmount(() => {
    disposed = true
    clearInterval(polling)
    browser.runtime.onMessage.removeListener(handleMessage)
    document.removeEventListener('visibilitychange', refresh)
  })

  return { pendingItems, error, isBusy, resolve, retry: pull }
}
