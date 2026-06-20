import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LanguageSelect from '@/components/navbar/LanguageSelect.vue'
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

vi.mock('@iconify/vue', () => ({
  addCollection: vi.fn(),
  Icon: {
    props: ['icon'],
    template: '<span data-testid="language-icon" :data-icon="icon" />',
  },
}))

vi.stubGlobal('localStorage', {
  clear: vi.fn(),
})

describe('language select', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('renders the active language and selected item marker', async () => {
    const workspaceStore = useWorkspaceStore()
    workspaceStore.setLanguageId('typescript')

    const wrapper = mount(LanguageSelect, {
      global: {
        stubs: {
          Check: PassthroughStub,
          ChevronDown: PassthroughStub,
          DropdownMenu: PassthroughStub,
          DropdownMenuContent: PassthroughStub,
          DropdownMenuItem: ButtonStub,
          DropdownMenuTrigger: PassthroughStub,
        },
      },
    })

    expect(wrapper.find('button[aria-label="TypeScript"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('TypeScript')
    expect(
      wrapper
        .find('[data-icon="vscode-icons:file-type-typescript-official"]')
        .exists(),
    ).toBe(true)

    const typeScriptItems = wrapper
      .findAll('button')
      .filter(item => item.text().includes('TypeScript'))
    const typeScriptItem = typeScriptItems.at(-1)

    expect(typeScriptItem?.html()).toContain('opacity-100')
  })
})
