import { beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, isProxy, nextTick } from 'vue'
import {
  createDefaultOptionsSnapshot,
  createOptionsPreset,
} from '@/utils/optionsPreset'

const storageMock = vi.hoisted(() => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
  watch: vi.fn((_key: string, _callback: (value: unknown) => void) => vi.fn()),
}))

vi.mock('#imports', () => ({
  storage: storageMock,
}))

describe('useStorage', () => {
  it('recovers local edits and remote updates after hydration fails', async () => {
    const { useStorage } = await import('@/composables/storage')
    const hydration = Promise.withResolvers<unknown>()
    storageMock.getItem.mockReturnValue(hydration.promise)
    const value = useStorage('records', ['default'])
    value.value.push('local edit')
    hydration.reject(new Error('Storage unavailable'))
    await vi.waitFor(() =>
      expect(storageMock.setItem).toHaveBeenCalledWith('local:records', [
        'default',
        'local edit',
      ]),
    )
    await nextTick()
    storageMock.watch.mock.calls.find(([key]) => key === 'local:records')![1]([
      'remote',
    ])
    expect(value.value).toEqual(['remote'])
  })

  beforeEach(() => {
    storageMock.getItem.mockReset()
    storageMock.setItem.mockReset()
    storageMock.watch.mockClear()
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

  it('does not write hydrated storage values back unchanged', async () => {
    const { OptionsPresetListSchema } = await import('@/utils/optionsPreset')
    const { useStorage } = await import('@/composables/storage')
    const preset = createOptionsPreset({
      name: 'Team',
      now: 1,
      snapshot: createDefaultOptionsSnapshot(),
    })

    storageMock.getItem.mockResolvedValue([preset])

    useStorage('optionsPresets', [], OptionsPresetListSchema)

    await nextTick()
    await Promise.resolve()
    await nextTick()

    expect(storageMock.setItem).not.toHaveBeenCalled()
  })

  it('persists changes to nested TOML settings after hydration', async () => {
    const { useStorage } = await import('@/composables/storage')
    const { TomlOptionsSchema } = await import('@/utils/tomlOptions')
    const defaults = createDefaultOptionsSnapshot().tomlPluginOptions
    storageMock.getItem.mockResolvedValue({
      ...defaults,
      stringQuoteStyle: 'single',
    })
    const value = useStorage(
      'tomlPluginOptions',
      { ...defaults },
      TomlOptionsSchema,
    )

    await nextTick()
    await Promise.resolve()
    await nextTick()
    value.value.arrayBracketSpaceWidth = 2
    await nextTick()

    expect(storageMock.setItem).toHaveBeenCalledWith(
      'local:tomlPluginOptions',
      {
        ...defaults,
        stringQuoteStyle: 'single',
        arrayBracketSpaceWidth: 2,
      },
    )
  })

  it('writes detached JSON data that can be cloned and hydrated again', async () => {
    const { useStorage } = await import('@/composables/storage')
    storageMock.getItem.mockResolvedValue(null)
    const value = useStorage('records', [{ nested: ['original'] }])
    await nextTick()
    value.value[0]!.nested.push('saved')
    await nextTick()
    await vi.waitFor(() => expect(storageMock.setItem).toHaveBeenCalled())
    const saved = storageMock.setItem.mock.lastCall?.[1]
    expect(isProxy(saved)).toBe(false)
    expect(isProxy(saved[0].nested)).toBe(false)
    expect(structuredClone(saved)).toEqual([{ nested: ['original', 'saved'] }])
    value.value[0]!.nested.push('later')
    expect(saved[0].nested).toEqual(['original', 'saved'])
  })

  it('recovers numeric-key arrays left by Chromium proxy serialization', async () => {
    const { OptionsPresetListSchema } = await import('@/utils/optionsPreset')
    const { useStorage } = await import('@/composables/storage')
    const preset = createOptionsPreset({
      name: 'Recovered',
      snapshot: createDefaultOptionsSnapshot(),
    })
    storageMock.getItem.mockResolvedValue({ 0: preset })
    const value = useStorage('optionsPresets', [], OptionsPresetListSchema)
    await vi.waitFor(() => expect(value.value).toEqual([preset]))
    await vi.waitFor(() =>
      expect(storageMock.setItem).toHaveBeenCalledWith('local:optionsPresets', [
        preset,
      ]),
    )
  })

  it('receives external updates and removals without writing them back', async () => {
    const { useStorage } = await import('@/composables/storage')
    storageMock.getItem.mockResolvedValue(null)
    const value = useStorage<boolean>('semi', true)
    await nextTick()
    expect(storageMock.watch).toHaveBeenCalled()
    const receive = storageMock.watch.mock.lastCall![1]
    receive(false)
    expect(value.value).toBe(false)
    receive(null)
    expect(value.value).toBe(true)
    await nextTick()
    expect(storageMock.setItem).not.toHaveBeenCalled()
  })

  it('unsubscribes when its owning scope stops', async () => {
    const { useStorage } = await import('@/composables/storage')
    storageMock.getItem.mockResolvedValue(null)
    const scope = effectScope()
    scope.run(() => useStorage('scoped', true))
    const stop = storageMock.watch.mock.results.at(-1)?.value
    expect(stop).toBeTypeOf('function')
    scope.stop()
    expect(stop).toHaveBeenCalledOnce()
  })

  it('keeps newer remote data when the initial read finishes late', async () => {
    const { useStorage } = await import('@/composables/storage')
    const hydration = Promise.withResolvers<boolean>()
    storageMock.getItem.mockReturnValue(hydration.promise)
    const value = useStorage<boolean>('semi', true)
    storageMock.watch.mock.lastCall![1](false)
    hydration.resolve(true)
    await nextTick()
    expect(value.value).toBe(false)
    expect(storageMock.setItem).not.toHaveBeenCalled()
  })

  it('reconciles remote changes received before a local write resolves', async () => {
    const { useStorage } = await import('@/composables/storage')
    const writing = Promise.withResolvers<void>()
    storageMock.getItem.mockResolvedValue(true)
    storageMock.setItem.mockReturnValue(writing.promise)
    const value = useStorage<boolean>('semi', true)
    await nextTick()
    value.value = false
    await vi.waitFor(() => expect(storageMock.setItem).toHaveBeenCalledOnce())
    storageMock.watch.mock.lastCall![1](true)
    writing.resolve()
    await vi.waitFor(() => expect(value.value).toBe(true))
    expect(storageMock.setItem).toHaveBeenCalledOnce()
  })

  it('preserves and serializes changes made before hydration finishes', async () => {
    const { useStorage } = await import('@/composables/storage')
    const hydration = Promise.withResolvers<unknown>()
    storageMock.getItem.mockReturnValue(hydration.promise)
    const value = useStorage('records', ['default'])
    value.value.push('local edit')
    hydration.resolve(['stored'])
    await vi.waitFor(() => expect(storageMock.setItem).toHaveBeenCalled())
    const saved = storageMock.setItem.mock.lastCall![1]
    expect(structuredClone(saved)).toEqual(['default', 'local edit'])
    expect(value.value).toEqual(['default', 'local edit'])
  })
})
