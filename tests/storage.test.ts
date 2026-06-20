import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import {
  createDefaultOptionsSnapshot,
  createOptionsPreset,
} from '@/utils/optionsPreset'

const storageMock = vi.hoisted(() => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
}))

vi.mock('#imports', () => ({
  storage: storageMock,
}))

describe('useStorage', () => {
  beforeEach(() => {
    storageMock.getItem.mockReset()
    storageMock.setItem.mockReset()
  })

  it('keeps defaults when hydrated storage fails schema validation', async () => {
    const { OptionsPresetListSchema } = await import('@/utils/optionsPreset')
    const { useStorage } = await import('@/composables/storage')

    storageMock.getItem.mockResolvedValue([
      {
        id: 'bad',
        name: 'Bad',
        snapshot: {
          version: 1,
          options: {
            printWidth: 0,
          },
        },
      },
    ])

    const value = useStorage('optionsPresets', [], OptionsPresetListSchema)

    await nextTick()
    await Promise.resolve()

    expect(value.value).toEqual([])
    expect(storageMock.setItem).not.toHaveBeenCalled()
  })

  it('hydrates storage values that pass schema validation', async () => {
    const { OptionsPresetListSchema } = await import('@/utils/optionsPreset')
    const { useStorage } = await import('@/composables/storage')
    const preset = createOptionsPreset({
      name: 'Team',
      now: 1,
      snapshot: createDefaultOptionsSnapshot(),
    })

    storageMock.getItem.mockResolvedValue([preset])

    const value = useStorage('optionsPresets', [], OptionsPresetListSchema)

    await nextTick()
    await Promise.resolve()

    expect(value.value).toEqual([preset])
  })
})
