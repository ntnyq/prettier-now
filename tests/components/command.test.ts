import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, onMounted } from 'vue'
import { useCommand } from '@/components/ui/command'
import Command from '@/components/ui/command/Command.vue'
import { PassthroughStub } from '../helpers/vue'

const CommandProbe = defineComponent({
  setup() {
    const { allGroups, allItems, filterState } = useCommand()

    onMounted(() => {
      allItems.value.set('alpha', 'Alpha')
      allItems.value.set('beta', 'Beta')
      allGroups.value.set('letters', new Set(['alpha', 'beta']))
    })

    return () =>
      h('div', [
        h(
          'button',
          {
            type: 'button',
            onClick() {
              filterState.search = 'alpha'
            },
          },
          'filter',
        ),
        h(
          'button',
          {
            type: 'button',
            onClick() {
              filterState.search = ''
            },
          },
          'clear',
        ),
        h('span', { 'data-testid': 'item-count' }, [
          String(filterState.filtered.items.size),
        ]),
        h('span', { 'data-testid': 'group-count' }, [
          String(filterState.filtered.groups.size),
        ]),
        h(
          'span',
          { 'data-testid': 'visible-count' },
          String(filterState.filtered.count),
        ),
        h(
          'button',
          {
            onClick() {
              allItems.value.set('new', 'Alpha new')
              allGroups.value.get('letters')?.add('new')
            },
          },
          'add',
        ),
        h(
          'button',
          {
            onClick() {
              allItems.value.delete('alpha')
              allGroups.value.get('letters')?.delete('alpha')
            },
          },
          'remove',
        ),
      ])
  },
})

describe('command', () => {
  it('updates an active search when registered items change', async () => {
    const wrapper = mount(Command, {
      global: { stubs: { ListboxRoot: PassthroughStub } },
      slots: { default: () => h(CommandProbe) },
    })
    await nextTick()
    await wrapper.findAll('button')[0]!.trigger('click')
    expect(wrapper.find('[data-testid="visible-count"]').text()).toBe('1')
    await wrapper.findAll('button')[2]!.trigger('click')
    expect(wrapper.find('[data-testid="visible-count"]').text()).toBe('2')
    await wrapper.findAll('button')[3]!.trigger('click')
    expect(wrapper.find('[data-testid="visible-count"]').text()).toBe('1')
    expect(wrapper.find('[data-testid="item-count"]').text()).toBe('2')
    wrapper.unmount()
  })

  it('clears filtered item and group caches when search is cleared', async () => {
    const wrapper = mount(Command, {
      global: {
        stubs: {
          ListboxRoot: PassthroughStub,
        },
      },
      slots: {
        default: () => h(CommandProbe),
      },
    })

    await nextTick()
    await wrapper.find('button').trigger('click')
    await nextTick()

    expect(wrapper.find('[data-testid="item-count"]').text()).toBe('2')
    expect(wrapper.find('[data-testid="group-count"]').text()).toBe('1')

    await wrapper.findAll('button')[1]?.trigger('click')
    await nextTick()

    expect(wrapper.find('[data-testid="item-count"]').text()).toBe('0')
    expect(wrapper.find('[data-testid="group-count"]').text()).toBe('0')
  })
})
