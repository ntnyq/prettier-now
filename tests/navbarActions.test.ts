import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Navbar from '@/components/navbar/index.vue'
import MoreAction from '@/components/navbar/MoreAction.vue'
import { useAppStore } from '@/stores/app'
import { useLogStore } from '@/stores/log'
import { ButtonStub, PassthroughStub } from './helpers/vue'

const routeMock = vi.hoisted(() => ({
  name: 'Home',
}))

const storageMock = vi.hoisted(() => ({
  getItem: vi.fn(async () => null),
  setItem: vi.fn(async () => {}),
}))

vi.mock('#imports', () => ({
  browser: {
    runtime: {
      getURL: (path: string) => path,
    },
  },
  storage: storageMock,
}))

vi.mock('#i18n', () => ({
  i18n: {
    t: (key: string, params?: unknown[]) =>
      params?.length ? `${key}:${params.join(',')}` : key,
  },
}))

vi.mock('vue-router', () => ({
  RouterLink: {
    props: ['to'],
    template: '<a><slot /></a>',
  },
  useRoute: () => routeMock,
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

vi.mock('@/utils', () => ({
  openExternalURL: vi.fn(),
}))

vi.stubGlobal('localStorage', {
  clear: vi.fn(),
})

const menuStubs = {
  Button: ButtonStub,
  Dialog: PassthroughStub,
  DialogContent: PassthroughStub,
  DialogHeader: PassthroughStub,
  DialogTitle: PassthroughStub,
  DropdownMenu: PassthroughStub,
  DropdownMenuContent: PassthroughStub,
  DropdownMenuItem: ButtonStub,
  DropdownMenuSeparator: PassthroughStub,
  DropdownMenuTrigger: PassthroughStub,
  FileText: PassthroughStub,
  History: PassthroughStub,
  Info: PassthroughStub,
  Menu: PassthroughStub,
  MessageSquareText: PassthroughStub,
  SquareCode: PassthroughStub,
  Tag: PassthroughStub,
}

describe('navbar actions', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    routeMock.name = 'Home'
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      callback(0)
      return 0
    })
  })

  it('opens history and log panels from the more menu', async () => {
    const appStore = useAppStore()
    const logStore = useLogStore()
    const wrapper = mount(MoreAction, {
      props: {
        showWorkspaceActions: true,
      },
      global: {
        stubs: menuStubs,
      },
    })

    expect(wrapper.text()).toContain('history')
    expect(wrapper.text()).toContain('log')

    await wrapper
      .findAll('button')
      .find(button => button.text() === 'history')
      ?.trigger('click')
    await wrapper
      .findAll('button')
      .find(button => button.text() === 'log')
      ?.trigger('click')

    expect(appStore.isHistoryPanelVisible).toBe(true)
    expect(logStore.isLogPanelVisible).toBe(true)
  })

  it('hides workspace actions when requested', () => {
    const wrapper = mount(MoreAction, {
      props: {
        showWorkspaceActions: false,
      },
      global: {
        stubs: menuStubs,
      },
    })

    const menuButtonLabels = wrapper
      .findAll('button')
      .map(button => button.text())

    expect(menuButtonLabels).not.toContain('history')
    expect(menuButtonLabels).not.toContain('log')
    expect(wrapper.text()).toContain('feedback')
    expect(wrapper.text()).toContain('about')
  })

  it('passes workspace actions to the more menu on the home route', () => {
    const wrapper = mount(Navbar, {
      global: {
        stubs: {
          Button: ButtonStub,
          Columns2: PassthroughStub,
          GitMerge: PassthroughStub,
          LanguageSelect: PassthroughStub,
          Moon: PassthroughStub,
          MoreAction: {
            props: ['showWorkspaceActions'],
            template:
              '<div data-testid="more-action" :data-workspace="showWorkspaceActions" />',
          },
          PanelLeft: PassthroughStub,
          RouterLink: PassthroughStub,
          Settings: PassthroughStub,
          Sun: PassthroughStub,
          Tooltip: PassthroughStub,
          TooltipContent: PassthroughStub,
          TooltipTrigger: PassthroughStub,
        },
      },
    })

    expect(
      wrapper.find('[data-testid="more-action"]').attributes(),
    ).toMatchObject({
      'data-workspace': 'true',
    })
  })
})
