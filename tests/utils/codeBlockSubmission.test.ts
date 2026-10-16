import { describe, expect, it, vi } from 'vitest'
import { createCodeBlockSubmission } from '@/utils/codeBlocks/submission'
import type { ExtractedCodeBlock } from '@/types/codeBlocks'

function item(): ExtractedCodeBlock {
  return {
    id: 'item',
    sourceCode: 'before',
    capturedAt: Date.now(),
    blockIndex: 1,
    language: {
      status: 'unknown',
      evidence: 'none',
      requiresConfirmation: true,
    },
  }
}

describe('snapshot retries', () => {
  it('retries the identical original snapshot after a transport failure without reading the DOM', async () => {
    const extract = vi.fn(() => ({ ok: true as const, item: item() }))
    const enqueue = vi.fn(
      async (_requestId: string, _items: ExtractedCodeBlock[]) => ({
        queued: true,
      }),
    )
    enqueue.mockRejectedValueOnce(new Error('lost response'))
    const submission = createCodeBlockSubmission({ extract }, enqueue)
    await expect(
      submission.submit('request', ['block'], 'revision', 'popup'),
    ).rejects.toThrow('lost response')
    extract.mockImplementation(() => ({
      ok: true,
      item: { ...item(), sourceCode: 'after' },
    }))
    await submission.submit('request', ['block'], 'revision', 'popup')
    expect(extract).toHaveBeenCalledTimes(1)
    expect(enqueue.mock.calls[1]?.[1]).toEqual(enqueue.mock.calls[0]?.[1])
    await submission.submit('request', ['block'], 'revision', 'popup')
    expect(enqueue).toHaveBeenCalledTimes(2)
  })

  it('retains partial failure counts on retry, while sending valid items', async () => {
    const extract = vi.fn((id: string) =>
      id === 'stale'
        ? { ok: false as const, error: 'BLOCK_STALE' as const }
        : { ok: true as const, item: item() },
    )
    let failed = true
    const enqueue = vi.fn(async () => ({
      queued: true,
      error: failed ? ('WORKSPACE_OPEN_FAILED' as const) : undefined,
    }))
    const submission = createCodeBlockSubmission({ extract }, enqueue)
    const first = await submission.submit(
      'request',
      ['valid', 'stale'],
      'revision',
      'popup',
    )
    expect(first).toMatchObject({
      sentCount: 1,
      failedCount: 1,
      error: 'WORKSPACE_OPEN_FAILED',
    })
    failed = false
    const second = await submission.submit(
      'request',
      ['valid', 'stale'],
      'revision',
      'popup',
    )
    expect(second).toMatchObject({
      sentCount: 1,
      failedCount: 1,
      error: undefined,
    })
    expect(extract).toHaveBeenCalledTimes(2)
    await expect(
      submission.submit('request', ['different'], 'revision', 'popup'),
    ).rejects.toThrow('INVALID_MESSAGE')
  })
})
