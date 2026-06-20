import { defineComponent, h } from 'vue'
import type { Component } from 'vue'

export const PassthroughStub = defineComponent({
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    const { default: defaultSlot } = slots

    return () => h('div', attrs, defaultSlot?.())
  },
})

export const ButtonStub = defineComponent({
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    const { default: defaultSlot } = slots

    return () => h('button', attrs, defaultSlot?.())
  },
})

export const InputStub = defineComponent({
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h('input', attrs)
  },
})

export function createNamedStubs(names: string[], stub: Component) {
  return Object.fromEntries(names.map(name => [name, stub]))
}
