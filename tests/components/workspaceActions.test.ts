import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import WorkspaceActionBar from '@/components/workspace/WorkspaceActionBar.vue'
import { useWorkspaceActions } from '@/composables/workspaceActions'
import { useHistoryStore } from '@/stores/history'
import { useWorkspaceStore } from '@/stores/workspace'
import { Logger } from '@/utils/logger'
import { Toast } from '@/utils/toast'
import { ButtonStub, createNamedStubs, PassthroughStub } from '../helpers/vue'

const formatter = vi.hoisted(() => ({
  format: vi.fn(async (source: string) => `${source}\n`),
}))
vi.mock('@/utils/format', () => ({
  formatViaPrettier: formatter.format,
}))
vi.mock('@/utils/logger', () => ({
  Logger: { success: vi.fn(), error: vi.fn(), warn: vi.fn() },
}))
vi.mock('@/utils/toast', () => ({
  Toast: { info: vi.fn(), error: vi.fn() },
}))

describe('workspace actions', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    formatter.format
      .mockReset()
      .mockImplementation(async source => `${source}\n`)
  })

  it('logs each imported formatting outcome and reports the batch summary', async () => {
    formatter.format.mockRejectedValueOnce(new Error('Invalid syntax'))
    const { loadFiles } = useWorkspaceActions()
    await loadFiles([
      new File(['invalid'], 'a.ts'),
      new File(['const b=2'], 'b.ts'),
    ])
    expect(Logger.error).toHaveBeenCalledWith('Invalid syntax')
    expect(Logger.success).toHaveBeenCalledWith('formatSuccess')
    expect(Toast.info).toHaveBeenCalledExactlyOnceWith('formatBatchSuccess:1,2')
    expect(Toast.error).not.toHaveBeenCalled()
  })

  it.each(['clear', 'replace', 'restore', 'remove'] as const)(
    'does not report a stale batch after %s',
    async action => {
      const pending = Promise.withResolvers<string>()
      formatter.format.mockImplementationOnce(() => pending.promise)
      const store = useWorkspaceStore()
      const { loadFiles } = useWorkspaceActions()
      const loading = loadFiles([
        new File(['const a=1'], 'a.ts'),
        new File(['const b=2'], 'b.ts'),
      ])
      await vi.waitFor(() => expect(formatter.format).toHaveBeenCalledOnce())
      if (action === 'clear') {
        store.clearWorkspace()
      } else if (action === 'replace') {
        await loadFiles([new File(['const c=3'], 'c.ts')])
      } else if (action === 'restore') {
        useHistoryStore().addEntry({
          fileName: 'restored.ts',
          languageId: 'typescript',
          sourceCode: 'const restored=1',
          resultCode: 'const restored = 1;\n',
          formatCost: 1,
        })
        store.restoreHistoryEntry(useHistoryStore().entries[0]!.id)
      } else {
        for (const job of [...store.jobs]) {
          store.removeJob(job.id)
        }
      }
      pending.resolve('const a = 1;\n')
      await loading
      expect(store.sourceCode).toBe(
        {
          clear: '',
          replace: 'const c=3',
          restore: 'const restored=1',
          remove: '',
        }[action],
      )
      expect(Toast.info).not.toHaveBeenCalled()
      expect(Toast.error).not.toHaveBeenCalled()
      expect(Logger.error).not.toHaveBeenCalled()
    },
  )

  it('clears all files when the active file has been emptied', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useWorkspaceStore()
    await store.loadFileList([
      new File(['const a=1'], 'a.ts'),
      new File(['const b=2'], 'b.ts'),
    ])
    store.sourceCode = ''

    const wrapper = mount(WorkspaceActionBar, {
      global: {
        plugins: [pinia],
        stubs: {
          Button: ButtonStub,
          DropdownMenuItem: ButtonStub,
          ...createNamedStubs(
            [
              'DropdownMenu',
              'DropdownMenuContent',
              'DropdownMenuTrigger',
              'Tooltip',
              'TooltipContent',
              'TooltipTrigger',
            ],
            PassthroughStub,
          ),
        },
      },
    })
    await wrapper
      .findAll('button')
      .find(button => button.text() === 'clearAll')!
      .trigger('click')

    expect(store.jobs).toHaveLength(1)
    expect(store.activeJob).toMatchObject({
      fileName: 'untitled',
      sourceCode: '',
      resultCode: '',
      status: 'pending',
    })
    wrapper.unmount()
  })
})
