import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SettingNumberField from '@/components/settings/SettingNumberField.vue'
import SettingSelect from '@/components/settings/SettingSelect.vue'
import SettingSwitch from '@/components/settings/SettingSwitch.vue'
import Button from '@/components/ui/button/Button.vue'
import { ButtonStub, PassthroughStub } from './helpers/vue'

describe('vue template bindings', () => {
  it('passes primitive bindings to shadcn buttons', () => {
    const wrapper = mount(Button, {
      props: {
        as: 'a',
        asChild: false,
        href: 'https://example.com',
      },
      slots: {
        default: 'Open',
      },
    })

    const button = wrapper.find('[data-slot="button"]')
    expect(button.element.tagName).toBe('A')
    expect(button.attributes('href')).toBe('https://example.com')
    expect(button.text()).toBe('Open')
  })

  it('forwards aria props to setting switch controls', () => {
    const wrapper = mount(SettingSwitch, {
      props: {
        ariaDescribedby: 'description',
        ariaLabelledby: 'label',
        modelValue: true,
      },
      global: {
        stubs: {
          Switch: ButtonStub,
        },
      },
    })

    const control = wrapper.find('[aria-describedby="description"]')
    expect(control.attributes('aria-labelledby')).toBe('label')
  })

  it('forwards aria and numeric props to setting number controls', () => {
    const wrapper = mount(SettingNumberField, {
      props: {
        ariaDescribedby: 'description',
        ariaLabelledby: 'label',
        max: 100,
        min: 10,
        modelValue: 20,
        step: 5,
      },
      global: {
        stubs: {
          NumberField: PassthroughStub,
          NumberFieldContent: PassthroughStub,
          NumberFieldDecrement: ButtonStub,
          NumberFieldIncrement: ButtonStub,
          NumberFieldInput: PassthroughStub,
        },
      },
    })

    const control = wrapper.find('[aria-describedby="description"]')
    expect(control.attributes('aria-labelledby')).toBe('label')
    expect(control.attributes('max')).toBe('100')
    expect(control.attributes('min')).toBe('10')
    expect(control.attributes('step')).toBe('5')
  })

  it('forwards aria props to compact setting select controls', () => {
    const wrapper = mount(SettingSelect, {
      props: {
        ariaDescribedby: 'description',
        ariaLabelledby: 'label',
        items: ['one', 'two'],
        modelValue: 'one',
      },
      global: {
        stubs: {
          Select: PassthroughStub,
          SelectContent: PassthroughStub,
          SelectItem: PassthroughStub,
          SelectTrigger: ButtonStub,
          SelectValue: PassthroughStub,
        },
      },
    })

    const control = wrapper.find('[aria-describedby="description"]')
    expect(control.attributes('aria-labelledby')).toBe('label')
  })
})
