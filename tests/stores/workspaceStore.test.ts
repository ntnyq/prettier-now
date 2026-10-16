import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useWorkspaceStore } from '@/stores/workspace'
import type { ConfirmedExtractedCode } from '@/types/codeBlocks'

const storageMock = vi.hoisted(() => ({
  getItem: vi.fn(async () => null),
  setItem: vi.fn(async () => {}),
}))

const formatterMock = vi.hoisted(() => {
  let rejectFirstFormat: ((error: Error) => void) | undefined
  let resolveFirstFormat: ((value: string) => void) | undefined

  const formatViaPrettier = vi.fn((source: string) => {
    if (formatViaPrettier.mock.calls.length === 1) {
      return new Promise<string>((resolve, reject) => {
        rejectFirstFormat = reject
        resolveFirstFormat = resolve
      })
    }

    return Promise.resolve(`${source}\n`)
  })

  return {
    formatViaPrettier,
    resolveFirstFormat: (value: string) => resolveFirstFormat?.(value),
    rejectFirstFormat: (error: Error) => rejectFirstFormat?.(error),
  }
})

vi.mock('#imports', () => ({
  storage: storageMock,
}))

vi.mock('#i18n', () => ({
  i18n: {
    t(key: string, params?: unknown[]) {
      return params?.length ? `${key}:${params.join(',')}` : key
    },
  },
}))

vi.mock('@/utils/cache', () => ({
  loadCodemirrorLanguage: vi.fn(async () => {}),
}))

vi.mock('@/utils/format', () => ({
  formatViaPrettier: formatterMock.formatViaPrettier,
}))

vi.mock('@/utils/toast', () => ({
  Toast: {
    error: vi.fn(),
    info: vi.fn(),
  },
}))

vi.stubGlobal('localStorage', {
  clear: vi.fn(),
})

vi.stubGlobal('window', {
  performance: {
    now: vi.fn(() => 0),
  },
})

describe('workspace store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    formatterMock.formatViaPrettier.mockClear()
  })

  it('keeps an in-flight file format valid when another file is selected', async () => {
    const workspaceStore = useWorkspaceStore()
    const loading = workspaceStore.loadFileList([
      new File(['const a=1'], 'a.ts'),
      new File(['const b=2'], 'b.ts'),
    ])

    await vi.waitFor(() => {
      expect(workspaceStore.jobs[0]?.status).toBe('formatting')
    })

    const firstJobId = workspaceStore.jobs[0]!.id
    const secondJobId = workspaceStore.jobs[1]!.id

    workspaceStore.selectJob(secondJobId)
    formatterMock.resolveFirstFormat('const a = 1\n')

    await loading

    expect(workspaceStore.activeJobId).toBe(secondJobId)
    expect(
      workspaceStore.jobs.find(job => job.id === firstJobId),
    ).toMatchObject({
      resultCode: 'const a = 1\n',
      status: 'formatted',
    })
    expect(workspaceStore.jobs.some(job => job.status === 'formatting')).toBe(
      false,
    )
  })
})

function extracted(id = 'item-1'): ConfirmedExtractedCode {
  return {
    requestId: 'request-1',
    languageId: 'typescript',
    source: {
      pageUrl: 'https://example.com/docs',
      pageTitle: 'Example',
      tabId: 1,
      frameId: 0,
      sourceWindowId: 1,
    },
    item: {
      id,
      sourceCode: 'const incoming=1',
      language: {
        status: 'supported',
        languageId: 'typescript',
        rawLabel: 'tsx',
        evidence: 'class',
        requiresConfirmation: false,
      },
      blockIndex: 1,
      capturedAt: Date.now(),
    },
  }
}

describe('appended snippets and independent formatting', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    formatterMock.formatViaPrettier.mockClear()
  })

  it('removes only an empty manual placeholder, deduplicates, and never formats imports', () => {
    const store = useWorkspaceStore()
    expect(store.appendExtractedJobs([extracted()]).jobIds).toHaveLength(1)
    expect(store.jobs).toHaveLength(1)
    expect(store.activeJob).toMatchObject({
      fileName: 'snippet-001.tsx',
      sourceCode: 'const incoming=1',
      status: 'pending',
    })
    expect(store.appendExtractedJobs([extracted()]).existingItemIds).toEqual([
      'item-1',
    ])
    expect(store.jobs).toHaveLength(1)
    expect(formatterMock.formatViaPrettier).not.toHaveBeenCalled()
  })

  it('keeps drafts, results and errors unchanged when appending', () => {
    const store = useWorkspaceStore()
    store.sourceCode = 'unfinished draft'
    store.resultCode = 'previous result'
    const original = structuredClone(store.jobs[0])
    store.appendExtractedJobs([extracted(), extracted('item-2')])
    expect(store.jobs[0]).toEqual(original)
    expect(store.jobs).toHaveLength(3)
    expect(new Set(store.jobs.map(job => job.fileName)).size).toBe(3)
  })

  it('does not cancel formatting A when B is appended, formatted or edited', async () => {
    const store = useWorkspaceStore()
    store.sourceCode = 'const draft=1'
    const running = store.formatActiveJob()
    await vi.waitFor(() =>
      expect(formatterMock.formatViaPrettier).toHaveBeenCalledTimes(1),
    )
    store.appendExtractedJobs([extracted()])
    await store.formatActiveJob()
    store.sourceCode = 'changed B'
    formatterMock.resolveFirstFormat('const draft = 1\n')
    await running
    expect(store.jobs[0]).toMatchObject({
      resultCode: 'const draft = 1\n',
      status: 'formatted',
    })
    expect(store.activeJob).toMatchObject({
      sourceCode: 'changed B',
      status: 'pending',
    })
  })

  it.each(['success', 'error'])(
    'rejects stale %s after editing the source',
    async outcome => {
      const store = useWorkspaceStore()
      store.sourceCode = 'old'
      const running = store.formatActiveJob()
      await vi.waitFor(() =>
        expect(formatterMock.formatViaPrettier).toHaveBeenCalledTimes(1),
      )
      store.sourceCode = 'new'
      if (outcome === 'success') {
        formatterMock.resolveFirstFormat('OLD')
      } else {
        formatterMock.rejectFirstFormat(new Error('old failure'))
      }
      await running
      expect(store.activeJob).toMatchObject({
        sourceCode: 'new',
        resultCode: '',
        errorMessage: '',
        status: 'pending',
      })
      expect(store.formatHistory).toHaveLength(0)
    },
  )

  it('does not restore a removed task or write its late history', async () => {
    const store = useWorkspaceStore()
    store.appendExtractedJobs([extracted()])
    const running = store.formatActiveJob()
    await vi.waitFor(() =>
      expect(formatterMock.formatViaPrettier).toHaveBeenCalledTimes(1),
    )
    store.removeJob(store.activeJobId)
    formatterMock.resolveFirstFormat('late')
    await running
    expect(store.jobs).toHaveLength(1)
    expect(store.activeJob?.id).toBe('manual')
    expect(store.formatHistory).toHaveLength(0)
  })
})
