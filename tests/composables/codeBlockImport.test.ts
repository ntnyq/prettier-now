import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { useCodeBlockImport } from '@/composables/codeBlockImport'
import type { CodeBlockImportRequest } from '@/types/codeBlocks'

const mock = vi.hoisted(() => ({
  append: vi.fn(),
  send: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
}))
vi.mock('@/stores/workspace', () => ({
  useWorkspaceStore: () => ({ appendExtractedJobs: mock.append }),
}))
vi.mock('#imports', () => ({
  browser: {
    runtime: {
      sendMessage: mock.send,
      onMessage: {
        addListener: mock.addListener,
        removeListener: mock.removeListener,
      },
    },
    tabs: { getCurrent: async () => ({ id: 100, incognito: false }) },
  },
}))

let request: CodeBlockImportRequest
let api: ReturnType<typeof useCodeBlockImport>
let wrapper: ReturnType<typeof mount> | undefined
beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal(
    'location',
    new URL(
      'chrome-extension://extension/options.html?workspace=workspace-1#/',
    ),
  )
  request = {
    version: 1,
    requestId: 'request-1',
    workspaceId: 'workspace-1',
    createdAt: Date.now(),
    expiresAt: Date.now() + 600000,
    receipts: {},
    source: {
      pageUrl: 'https://example.com/docs',
      pageTitle: 'Example',
      tabId: 1,
      frameId: 0,
      sourceWindowId: 1,
    },
    items: [
      {
        id: 'known',
        sourceCode: 'const a=1',
        blockIndex: 1,
        capturedAt: Date.now(),
        language: {
          status: 'supported',
          languageId: 'javascript',
          evidence: 'class',
          requiresConfirmation: false,
        },
      },
      {
        id: 'unknown',
        sourceCode: 'echo a',
        blockIndex: 2,
        capturedAt: Date.now(),
        language: {
          status: 'unsupported',
          rawLabel: 'bash',
          evidence: 'class',
          requiresConfirmation: true,
        },
      },
    ],
  }
  mock.send.mockImplementation(async (message: { type: string }) => {
    if (message.type === 'code-blocks/register') {
      return { ok: true, requestIds: [request.requestId] }
    }
    if (message.type === 'code-blocks/read') {
      return { ok: true, request: structuredClone(request) }
    }
    return { ok: true }
  })
})
afterEach(() => {
  wrapper?.unmount()
  vi.unstubAllGlobals()
})

function setup() {
  wrapper = mount(
    defineComponent({
      setup() {
        api = useCodeBlockImport()
        return () => null
      },
    }),
  )
  return flushPromises()
}

describe('workspace extraction receiver', () => {
  it('imports only supported explicit languages, keeps unknown text, and deduplicates repeated reads', async () => {
    await setup()
    expect(mock.append.mock.calls.flatMap(([items]) => items)).toHaveLength(1)
    expect(api.pendingItems.value).toHaveLength(1)
    expect(api.pendingItems.value[0]?.item.sourceCode).toBe('echo a')
    await api.retry()
    expect(mock.append.mock.calls.flatMap(([items]) => items)).toHaveLength(1)
    expect(api.pendingItems.value).toHaveLength(1)
    await api.resolve(api.pendingItems.value[0]!.key, 'javascript')
    expect(mock.append.mock.calls.flatMap(([items]) => items)).toHaveLength(2)
    expect(api.pendingItems.value).toHaveLength(0)
    await api.retry()
    expect(api.pendingItems.value).toHaveLength(0)
    expect(mock.append.mock.calls.flatMap(([items]) => items)).toHaveLength(2)
  })

  it('remembers discarded items when ACK fails and retries the same decision', async () => {
    await setup()
    mock.send.mockImplementationOnce(async () => {
      throw new Error('storage failed')
    })
    await api.resolve(api.pendingItems.value[0]!.key)
    expect(api.pendingItems.value).toHaveLength(0)
    expect(api.error.value).toBe('STORAGE_UNAVAILABLE')
    await api.retry()
    expect(api.pendingItems.value).toHaveLength(0)
    expect(mock.send).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: 'code-blocks/ack',
        results: expect.arrayContaining([
          { itemId: 'unknown', status: 'discarded' },
        ]),
      }),
    )
  })

  it('does not import or discard expired snapshots', async () => {
    await setup()
    const now = vi.spyOn(Date, 'now').mockReturnValue(request.expiresAt + 1)
    await api.resolve(api.pendingItems.value[0]!.key, 'javascript')
    expect(api.error.value).toBe('REQUEST_EXPIRED')
    expect(mock.append.mock.calls.flatMap(([items]) => items)).toHaveLength(1)
    now.mockRestore()
  })
})
