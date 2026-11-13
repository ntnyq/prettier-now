import { flushPromises } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { storageErrors } from '@/composables/storageErrors'
import { useHistoryStore } from '@/stores/history'
import { createFormatHistoryEntry } from '@/utils/history'

const saved = vi.hoisted(() => new Map<string, unknown>())
const storageMock = vi.hoisted(() => ({
  getItem: vi.fn(
    async (key: string): Promise<unknown> => saved.get(key) ?? null,
  ),
  setItem: vi.fn(async (key: string, value: unknown) => {
    saved.set(key, structuredClone(value))
  }),
  watch: vi.fn((_key: string, _callback: (value: unknown) => void) => vi.fn()),
}))
vi.mock('#imports', () => ({
  storage: storageMock,
}))

function input(fileName: string) {
  return {
    fileName,
    languageId: 'javascript' as const,
    sourceCode: 'x',
    resultCode: 'x\n',
    formatCost: 0,
  }
}

describe('persisted history operations', () => {
  beforeEach(() => {
    saved.clear()
    storageMock.setItem.mockClear()
    storageMock.getItem.mockImplementation(async key => saved.get(key) ?? null)
    storageMock.setItem.mockImplementation(async (key, value) => {
      saved.set(key, structuredClone(value))
    })
  })

  it('retains additions from independent windows', async () => {
    const first = useHistoryStore(createPinia())
    const second = useHistoryStore(createPinia())
    await flushPromises()
    await Promise.all([
      first.addEntry(input('a.js')),
      second.addEntry(input('b.js')),
    ])
    await flushPromises()
    expect(saved.get('local:formatHistory')).toEqual([
      expect.objectContaining({ fileName: 'b.js' }),
      expect.objectContaining({ fileName: 'a.js' }),
    ])
  })

  it('keeps stored entries when adding before initialization finishes', async () => {
    const previous = createFormatHistoryEntry(input('previous.js'))
    saved.set('local:formatHistory', [previous])
    const read = Promise.withResolvers<unknown>()
    storageMock.getItem.mockReturnValueOnce(read.promise)
    const store = useHistoryStore(createPinia())
    const adding = store.addEntry(input('new.js'))
    read.resolve([previous])
    await adding
    await flushPromises()
    expect(saved.get('local:formatHistory')).toEqual([
      expect.objectContaining({ fileName: 'new.js' }),
      previous,
    ])
  })

  it('serializes deletion and clear with additions from another window', async () => {
    const first = useHistoryStore(createPinia())
    const second = useHistoryStore(createPinia())
    await first.addEntry(input('old.js'))
    const oldId = first.entries[0]!.id
    await Promise.all([
      second.addEntry(input('new.js')),
      first.removeEntry(oldId),
    ])
    expect(saved.get('local:formatHistory')).toEqual([
      expect.objectContaining({ fileName: 'new.js' }),
    ])
    await Promise.all([
      first.clearHistory(),
      second.addEntry(input('after-clear.js')),
    ])
    expect(saved.get('local:formatHistory')).toEqual([
      expect.objectContaining({ fileName: 'after-clear.js' }),
    ])
  })

  it('rejects failed writes without losing the last acknowledged entries and allows retry', async () => {
    const store = useHistoryStore(createPinia())
    await store.addEntry(input('saved.js'))
    const original = [...store.entries]
    storageMock.setItem.mockRejectedValueOnce(new Error('Quota exceeded'))
    await expect(store.addEntry(input('unsaved.js'))).rejects.toThrow(
      'Quota exceeded',
    )
    expect(store.entries).toEqual(original)
    expect(storageErrors.value['local:formatHistory']).toBe('Quota exceeded')
    await store.addEntry(input('retry.js'))
    expect(store.entries.map(entry => entry.fileName)).toEqual([
      'retry.js',
      'saved.js',
    ])
    expect(storageErrors.value['local:formatHistory']).toBeUndefined()
  })

  it('repairs numeric-key legacy arrays under the same lock', async () => {
    const previous = createFormatHistoryEntry(input('legacy.js'))
    saved.set('local:formatHistory', { 0: previous })
    const store = useHistoryStore(createPinia())
    await flushPromises()
    expect(store.entries).toEqual([previous])
    expect(saved.get('local:formatHistory')).toEqual([previous])
  })

  it('keeps legacy history readable when its repair write fails', async () => {
    const entry = createFormatHistoryEntry(input('legacy.js'))
    saved.set('local:formatHistory', { 0: entry })
    storageMock.setItem.mockRejectedValueOnce(new Error('Quota exceeded'))
    const store = useHistoryStore(createPinia())
    await flushPromises()
    expect(store.entries).toEqual([entry])
    expect(saved.get('local:formatHistory')).toEqual({ 0: entry })
    await store.addEntry(input('new.js'))
    expect(store.entries.map(item => item.fileName)).toEqual([
      'new.js',
      'legacy.js',
    ])
  })

  it('does not replace unrecognized stored data when adding an entry', async () => {
    const original = [
      createFormatHistoryEntry(input('valid.js')),
      { version: 99 },
    ]
    saved.set('local:formatHistory', original)
    const store = useHistoryStore(createPinia())
    await flushPromises()
    await expect(store.addEntry(input('new.js'))).rejects.toThrow()
    expect(saved.get('local:formatHistory')).toEqual(original)
    await store.clearHistory()
    expect(saved.get('local:formatHistory')).toEqual([])
  })

  it('re-reads current storage instead of applying a delayed change payload', async () => {
    const store = useHistoryStore(createPinia())
    await store.addEntry(input('older.js'))
    const old = [...store.entries]
    await store.addEntry(input('newer.js'))
    storageMock.watch.mock.lastCall![1](old)
    await flushPromises()
    expect(store.entries.map(item => item.fileName)).toEqual([
      'newer.js',
      'older.js',
    ])
  })

  it('observes remote changes and unsubscribes when the store is disposed', async () => {
    const store = useHistoryStore(createPinia())
    await flushPromises()
    const receive = storageMock.watch.mock.lastCall![1]
    const entry = createFormatHistoryEntry(input('remote.js'))
    saved.set('local:formatHistory', [entry])
    receive([entry])
    await flushPromises()
    expect(store.entries).toEqual([entry])
    saved.set('local:formatHistory', 'invalid')
    receive('invalid')
    await flushPromises()
    expect(store.entries).toEqual([entry])
    saved.delete('local:formatHistory')
    receive(null)
    await flushPromises()
    expect(store.entries).toEqual([])
    expect(storageMock.setItem).not.toHaveBeenCalled()
    const stop = storageMock.watch.mock.results.at(-1)!.value
    store.$dispose()
    expect(stop).toHaveBeenCalledOnce()
  })

  it('does not rewrite invalid collections during initialization', async () => {
    saved.set('local:formatHistory', ['invalid'])
    const store = useHistoryStore(createPinia())
    await flushPromises()
    expect(store.entries).toEqual([])
    expect(saved.get('local:formatHistory')).toEqual(['invalid'])
    expect(storageMock.setItem).not.toHaveBeenCalled()
  })
})
