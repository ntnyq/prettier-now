import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, isProxy, nextTick } from 'vue'
import { storageErrors } from '@/composables/storageErrors'
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
  it('keeps a successful refresh when an older initialization read fails late', async () => {
    const { useStorageBinding } = await import('@/composables/storage')
    const initial = Promise.withResolvers<unknown>()
    storageMock.getItem
      .mockReturnValueOnce(initial.promise)
      .mockResolvedValue('remote')
    const binding = useStorageBinding<string>('lateReadFailure', '')
    storageMock.watch.mock.lastCall![1]('remote')
    await flushPromises()
    initial.reject(new Error('Stale failure'))
    await binding.flush()
    expect(binding.value.value).toBe('remote')
    expect(storageErrors.value['local:lateReadFailure']).toBeUndefined()
  })

  it('recovers a failed remote refresh before acknowledging a save', async () => {
    const { useStorageBinding } = await import('@/composables/storage')
    storageMock.getItem.mockResolvedValue('old')
    const binding = useStorageBinding<string>('refreshRecovery', '')
    await binding.flush()
    storageMock.getItem.mockRejectedValueOnce(new Error('Offline'))
    storageMock.watch.mock.lastCall![1]('new')
    await expect(binding.flush()).rejects.toThrow('Offline')
    storageMock.getItem.mockResolvedValue('new')
    await binding.flush({ retry: true })
    expect(binding.value.value).toBe('new')
    expect(storageMock.setItem).not.toHaveBeenCalled()
  })
  it('does not replace a newer hydrated scalar with a delayed notification', async () => {
    const { useStorageBinding } = await import('@/composables/storage')
    storageMock.getItem.mockResolvedValue('newer')
    const binding = useStorageBinding<string>('scalarEcho', '')
    await binding.flush()
    storageMock.watch.mock.lastCall![1]('older')
    await flushPromises()
    expect(binding.value.value).toBe('newer')
    expect(storageMock.setItem).not.toHaveBeenCalled()
  })
  it('retains the failed latest edit when an earlier write echo is reconciled', async () => {
    const { useStorageBinding } = await import('@/composables/storage')
    storageMock.getItem.mockResolvedValue('initial')
    const latest = Promise.withResolvers<void>()
    storageMock.setItem
      .mockResolvedValueOnce(undefined)
      .mockReturnValueOnce(latest.promise)
    const binding = useStorageBinding<string>('failedLatest', 'initial')
    await binding.flush()
    binding.value.value = 'saved first'
    binding.value.value = 'unsaved latest'
    await vi.waitFor(() => expect(storageMock.setItem).toHaveBeenCalledTimes(2))
    storageMock.getItem.mockResolvedValue('saved first')
    storageMock.watch.mock.lastCall![1]('saved first')
    const failed = binding.flush()
    latest.reject(new Error('Unavailable'))
    await expect(failed).rejects.toThrow('Unavailable')
    expect(binding.value.value).toBe('unsaved latest')
    storageMock.watch.mock.lastCall![1]('remote change')
    expect(binding.value.value).toBe('unsaved latest')
    storageMock.setItem.mockResolvedValue(undefined)
    storageMock.getItem.mockResolvedValue('unsaved latest')
    await binding.flush({ retry: true })
    expect(storageMock.setItem).toHaveBeenLastCalledWith(
      'local:failedLatest',
      'unsaved latest',
    )
  })

  it('retries a failed initial read before saving a snapshot', async () => {
    const { useStorageBinding } = await import('@/composables/storage')
    storageMock.getItem
      .mockRejectedValueOnce(new Error('Offline'))
      .mockResolvedValue('persisted')
    const binding = useStorageBinding<string>('readRecovery', 'fallback')
    await expect(binding.flush()).rejects.toThrow('Offline')
    await binding.flush({ retry: true })
    expect(binding.value.value).toBe('persisted')
    expect(storageMock.setItem).not.toHaveBeenCalled()
    expect(storageErrors.value['local:readRecovery']).toBeUndefined()
  })

  it('waits for edits queued while retrying a failed write', async () => {
    const { useStorageBinding } = await import('@/composables/storage')
    storageMock.getItem.mockResolvedValue(null)
    storageMock.setItem.mockRejectedValueOnce(new Error('Offline'))
    const binding = useStorageBinding<string>('retryQueue', '')
    await binding.flush()
    binding.value.value = 'first'
    await expect(binding.flush()).rejects.toThrow('Offline')
    const retry = Promise.withResolvers<void>()
    const last = Promise.withResolvers<void>()
    storageMock.setItem
      .mockReturnValueOnce(retry.promise)
      .mockReturnValueOnce(last.promise)
    let settled = false
    const flushing = binding.flush({ retry: true }).then(() => {
      settled = true
    })
    await vi.waitFor(() => expect(storageMock.setItem).toHaveBeenCalledTimes(2))
    binding.value.value = 'last'
    retry.resolve()
    await vi.waitFor(() => expect(storageMock.setItem).toHaveBeenCalledTimes(3))
    expect(settled).toBe(false)
    last.resolve()
    await flushing
    expect(binding.value.value).toBe('last')
  })
  it('exposes failed writes to flush callers and clears the error after recovery', async () => {
    const { useStorageBinding } = await import('@/composables/storage')
    storageMock.getItem.mockResolvedValue(null)
    storageMock.setItem.mockRejectedValueOnce(new Error('Quota exceeded'))
    const binding = useStorageBinding<boolean>('saveFailure', true)
    await nextTick()
    binding.value.value = false
    await expect(binding.flush()).rejects.toThrow('Quota exceeded')
    expect(binding.value.value).toBe(false)
    expect(storageErrors.value['local:saveFailure']).toBe('Quota exceeded')
    storageMock.setItem.mockResolvedValue(undefined)
    await binding.flush({ retry: true })
    expect(storageMock.setItem).toHaveBeenLastCalledWith(
      'local:saveFailure',
      false,
    )
    expect(storageErrors.value['local:saveFailure']).toBeUndefined()
  })
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
    storageMock.getItem.mockResolvedValue(['remote'])
    storageMock.watch.mock.calls.find(([key]) => key === 'local:records')![1]([
      'remote',
    ])
    await flushPromises()
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
    storageMock.getItem.mockResolvedValue(false)
    receive(false)
    await flushPromises()
    expect(value.value).toBe(false)
    storageMock.getItem.mockResolvedValue(null)
    receive(null)
    await flushPromises()
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
    storageMock.getItem
      .mockReturnValueOnce(hydration.promise)
      .mockResolvedValue(false)
    const value = useStorage<boolean>('semi', true)
    storageMock.watch.mock.lastCall![1](false)
    hydration.resolve(true)
    await flushPromises()
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
