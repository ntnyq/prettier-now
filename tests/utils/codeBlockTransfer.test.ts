import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CODE_BLOCK_TTL } from '@/constants/codeBlocks'
import { createCodeBlockTransfer } from '@/utils/codeBlocks/transfer'
import type { Browser } from 'wxt/browser'

const mock = vi.hoisted(() => {
  const values: Record<string, unknown> = {}
  const tabs = new Map<
    number,
    { id: number; url?: string; windowId: number; incognito: boolean }
  >()
  const set = vi.fn(async (items: Record<string, unknown>) => {
    Object.assign(values, structuredClone(items))
  })
  const create = vi.fn(async (options: { url?: string; windowId: number }) => {
    const tab = { ...options, id: tabs.size + 100, incognito: false }
    tabs.set(tab.id, tab)
    return tab
  })
  return {
    values,
    tabs,
    set,
    create,
    browser: {
      runtime: {
        id: 'test-extension',
        getURL: (path: string) => `chrome-extension://test-extension${path}`,
        sendMessage: vi.fn(async (message: { nonce?: string }) =>
          message.nonce ? { nonce: message.nonce } : undefined,
        ),
      },
      storage: {
        session: {
          get: vi.fn(async () => structuredClone(values)),
          set,
          remove: vi.fn(async (keys: string[]) => {
            keys.forEach(key => {
              delete values[key]
            })
          }),
        },
        local: {
          get: vi.fn(async () => ({
            codeBlockButtons: true,
            codeBlockHiddenHosts: [],
          })),
        },
      },
      tabs: {
        get: vi.fn(async (id: number) => {
          const tab = tabs.get(id)
          if (!tab) {
            throw new Error('missing')
          }
          return tab
        }),
        create,
        query: vi.fn(async () => [...tabs.values()]),
        update: vi.fn(async () => undefined),
      },
      windows: { update: vi.fn(async () => undefined) },
    },
  }
})
vi.mock('#imports', () => ({ browser: mock.browser }))

const sourceUrl = 'https://example.com/docs?secret=1#private'
function sender(
  overrides: Partial<Browser.runtime.MessageSender> = {},
): Browser.runtime.MessageSender {
  return {
    id: 'test-extension',
    url: sourceUrl,
    frameId: 0,
    documentId: 'document-1',
    tab: {
      id: 1,
      lastAccessed: 0,
      frozen: false,
      selected: true,
      discarded: false,
      autoDiscardable: true,
      groupId: -1,
      splitViewId: -1,
      windowId: 10,
      incognito: false,
      index: 0,
      active: true,
      pinned: false,
      highlighted: false,
      title: 'Example',
      url: sourceUrl,
    },
    ...overrides,
  }
}
function enqueue(requestId = 'request-1', id = 'item-1') {
  return {
    type: 'code-blocks/enqueue',
    version: 1,
    requestId,
    mode: 'button',
    items: [
      {
        id,
        sourceCode: 'const a=1',
        language: {
          status: 'supported',
          languageId: 'javascript',
          evidence: 'class',
          rawLabel: 'js',
          requiresConfirmation: false,
        },
        blockIndex: 1,
        capturedAt: Date.now(),
      },
    ],
  }
}
function workspace() {
  const binding = mock.values['code-blocks/window/10'] as {
    workspaceId: string
    tabId: number
  }
  const tab = mock.tabs.get(binding.tabId)!
  return {
    sender: {
      id: 'test-extension',
      url: tab.url,
    } satisfies Browser.runtime.MessageSender,
    message: {
      version: 1,
      workspaceId: binding.workspaceId,
      tabId: binding.tabId,
    },
  }
}

beforeEach(() => {
  Object.keys(mock.values).forEach(key => {
    delete mock.values[key]
  })
  mock.tabs.clear()
  mock.tabs.set(1, { id: 1, url: sourceUrl, windowId: 10, incognito: false })
  vi.clearAllMocks()
})

describe('session extraction transfer', () => {
  it('stores before opening, redacts metadata and reuses one dedicated workspace concurrently', async () => {
    const transfer = createCodeBlockTransfer()
    await Promise.all([
      transfer.handle(enqueue(), sender()),
      transfer.handle(enqueue('request-2'), sender()),
    ])
    expect(mock.create).toHaveBeenCalledTimes(1)
    expect(mock.set.mock.invocationCallOrder[0]).toBeLessThan(
      mock.create.mock.invocationCallOrder[0]!,
    )
    expect(JSON.stringify(mock.values)).not.toContain('secret')
    expect(JSON.stringify(mock.values)).not.toContain('#private')
    expect(mock.create.mock.calls[0]?.[0].url).toMatch(
      /options.html\?workspace=[\w-]+#\/$/,
    )
    expect(mock.create.mock.calls[0]?.[0].url).not.toContain('const')
  })

  it('survives a worker restart and removes body only after ACK', async () => {
    const request = enqueue()
    await createCodeBlockTransfer().handle(request, sender())
    const nextWorker = createCodeBlockTransfer()
    const target = workspace()
    mock.browser.tabs.get.mockResolvedValueOnce({
      ...mock.tabs.get(target.message.tabId)!,
      url: undefined,
    })
    expect(
      await nextWorker.handle(
        { ...target.message, type: 'code-blocks/register' },
        target.sender,
      ),
    ).toMatchObject({ ok: true, requestIds: ['request-1'] })
    expect(
      await nextWorker.handle(
        { ...target.message, type: 'code-blocks/read', requestId: 'request-1' },
        target.sender,
      ),
    ).toMatchObject({
      ok: true,
      request: { items: [{ sourceCode: 'const a=1' }] },
    })
    await nextWorker.handle(
      {
        ...target.message,
        type: 'code-blocks/ack',
        requestId: 'request-1',
        results: [{ itemId: 'item-1', status: 'imported' }],
      },
      target.sender,
    )
    expect(JSON.stringify(mock.values)).not.toContain('const a=1')
    expect(await nextWorker.handle(request, sender())).toMatchObject({
      ok: true,
      queued: false,
      receipts: { 'item-1': 'imported' },
    })
    expect(mock.create).toHaveBeenCalledTimes(1)
  })

  it('keeps the snapshot after open failure and retries without adding a new request', async () => {
    const transfer = createCodeBlockTransfer()
    const request = enqueue()
    mock.create.mockRejectedValueOnce(new Error('open failed'))
    expect(await transfer.handle(request, sender())).toMatchObject({
      queued: true,
      error: 'WORKSPACE_OPEN_FAILED',
    })
    expect(
      Object.keys(mock.values).filter(key => key.includes('/request/')),
    ).toHaveLength(1)
    expect(await transfer.handle(request, sender())).toMatchObject({
      ok: true,
      queued: true,
    })
  })

  it('rejects changed snapshots and different documents reusing a request id, including after ACK', async () => {
    const transfer = createCodeBlockTransfer()
    const request = enqueue()
    await transfer.handle(request, sender())
    const changed = structuredClone(request)
    changed.items[0]!.sourceCode = 'replacement'
    expect(await transfer.handle(changed, sender())).toMatchObject({
      error: 'INVALID_MESSAGE',
    })
    expect(
      await transfer.handle(
        request,
        sender({ documentId: 'another-document' }),
      ),
    ).toMatchObject({ error: 'INVALID_MESSAGE' })
    const target = workspace()
    await transfer.handle(
      {
        ...target.message,
        type: 'code-blocks/ack',
        requestId: request.requestId,
        results: [{ itemId: 'item-1', status: 'imported' }],
      },
      target.sender,
    )
    expect(await transfer.handle(changed, sender())).toMatchObject({
      error: 'INVALID_MESSAGE',
    })
    expect(await transfer.handle(request, sender())).toMatchObject({
      ok: true,
      queued: false,
    })
    expect(JSON.stringify(mock.values)).not.toContain('replacement')
    expect(JSON.stringify(mock.values)).not.toContain('const a=1')
  })

  it('recovers registration when tab creation succeeded before its binding was recorded', async () => {
    const transfer = createCodeBlockTransfer()
    await transfer.handle(enqueue(), sender())
    const target = workspace()
    const binding = mock.values['code-blocks/window/10'] as { tabId?: number }
    delete binding.tabId
    expect(
      await createCodeBlockTransfer().handle(
        { ...target.message, type: 'code-blocks/register' },
        target.sender,
      ),
    ).toMatchObject({ ok: true, requestIds: ['request-1'] })
  })

  it('does not redirect navigated targets, and rejects the previous binding', async () => {
    const transfer = createCodeBlockTransfer()
    await transfer.handle(enqueue(), sender())
    const previous = workspace()
    mock.tabs.get(previous.message.tabId)!.url = 'https://other.example/'
    await transfer.handle(enqueue('request-2'), sender())
    expect(mock.create).toHaveBeenCalledTimes(2)
    expect(
      await transfer.handle(
        {
          ...previous.message,
          type: 'code-blocks/read',
          requestId: 'request-1',
        },
        previous.sender,
      ),
    ).toMatchObject({ ok: false, error: 'INVALID_MESSAGE' })
  })

  it('rejects content-script reads, wrong senders, subframes and private windows', async () => {
    const transfer = createCodeBlockTransfer()
    await transfer.handle(enqueue(), sender())
    const target = workspace()
    expect(
      await transfer.handle(
        { ...target.message, type: 'code-blocks/read', requestId: 'request-1' },
        sender(),
      ),
    ).toMatchObject({ error: 'INVALID_MESSAGE' })
    expect(
      await transfer.handle(enqueue('bad'), sender({ id: 'other' })),
    ).toMatchObject({ error: 'INVALID_MESSAGE' })
    expect(
      await transfer.handle(enqueue('bad'), sender({ frameId: 1 })),
    ).toMatchObject({ error: 'INVALID_MESSAGE' })
    mock.tabs.get(1)!.incognito = true
    expect(await transfer.handle(enqueue('bad'), sender())).toMatchObject({
      error: 'PRIVATE_WINDOW_UNSUPPORTED',
    })
  })

  it('preserves pending body when ACK storage fails', async () => {
    const transfer = createCodeBlockTransfer()
    await transfer.handle(enqueue(), sender())
    const target = workspace()
    const ack = {
      ...target.message,
      type: 'code-blocks/ack',
      requestId: 'request-1',
      results: [{ itemId: 'item-1', status: 'discarded' }],
    }
    mock.set.mockRejectedValueOnce(new Error('quota'))
    expect(await transfer.handle(ack, target.sender)).toMatchObject({
      error: 'STORAGE_UNAVAILABLE',
    })
    expect(JSON.stringify(mock.values)).toContain('const a=1')
    expect(await transfer.handle(ack, target.sender)).toMatchObject({
      ok: true,
    })
    expect(JSON.stringify(mock.values)).not.toContain('const a=1')
  })

  it('rejects expired retries instead of reviving stale snapshots', async () => {
    const transfer = createCodeBlockTransfer()
    const request = enqueue()
    await transfer.handle(request, sender())
    const now = vi
      .spyOn(Date, 'now')
      .mockReturnValue(Date.now() + CODE_BLOCK_TTL + 1)
    expect(await transfer.handle(request, sender())).toMatchObject({
      error: 'REQUEST_EXPIRED',
    })
    expect(JSON.stringify(mock.values)).not.toContain('const a=1')
    now.mockRestore()
  })

  it('refuses the 21st active request without evicting existing requests', async () => {
    const transfer = createCodeBlockTransfer()
    for (let index = 0; index < 20; index++) {
      await transfer.handle(enqueue(`request-${index}`), sender())
    }
    expect(await transfer.handle(enqueue('overflow'), sender())).toMatchObject({
      error: 'QUEUE_FULL',
    })
    expect(
      Object.keys(mock.values).filter(key => key.includes('/request/')),
    ).toHaveLength(20)
  })
})
