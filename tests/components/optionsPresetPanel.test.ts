import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import OptionsPresetPanel from '@/components/settings/OptionsPresetPanel.vue'
import { useOptionsStore } from '@/stores/options'
import { createDefaultOptionsSnapshot } from '@/utils/optionsPreset'
import { Toast } from '@/utils/toast'
import { createNamedStubs, PassthroughStub } from '../helpers/vue'

const state = vi.hoisted(() => ({
  values: new Map<string, unknown>(),
  setItem: vi.fn(),
}))
vi.mock('#imports', () => ({
  storage: {
    getItem: async (key: string) => state.values.get(key) ?? null,
    setItem: (key: string, value: unknown) => state.setItem(key, value),
    watch: () => () => {},
  },
}))
vi.mock('@/utils/toast', () => ({
  Toast: { info: vi.fn(), error: vi.fn() },
}))

function renderPanel() {
  return mount(OptionsPresetPanel, {
    global: {
      stubs: createNamedStubs(
        ['Tooltip', 'TooltipContent', 'TooltipTrigger'],
        PassthroughStub,
      ),
    },
  })
}

describe('preset persistence feedback', () => {
  beforeEach(() => {
    state.values.clear()
    vi.clearAllMocks()
    state.setItem.mockImplementation(async (key: string, value: unknown) => {
      state.values.set(key, structuredClone(value))
    })
    setActivePinia(createPinia())
  })

  it('waits for persistence before clearing the name and announcing success', async () => {
    const writing = Promise.withResolvers<void>()
    state.setItem.mockReturnValueOnce(writing.promise)
    const wrapper = renderPanel()
    await flushPromises()
    await wrapper.get('input').setValue('Team')
    await wrapper.get('button[aria-label="savePreset"]').trigger('click')
    await flushPromises()
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe(
      'Team',
    )
    expect(Toast.info).not.toHaveBeenCalled()
    writing.resolve()
    await flushPromises()
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('')
    expect(Toast.info).toHaveBeenCalledWith('savePresetSuccess')
    wrapper.unmount()
  })

  it('retains the name and reports failure without a false success', async () => {
    state.setItem.mockRejectedValueOnce(new Error('Quota exceeded'))
    const wrapper = renderPanel()
    await flushPromises()
    await wrapper.get('input').setValue('Team')
    await wrapper.get('button[aria-label="savePreset"]').trigger('click')
    await flushPromises()
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe(
      'Team',
    )
    expect(Toast.info).not.toHaveBeenCalled()
    expect(Toast.error).toHaveBeenCalledWith('storageSaveFailed:Quota exceeded')
    expect(useOptionsStore().presets).toEqual([])
    wrapper.unmount()
  })

  it('keeps presets saved concurrently by independent windows', async () => {
    const first = useOptionsStore(createPinia())
    const second = useOptionsStore(createPinia())
    await Promise.all([first.savePreset('First'), second.savePreset('Second')])
    expect(state.values.get('local:optionsPresets')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'First' }),
        expect.objectContaining({ name: 'Second' }),
      ]),
    )
  })

  it('retains and migrates legacy presets when saving before initialization settles', async () => {
    state.values.set('local:optionsPresets', {
      0: {
        id: 'legacy',
        name: 'Legacy',
        createdAt: 1,
        updatedAt: 1,
        snapshot: {
          ...createDefaultOptionsSnapshot(),
          version: 1,
          tomlPluginOptions: {
            alignComments: true,
            alignEntries: false,
            allowedBlankLines: 2,
            arrayAutoCollapse: false,
            arrayAutoExpand: false,
            compactArrays: true,
            compactEntries: false,
            compactInlineTables: false,
            indentEntries: false,
            indentTables: true,
            reorderKeys: false,
          },
        },
      },
    })
    const store = useOptionsStore()
    await store.savePreset('New')
    expect(store.presets).toHaveLength(2)
    expect(
      store.presets.find(preset => preset.id === 'legacy')?.snapshot,
    ).toMatchObject({
      version: 2,
      tomlPluginOptions: {
        trailingCommentAlignment: true,
        indentSubTables: true,
      },
    })
    expect(Array.isArray(state.values.get('local:optionsPresets'))).toBe(true)
  })
})
