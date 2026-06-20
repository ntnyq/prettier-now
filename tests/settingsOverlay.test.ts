import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import SettingsDialog from '@/components/settings/SettingsDialog.vue'
import { PassthroughStub } from './helpers/vue'

vi.mock('#i18n', () => ({
  i18n: {
    t: (key: string) => key,
  },
}))

describe('settings overlay', () => {
  it('renders settings in a wide dialog', () => {
    const wrapper = mount(SettingsDialog, {
      props: {
        open: true,
      },
      global: {
        stubs: {
          Dialog: PassthroughStub,
          DialogContent: PassthroughStub,
          DialogDescription: PassthroughStub,
          DialogHeader: PassthroughStub,
          DialogTitle: PassthroughStub,
          SettingsContent: PassthroughStub,
        },
      },
    })

    const content = wrapper.find('[class*="min(960px,96vw)"]')
    expect(content.exists()).toBe(true)
    expect(content.attributes('class')).toContain('!w-[min(960px,96vw)]')
    expect(content.attributes('class')).toContain('!max-w-[min(960px,96vw)]')
    expect(wrapper.text()).toContain('settings')
    expect(wrapper.text()).toContain('prettierOptions')
  })
})
