import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCodeBlockPicker } from '@/composables/codeBlockPicker'

const mock = vi.hoisted(() => ({ query: vi.fn(), send: vi.fn() }))
vi.mock('#imports', () => ({
  browser: { tabs: { query: mock.query, sendMessage: mock.send } },
}))

beforeEach(() => {
  vi.clearAllMocks()
  mock.query.mockResolvedValue([{ id: 1, incognito: false }])
  mock.send.mockResolvedValue({
    ok: true,
    documentRevision: 'revision',
    summaries: [],
    limited: false,
    hostname: 'example.com',
  })
})

describe('popup code block picker', () => {
  it('scans via the content script when tabs permission does not expose a URL', async () => {
    const picker = useCodeBlockPicker()
    await picker.scan()
    expect(picker.error.value).toBeUndefined()
    expect(picker.hostname.value).toBe('example.com')
    expect(picker.selectedIds.value).toEqual([])
    expect(mock.send).toHaveBeenCalledWith(
      1,
      { type: 'code-blocks/scan', version: 1 },
      { frameId: 0 },
    )
  })

  it('blocks private pages and selections larger than eight', async () => {
    const picker = useCodeBlockPicker()
    mock.query.mockResolvedValueOnce([{ id: 1, incognito: true }])
    await picker.scan()
    expect(picker.error.value).toBe('PRIVATE_WINDOW_UNSUPPORTED')
    expect(mock.send).not.toHaveBeenCalled()
    await picker.scan()
    picker.selectedIds.value = Array.from(
      { length: 9 },
      (_, index) => `block-${index}`,
    )
    await picker.submit()
    expect(mock.send).toHaveBeenCalledTimes(1)
  })

  it('retries the same request and displays partial outcomes', async () => {
    const picker = useCodeBlockPicker()
    await picker.scan()
    picker.selectedIds.value = ['valid', 'stale']
    mock.send.mockRejectedValueOnce(new Error('lost response'))
    await picker.submit()
    expect(picker.hasRetry.value).toBe(true)
    const first = mock.send.mock.calls[1]?.[1]
    mock.send.mockResolvedValueOnce({
      ok: true,
      queued: true,
      sentCount: 1,
      failedCount: 1,
      results: [
        { blockId: 'valid', ok: true },
        { blockId: 'stale', ok: false, error: 'BLOCK_STALE' },
      ],
    })
    await picker.submit()
    expect(mock.send.mock.calls[2]?.[1]).toEqual(first)
    expect(picker.resultCounts.value).toEqual({ sent: 1, failed: 1 })
    expect(picker.itemErrors.value).toEqual([
      { blockId: 'stale', error: 'BLOCK_STALE' },
    ])
    expect(picker.hasRetry.value).toBe(false)
  })
})
