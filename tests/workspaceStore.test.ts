import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useWorkspaceStore } from '@/stores/workspace'

const storageMock = vi.hoisted(() => ({
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
    t: (key: string, params?: unknown[]) =>
      params?.length ? `${key}:${params.join(',')}` : key,
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
