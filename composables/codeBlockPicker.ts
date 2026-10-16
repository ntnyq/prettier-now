import * as v from 'valibot'
import { ref, shallowRef } from 'vue'
import { browser } from '#imports'
import {
  codeBlockFailure,
  CodeBlockScanSchema,
  CodeBlockSubmissionSchema,
} from '@/utils/codeBlocks/protocol'
import type { CodeBlockError } from '@/utils/codeBlocks/protocol'

/**
 * Popup owns summaries and selection only; the content script owns snapshot submission.
 */
export function useCodeBlockPicker() {
  const scanResult = shallowRef<v.InferOutput<typeof CodeBlockScanSchema>>()
  const selectedIds = ref<string[]>([])
  const isBusy = ref(false)
  const hasRetry = ref(false)
  const error = ref<CodeBlockError>()
  const resultCounts = ref<{ sent: number; failed: number }>()
  const hostname = ref('')
  const itemErrors = ref<{ blockId: string; error: CodeBlockError }[]>([])
  let tabId: number | undefined
  let retry:
    | { requestId: string; blockIds: string[]; documentRevision: string }
    | undefined

  async function scan() {
    isBusy.value = true
    error.value = undefined
    resultCounts.value = undefined
    selectedIds.value = []
    itemErrors.value = []
    scanResult.value = undefined
    retry = undefined
    hasRetry.value = false
    try {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      })
      if (tab?.incognito) {
        throw new Error('PRIVATE_WINDOW_UNSUPPORTED')
      }
      if (
        tab?.id === undefined
        || (tab.url && !/^(?:https?|file):/.test(tab.url))
      ) {
        throw new Error('PAGE_UNAVAILABLE')
      }
      tabId = tab.id
      hostname.value = tab.url ? new URL(tab.url).hostname : ''
      const response = await browser.tabs.sendMessage(
        tabId,
        { type: 'code-blocks/scan', version: 1 },
        { frameId: 0 },
      )
      if (!response?.ok) {
        throw new Error(response?.error ?? 'PAGE_UNAVAILABLE')
      }
      scanResult.value = v.parse(CodeBlockScanSchema, response)
      hostname.value = scanResult.value.hostname
    } catch (error_) {
      const failure = codeBlockFailure(error_).error
      error.value =
        failure === 'STORAGE_UNAVAILABLE' ? 'PAGE_UNAVAILABLE' : failure
    } finally {
      isBusy.value = false
    }
  }

  async function submit() {
    if (
      !scanResult.value
      || tabId === undefined
      || !selectedIds.value.length
      || selectedIds.value.length > 8
      || isBusy.value
    ) {
      return
    }
    isBusy.value = true
    error.value = undefined
    hasRetry.value = true
    retry ??= {
      requestId: crypto.randomUUID(),
      documentRevision: scanResult.value.documentRevision,
      blockIds: [...selectedIds.value],
    }
    try {
      const response = await browser.tabs.sendMessage(
        tabId,
        { type: 'code-blocks/submit', version: 1, ...retry },
        { frameId: 0 },
      )
      if (!response?.ok) {
        throw new Error(response?.error ?? 'PAGE_UNAVAILABLE')
      }
      const result = v.parse(CodeBlockSubmissionSchema, response)
      itemErrors.value = result.results.flatMap(item =>
        item.error ? [{ blockId: item.blockId, error: item.error }] : [],
      )
      resultCounts.value = {
        sent: response.sentCount ?? 0,
        failed: response.failedCount ?? itemErrors.value.length,
      }
      if (response.error) {
        throw new Error(response.error)
      }
      retry = undefined
      hasRetry.value = false
      selectedIds.value = []
    } catch (error_) {
      error.value = codeBlockFailure(error_).error
    } finally {
      isBusy.value = false
    }
  }

  return {
    scanResult,
    selectedIds,
    isBusy,
    hasRetry,
    error,
    resultCounts,
    itemErrors,
    hostname,
    scan,
    submit,
  }
}
