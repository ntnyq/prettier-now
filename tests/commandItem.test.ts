import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, reactive, ref } from 'vue'
import {
  provideCommandContext,
  provideCommandGroupContext,
} from '@/components/ui/command'
import CommandItem from '@/components/ui/command/CommandItem.vue'
import { ButtonStub } from './helpers/vue'

describe('command item', () => {
  it('keeps filtered items mounted so the search registry stays complete', async () => {
    const filterState = reactive({
      search: '',
      filtered: {
        count: 0,
        groups: new Set<string>(),
        items: new Map<string, number>(),
      },
    })
    const allItems = ref(new Map<string, string>())
    const allGroups = ref(new Map<string, Set<string>>())
    const Harness = defineComponent({
      setup() {
        provideCommandGroupContext({ id: 'group' })
        provideCommandContext({
          allGroups,
          allItems,
          filterState,
        })

        return () =>
          h(CommandItem, { value: 'alpha' }, { default: () => 'Alpha' })
      },
    })

    const wrapper = mount(Harness, {
      global: {
        stubs: {
          ListboxItem: ButtonStub,
        },
      },
    })

    await nextTick()

    const item = wrapper.find('[data-slot="command-item"]')
    const itemId = item.attributes('id')!
    expect(allItems.value.get(itemId)).toBe('Alpha')

    filterState.search = 'beta'
    filterState.filtered.items.set(itemId, 0)
    await nextTick()

    expect(wrapper.find(`[id="${itemId}"]`).exists()).toBe(true)
    expect(wrapper.find(`[id="${itemId}"]`).attributes('hidden')).toBe('')
    expect(allItems.value.has(itemId)).toBe(true)

    filterState.filtered.items.set(itemId, 1)
    await nextTick()

    expect(wrapper.find(`[id="${itemId}"]`).attributes('hidden')).toBe(
      undefined,
    )
  })
})
