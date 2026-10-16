import {
  CODE_BLOCK_QUEUE_BYTES,
  CODE_BLOCK_QUEUE_REQUESTS,
  CODE_BLOCK_TTL,
} from '@/constants/codeBlocks'
import type { ExtractedCodeBlock } from '@/types/codeBlocks'
import type { createCodeBlockController } from './controller'
import type { CodeBlockError, CodeBlockSubmission } from './protocol'

/**
 * Background response after durable enqueue; it does not claim an import occurred.
 */
interface EnqueueResult {
  /**
   * Whether unconsumed code remains in the session inbox.
   */
  queued: boolean
  /**
   * A recoverable failure opening the receiving workspace.
   */
  error?: CodeBlockError
}
/**
 * Local retry entry preserves the first snapshot, including partial failures.
 */
interface SubmissionSnapshot {
  /**
   * Original selected nodes and document revision.
   */
  selection: string
  /**
   * Original snapshots; cleared after an acknowledged enqueue response.
   */
  items: ExtractedCodeBlock[]
  /**
   * Original per-item outcome, independent of subsequent DOM changes.
   */
  result: CodeBlockSubmission
  /**
   * Retry expiry timestamp.
   */
  expiresAt: number
  /**
   * Whether the background accepted the request and opened the workspace.
   */
  completed: boolean
}

/**
 * Capture once per request and retry transport without re-reading changing pages.
 */
export function createCodeBlockSubmission(
  controller: Pick<ReturnType<typeof createCodeBlockController>, 'extract'>,
  enqueue: (
    requestId: string,
    items: ExtractedCodeBlock[],
    mode: 'popup' | 'button',
  ) => Promise<EnqueueResult>,
) {
  const snapshots = new Map<string, SubmissionSnapshot>()

  /**
   * Send valid items even when other selected blocks have become stale.
   */
  async function submit(
    requestId: string,
    blockIds: string[],
    documentRevision: string,
    mode: 'popup' | 'button',
  ): Promise<CodeBlockSubmission> {
    const existing = snapshots.get(requestId)
    if (existing && existing.expiresAt <= Date.now()) {
      throw new Error('REQUEST_EXPIRED')
    }
    for (const [id, entry] of snapshots) {
      if (entry.expiresAt <= Date.now()) {
        snapshots.delete(id)
      }
    }
    const selection = JSON.stringify([documentRevision, blockIds])
    if (existing && existing.selection !== selection) {
      throw new Error('INVALID_MESSAGE')
    }
    if (existing?.completed) {
      return existing.result
    }
    let snapshot = existing
    if (!snapshot) {
      const results = blockIds.map(blockId => ({
        blockId,
        result: controller.extract(blockId, documentRevision),
      }))
      const items = results.flatMap(({ result }) =>
        result.ok ? [result.item] : [],
      )
      snapshot = {
        selection,
        items,
        expiresAt: Date.now() + CODE_BLOCK_TTL,
        completed: false,
        result: {
          ok: true,
          queued: false,
          sentCount: items.length,
          failedCount: blockIds.length - items.length,
          results: results.map(({ blockId, result }) => ({
            blockId,
            ok: result.ok,
            ...(result.ok ? {} : { error: result.error }),
          })),
        },
      }
      if (!items.length) {
        return snapshot.result
      }
      const active = [...snapshots.values()].filter(entry => !entry.completed)
      if (
        active.length >= CODE_BLOCK_QUEUE_REQUESTS
        || new TextEncoder().encode(JSON.stringify([...active, snapshot]))
          .byteLength > CODE_BLOCK_QUEUE_BYTES
      ) {
        throw new Error('QUEUE_FULL')
      }
      // Bound receipt memory too, without evicting a retryable text snapshot.
      if (snapshots.size >= 200) {
        const completed = [...snapshots].find(([, entry]) => entry.completed)
        if (completed) {
          snapshots.delete(completed[0])
        }
      }
      snapshots.set(requestId, snapshot)
    }
    const response = await enqueue(requestId, snapshot.items, mode)
    snapshot.result = { ...snapshot.result, ...response, error: response.error }
    if (!response.error) {
      snapshot.completed = true
      snapshot.items = []
    }
    return snapshot.result
  }

  /**
   * Release snapshots when this content-script context is invalidated.
   */
  function dispose() {
    snapshots.clear()
  }

  return { submit, dispose }
}
