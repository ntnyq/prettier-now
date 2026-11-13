import { flushPromises } from '@vue/test-utils'
import * as v from 'valibot'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStorageBinding } from '@/composables/storage'

const state = vi.hoisted(() => ({
  value: { left: 0, right: 0 },
  watchers: new Set<(value: unknown) => void>(),
  getItem: vi.fn(),
  setItem: vi.fn(),
}))
vi.mock('#imports', () => ({
  storage: {
    getItem: () => state.getItem(),
    setItem: (_key: string, value: unknown) => state.setItem(value),
    watch(_key: string, callback: (value: unknown) => void) {
      state.watchers.add(callback)
      return () => state.watchers.delete(callback)
    },
  },
}))

const schema = v.object({ left: v.number(), right: v.number() })

function bindRecord() {
  return useStorageBinding('record', { left: 0, right: 0 }, schema, {
    mergeFields: true,
  })
}

describe('concurrent record persistence', () => {
  beforeEach(() => {
    state.value = { left: 0, right: 0 }
    state.watchers.clear()
    state.getItem
      .mockReset()
      .mockImplementation(async () => structuredClone(state.value))
    state.setItem
      .mockReset()
      .mockImplementation(async (value: typeof state.value) => {
        state.value = structuredClone(value)
        const snapshot = structuredClone(value)
        queueMicrotask(() =>
          state.watchers.forEach(callback => callback(snapshot)),
        )
      })
  })

  it('merges distinct edits and reconciles real storage echoes in both instances', async () => {
    const first = bindRecord()
    const second = bindRecord()
    await Promise.all([first.flush(), second.flush()])
    first.value.value.left = 1
    second.value.value.right = 2
    await Promise.all([first.flush(), second.flush()])
    await flushPromises()
    expect(state.value).toEqual({ left: 1, right: 2 })
    expect(first.value.value).toEqual(state.value)
    expect(second.value.value).toEqual(state.value)
  })

  it('retries a failed field patch without overwriting a different remote edit', async () => {
    const first = bindRecord()
    const second = bindRecord()
    await Promise.all([first.flush(), second.flush()])
    state.setItem.mockRejectedValueOnce(new Error('Offline'))
    first.value.value.left = 1
    await expect(first.flush()).rejects.toThrow('Offline')
    second.value.value.right = 2
    await second.flush()
    expect(first.value.value.left).toBe(1)
    await first.flush({ retry: true })
    expect(state.value).toEqual({ left: 1, right: 2 })
  })

  it('carries a failed patch into the next local edit', async () => {
    const binding = bindRecord()
    await binding.flush()
    state.setItem.mockRejectedValueOnce(new Error('Offline'))
    binding.value.value.left = 1
    await expect(binding.flush()).rejects.toThrow('Offline')
    binding.value.value.right = 3
    await binding.flush()
    expect(state.value).toEqual({ left: 1, right: 3 })
  })

  it('merges edits made before hydration with the latest stored fields', async () => {
    state.value = { left: 0, right: 2 }
    const read = Promise.withResolvers<unknown>()
    state.getItem.mockReturnValueOnce(read.promise)
    const binding = bindRecord()
    binding.value.value.left = 1
    read.resolve({ left: 0, right: 2 })
    await binding.flush()
    expect(state.value).toEqual({ left: 1, right: 2 })
  })

  it('persists an explicit replacement even when it equals the initial fallback', async () => {
    state.value = { left: 1, right: 2 }
    const read = Promise.withResolvers<unknown>()
    state.getItem.mockReturnValueOnce(read.promise)
    const binding = bindRecord()
    binding.set({ left: 0, right: 0 })
    read.resolve({ left: 1, right: 2 })
    await binding.flush()
    expect(state.value).toEqual({ left: 0, right: 0 })
  })
})
