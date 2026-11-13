/**
 * @file useStorage
 */

import * as v from 'valibot'
import { getCurrentScope, onScopeDispose, ref, watch } from 'vue'
import { storage } from '#imports'
import type { Ref } from 'vue'
import type { StorageItemKey } from '#imports'
import type { JsonValue } from '@/types/json'
import type { StorageSchema } from '@/types/storage'

export function useStorage<V extends JsonValue>(key: string): Ref<V | null>
export function useStorage<V extends JsonValue>(
  key: string,
  defaultValue: V,
): Ref<V>
export function useStorage<V extends JsonValue>(
  key: string,
  defaultValue: V,
  schema: StorageSchema<V>,
): Ref<V>
export function useStorage<V extends JsonValue>(
  key: string,
  defaultValue?: V,
  schema?: StorageSchema<V>,
): Ref<V | null> {
  const syncKey: StorageItemKey = `local:${key}`
  const fallback = cloneStorageValue(defaultValue ?? null)
  const value = ref(cloneStorageValue(fallback)) as Ref<V | null>
  let isHydrated = false
  let isApplyingStorageValue = false
  let hasLocalMutationBeforeHydration = false
  let storageRevision = 0
  let pendingWrites = 0
  let needsStorageRefresh = false
  let writeQueue = Promise.resolve()

  /**
   * Snapshot JSON data without retaining Vue proxies or mutable references.
   */
  function cloneStorageValue(input: V | null): V | null {
    // eslint-disable-next-line unicorn/prefer-structured-clone -- structuredClone rejects Vue proxies.
    return JSON.parse(JSON.stringify(input)) as V | null
  }

  /**
   * Recover arrays serialized as numeric-key objects by older Chromium builds.
   */
  function normalizeStorageValue(input: unknown) {
    if (
      Array.isArray(fallback)
      && input !== null
      && typeof input === 'object'
      && !Array.isArray(input)
    ) {
      const entries = Object.entries(input)
      if (entries.every(([key], index) => key === String(index))) {
        return entries.map(([, item]) => item)
      }
    }
    return input
  }

  function parseStorageValue(storageValue: unknown) {
    const normalized = normalizeStorageValue(storageValue)
    if (!schema) {
      return normalized as V
    }

    const result = v.safeParse(schema, normalized)
    return result.success ? result.output : undefined
  }

  /**
   * Apply remote data synchronously so the local watcher cannot echo it back.
   */
  function applyStorageValue(input: V | null) {
    isApplyingStorageValue = true
    try {
      value.value = cloneStorageValue(input)
    } finally {
      isApplyingStorageValue = false
    }
  }

  /**
   * Recover remote updates ignored while local writes were still settling.
   */
  async function reconcileStorageValue() {
    if (pendingWrites || !needsStorageRefresh) {
      return
    }
    needsStorageRefresh = false
    const revision = storageRevision
    try {
      const stored = await storage.getItem<unknown>(syncKey)
      if (pendingWrites || revision !== storageRevision) {
        return
      }
      const parsedValue = stored === null ? fallback : parseStorageValue(stored)
      if (parsedValue !== undefined) {
        applyStorageValue(parsedValue)
      }
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : 'Failed to refresh storage',
      )
    }
  }

  /**
   * Persist immutable snapshots in order, ignoring stale echoes while writing.
   */
  function persistStorageValue() {
    const snapshot = cloneStorageValue(value.value)
    pendingWrites += 1
    writeQueue = writeQueue
      .then(() => storage.setItem(syncKey, snapshot))
      .catch((error: unknown) => {
        console.error((error as Error)?.message || 'Failed to write storage')
      })
      .finally(() => {
        pendingWrites -= 1
        return reconcileStorageValue()
      })
    return writeQueue
  }

  const stopStorageWatch = storage.watch<unknown>(syncKey, storageValue => {
    storageRevision += 1
    if (pendingWrites) {
      needsStorageRefresh = true
      return
    }
    if (hasLocalMutationBeforeHydration) {
      return
    }
    const parsedValue =
      storageValue === null ? fallback : parseStorageValue(storageValue)
    if (parsedValue !== undefined) {
      applyStorageValue(parsedValue)
    }
  })

  if (getCurrentScope()) {
    onScopeDispose(stopStorageWatch)
  }

  async function syncStorage() {
    const revision = storageRevision
    const storageValue = await storage.getItem<unknown>(syncKey)
    let shouldRepairArray = false
    if (
      storageValue !== null
      && !hasLocalMutationBeforeHydration
      && revision === storageRevision
    ) {
      const parsedValue = parseStorageValue(storageValue)

      if (parsedValue !== undefined) {
        applyStorageValue(parsedValue)
        shouldRepairArray =
          Array.isArray(parsedValue) && !Array.isArray(storageValue)
      }
    }

    isHydrated = true

    if (hasLocalMutationBeforeHydration || shouldRepairArray) {
      hasLocalMutationBeforeHydration = false
      await persistStorageValue()
    }
  }

  syncStorage().catch((error: unknown) => {
    isHydrated = true
    if (hasLocalMutationBeforeHydration) {
      hasLocalMutationBeforeHydration = false
      persistStorageValue()
    }
    const message = (error as Error)?.message || 'Failed to sync storage'
    console.error(message)
  })

  watch(
    value,
    () => {
      if (isApplyingStorageValue) {
        return
      }

      if (!isHydrated) {
        hasLocalMutationBeforeHydration = true
        return
      }

      persistStorageValue()
    },
    { deep: true, flush: 'sync' },
  )

  return value
}
