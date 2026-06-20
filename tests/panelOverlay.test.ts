import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import DiffPanel from '@/components/DiffPanel.vue'
import HistoryPanel from '@/components/HistoryPanel.vue'
import LogPanel from '@/components/LogPanel.vue'
import { useAppStore } from '@/stores/app'
import { useLogStore } from '@/stores/log'
import { useWorkspaceStore } from '@/stores/workspace'
import { ButtonStub, PassthroughStub } from './helpers/vue'

const storageMock = vi.hoisted(() => ({
  getItem: vi.fn(async () => null),
  setItem: vi.fn(async () => {}),
}))

vi.mock('#imports', () => ({
  storage: storageMock,
}))

vi.mock('#i18n', () => ({
  i18n: {
    t: (key: string, params?: unknown[]) =>
      params?.length ? `${key}:${params.join(',')}` : key,
  },
}))

vi.mock('@/utils/toast', () => ({
  Toast: {
    info: vi.fn(),
  },
}))

vi.stubGlobal('localStorage', {
  clear: vi.fn(),
})

const overlayStubs = {
  AlertDialog: PassthroughStub,
  AlertDialogAction: ButtonStub,
  AlertDialogCancel: ButtonStub,
  AlertDialogContent: PassthroughStub,
  AlertDialogDescription: PassthroughStub,
  AlertDialogFooter: PassthroughStub,
  AlertDialogHeader: PassthroughStub,
  AlertDialogTitle: PassthroughStub,
  AlertDialogTrigger: PassthroughStub,
  Button: ButtonStub,
  Dialog: PassthroughStub,
  DialogContent: PassthroughStub,
  DialogHeader: PassthroughStub,
  DialogTitle: PassthroughStub,
  Sheet: PassthroughStub,
  SheetContent: PassthroughStub,
  SheetHeader: PassthroughStub,
  SheetTitle: PassthroughStub,
  Trash2: PassthroughStub,
  X: PassthroughStub,
}

describe('panel overlays', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('confirms before clearing history entries', async () => {
    const appStore = useAppStore()
    const workspaceStore = useWorkspaceStore()
    appStore.setIsHistoryPanelVisible(true)
    workspaceStore.formatHistory = [
      {
        id: 'entry',
        fileName: 'index.ts',
        languageId: 'typescript',
        sourceCode: 'const a=1',
        resultCode: 'const a = 1\n',
        formatCost: 1,
        formattedAt: 1,
      },
    ]

    const wrapper = mount(HistoryPanel, {
      global: {
        stubs: overlayStubs,
      },
    })

    expect(wrapper.text()).toContain('index.ts')
    expect(
      wrapper.find('[class*="sheet-close"]').attributes('class'),
    ).toContain('[&_[data-slot=sheet-close]]:hidden')

    await wrapper
      .findAll('button')
      .find(button => button.text() === 'clearAll')
      ?.trigger('click')

    expect(workspaceStore.formatHistory).toEqual([])
    expect(appStore.isHistoryPanelVisible).toBe(false)
  })

  it('confirms before clearing logs', async () => {
    const logStore = useLogStore()
    logStore.setIsLogPanelVisible(true)
    logStore.addLog({
      message: 'Formatted',
      type: 'success',
    })

    const wrapper = mount(LogPanel, {
      global: {
        stubs: overlayStubs,
      },
    })

    expect(wrapper.text()).toContain('Formatted')
    expect(
      wrapper.find('[class*="sheet-close"]').attributes('class'),
    ).toContain('[&_[data-slot=sheet-close]]:hidden')

    await wrapper
      .findAll('button')
      .find(button => button.text() === 'clearAll')
      ?.trigger('click')

    expect(logStore.logList).toEqual([])
    expect(logStore.isLogPanelVisible).toBe(false)
  })

  it('uses a wide dialog for diff and shows the empty state', () => {
    const appStore = useAppStore()
    appStore.setIsDiffPanelVisible(true)

    const wrapper = mount(DiffPanel, {
      global: {
        stubs: overlayStubs,
      },
    })

    const content = wrapper.find('[class*="min(520px,72vh)"]')
    expect(content.exists()).toBe(true)
    expect(content.attributes('class')).toContain('!w-[min(960px,96vw)]')
    expect(content.attributes('class')).toContain('!max-w-[min(960px,96vw)]')
    expect(wrapper.text()).toContain('emptyDiff')
  })
})
