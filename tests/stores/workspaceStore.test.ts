import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useHistoryStore } from '@/stores/history'
import { useWorkspaceStore } from '@/stores/workspace'

const storageMock = vi.hoisted(() => ({
  watch: vi.fn(() => vi.fn()),
  getItem: vi.fn(async () => null),
  setItem: vi.fn(async () => {}),
}))

const formatterMock = vi.hoisted(() => {
  let resolveFirstFormat: ((value: string) => void) | undefined

  const formatViaPrettier = vi.fn((source: string) => {
    if (formatViaPrettier.mock.calls.length === 1) {
      return new Promise<string>(resolve => {
        resolveFirstFormat = resolve
      })
    }

    return Promise.resolve(`${source}\n`)
  })

  return {
    formatViaPrettier,
    resolveFirstFormat: (value: string) => resolveFirstFormat?.(value),
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
  it('does not replace a newer import when an older file finishes reading', async () => {
    const store = useWorkspaceStore()
    const read = Promise.withResolvers<string>()
    const slowFile = new File(['slow'], 'slow.ts')
    vi.spyOn(slowFile, 'text').mockReturnValue(read.promise)
    const oldImport = store.loadFileList([slowFile])
    const newImport = store.loadFileList([new File(['new'], 'new.ts')])
    await vi.waitFor(() =>
      expect(formatterMock.formatViaPrettier).toHaveBeenCalledOnce(),
    )
    formatterMock.resolveFirstFormat('new formatted')
    await newImport
    read.resolve('old')
    await oldImport
    expect(store.activeJob).toMatchObject({
      fileName: 'new.ts',
      sourceCode: 'new',
    })
  })

  it.each(['clear', 'edit'] as const)(
    'preserves a %s action while a file is being read',
    async action => {
      const store = useWorkspaceStore()
      const read = Promise.withResolvers<string>()
      const file = new File(['slow'], 'slow.ts')
      vi.spyOn(file, 'text').mockReturnValue(read.promise)
      const loading = store.loadFileList([file])
      if (action === 'clear') {
        store.clearWorkspace()
      } else {
        store.sourceCode = 'local edit'
      }
      read.resolve('old')
      await loading
      expect(store.sourceCode).toBe(action === 'clear' ? '' : 'local edit')
      expect(formatterMock.formatViaPrettier).not.toHaveBeenCalled()
    },
  )

  it('reports unreadable files without losing the current workspace', async () => {
    const store = useWorkspaceStore()
    store.sourceCode = 'current source'
    const file = new File(['source'], 'source.ts')
    vi.spyOn(file, 'text').mockRejectedValue(new Error('Cannot read file'))
    await expect(store.loadFileList([file])).resolves.toEqual({
      status: 'error',
      message: 'Cannot read file',
    })
    expect(store.sourceCode).toBe('current source')
  })

  it('does not restore history entries whose contents were discarded', () => {
    const store = useWorkspaceStore()
    store.sourceCode = 'current source'
    useHistoryStore().entries = [
      {
        id: 'large',
        fileName: 'large.ts',
        languageId: 'typescript',
        sourceCode: '',
        resultCode: '',
        formatCost: 1,
        formattedAt: 1,
      },
    ]
    expect(store.restoreHistoryEntry('large')).toBe(false)
    expect(store.sourceCode).toBe('current source')
  })

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

  it('keeps file A valid when file B is edited or removed', async () => {
    const workspaceStore = useWorkspaceStore()
    const loading = workspaceStore.loadFileList([
      new File(['const a=1'], 'a.ts'),
      new File(['const b=2'], 'b.ts'),
    ])
    await vi.waitFor(() =>
      expect(formatterMock.formatViaPrettier).toHaveBeenCalledOnce(),
    )
    const firstJobId = workspaceStore.jobs[0]!.id
    const secondJobId = workspaceStore.jobs[1]!.id
    workspaceStore.selectJob(secondJobId)
    workspaceStore.sourceCode = 'const b=3'
    workspaceStore.removeJob(secondJobId)
    formatterMock.resolveFirstFormat('const a = 1\n')
    await loading
    expect(
      workspaceStore.jobs.find(job => job.id === firstJobId),
    ).toMatchObject({ status: 'formatted', resultCode: 'const a = 1\n' })
  })

  it('ignores failures from a request superseded by a successful format', async () => {
    const workspaceStore = useWorkspaceStore()
    const deferred = Promise.withResolvers<string>()
    formatterMock.formatViaPrettier.mockImplementationOnce(
      () => deferred.promise,
    )
    workspaceStore.sourceCode = 'bad source'
    const oldRequest = workspaceStore.formatActiveJob()
    await vi.waitFor(() =>
      expect(formatterMock.formatViaPrettier).toHaveBeenCalledOnce(),
    )
    workspaceStore.sourceCode = 'const corrected=1'
    await workspaceStore.formatActiveJob()
    deferred.reject(new Error('old syntax error'))
    await oldRequest
    expect(workspaceStore.activeJob).toMatchObject({
      status: 'formatted',
      errorMessage: '',
      resultCode: 'const corrected=1\n',
    })
  })

  it('does not let a cleared manual job receive an older failure', async () => {
    const workspaceStore = useWorkspaceStore()
    const deferred = Promise.withResolvers<string>()
    formatterMock.formatViaPrettier.mockImplementationOnce(
      () => deferred.promise,
    )
    workspaceStore.sourceCode = 'bad source'
    const pending = workspaceStore.formatActiveJob()
    await vi.waitFor(() =>
      expect(formatterMock.formatViaPrettier).toHaveBeenCalledOnce(),
    )
    workspaceStore.clearWorkspace()
    deferred.reject(new Error('old syntax error'))
    await pending
    expect(workspaceStore.activeJob).toMatchObject({
      sourceCode: '',
      status: 'pending',
      errorMessage: '',
    })
  })
})
