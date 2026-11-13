/**
 * @file useStorage
 */

import * as v from 'valibot'
import { getCurrentScope, onScopeDispose, ref, watch } from 'vue'
import { storage } from '#imports'
import { reportStorageError } from '@/composables/storageErrors'
import {
  getStorageFieldChanges,
  normalizeStoredArray,
  withStorageLock,
} from '@/utils/storage'
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
  return useStorageBinding(key, defaultValue ?? null, schema).value
}

/**
 * Bind an existing key and expose a flush command that acknowledges writes.
 *
 * @param key - Persisted option name.
 * @param defaultValue - Fallback when no valid stored value exists.
 * @param schema - Optional runtime validator.
 * @param options - Persistence behavior for this existing key.
 * @param options.mergeFields - Merge nested edits while keeping replacements explicit.
 * @param options.read - Read compatible data without requiring a migration write.
 * @returns Reactive value and a command to await initialization and persistence.
 */
export function useStorageBinding<V extends JsonValue>(
  key: string,
  defaultValue: V,
  schema?: StorageSchema<V>,
  options: {
    /**
     * Merge nested field edits under a lock; root assignments still replace.
     */
    mergeFields?: boolean
    /**
     * Read a compatible legacy representation without requiring repair writes.
     */
    read?: () => Promise<unknown>
  } = {},
) {
  const syncKey: StorageItemKey = `local:${key}`
  const fallback = cloneStorageValue(defaultValue)
  const value = ref(cloneStorageValue(fallback)) as Ref<V>
  let observedSnapshot = cloneStorageValue(fallback)
  let unhydratedPatch: Record<string, unknown> | undefined = {}
  let failedPatch: Record<string, unknown> | undefined
  let writeError: unknown
  let hasFailedWrite = false
  let readError: unknown
  let hasReadError = false
  let localRevision = 0
  let isHydrated = false
  let isApplyingStorageValue = false
  let hasLocalMutationBeforeHydration = false
  let storageRevision = 0
  let pendingWrites = 0
  let needsStorageRefresh = false
  let writeQueue = Promise.resolve()
  let refreshQueue = Promise.resolve()

  /**
   * Read current data through the key's optional compatibility reader.
   */
  function readStorageValue() {
    return options.read ? options.read() : storage.getItem<unknown>(syncKey)
  }

  /**
   * Snapshot JSON data without retaining Vue proxies or mutable references.
   */
  function cloneStorageValue(input: V): V {
    // eslint-disable-next-line unicorn/prefer-structured-clone -- structuredClone rejects Vue proxies.
    return JSON.parse(JSON.stringify(input)) as V
  }

  /**
   * Recover arrays serialized as numeric-key objects by older Chromium builds.
   */
  function normalizeStorageValue(input: unknown) {
    return Array.isArray(fallback) ? normalizeStoredArray(input) : input
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
  function applyStorageValue(input: V) {
    isApplyingStorageValue = true
    try {
      value.value = cloneStorageValue(input)
      observedSnapshot = cloneStorageValue(input)
    } finally {
      isApplyingStorageValue = false
    }
  }

  /**
   * A successful read restores readiness without hiding an unsaved local edit.
   */
  function acknowledgeRead() {
    readError = undefined
    hasReadError = false
    if (!hasFailedWrite) {
      reportStorageError(syncKey)
    }
  }

  /**
   * Recover remote updates ignored while local writes were still settling.
   */
  async function reconcileStorageValue() {
    if (pendingWrites || hasFailedWrite || !needsStorageRefresh) {
      return
    }
    needsStorageRefresh = false
    const revision = storageRevision
    const editRevision = localRevision
    try {
      const stored = await readStorageValue()
      if (
        pendingWrites
        || hasFailedWrite
        || revision !== storageRevision
        || editRevision !== localRevision
      ) {
        return
      }
      const parsedValue = stored === null ? fallback : parseStorageValue(stored)
      if (parsedValue !== undefined) {
        applyStorageValue(parsedValue)
      }
      acknowledgeRead()
    } catch (error) {
      if (
        pendingWrites
        || hasFailedWrite
        || revision !== storageRevision
        || editRevision !== localRevision
      ) {
        return
      }
      readError = error
      hasReadError = true
      reportStorageError(syncKey, error)
      console.error(
        error instanceof Error ? error.message : 'Failed to refresh storage',
      )
    }
  }

  /**
   * Persist immutable snapshots in order, ignoring stale echoes while writing.
   */
  function persistStorageValue(patch?: Record<string, unknown>) {
    const snapshot = cloneStorageValue(value.value)
    let attemptedPatch: Record<string, unknown> | undefined
    pendingWrites += 1
    writeQueue = writeQueue
      .then(async () => {
        attemptedPatch =
          patch === undefined || (hasFailedWrite && failedPatch === undefined)
            ? undefined
            : { ...(hasFailedWrite ? failedPatch : {}), ...patch }
        if (!options.mergeFields) {
          await storage.setItem(syncKey, snapshot)
          return
        }
        await withStorageLock(syncKey, async () => {
          if (attemptedPatch === undefined) {
            await storage.setItem(syncKey, snapshot)
            return
          }
          const stored = await readStorageValue()
          const current =
            stored === null ? fallback : (parseStorageValue(stored) ?? fallback)
          const merged = Object.assign({}, current, attemptedPatch)
          const validated = schema ? v.parse(schema, merged) : merged
          await storage.setItem(syncKey, validated)
        })
        needsStorageRefresh = true
      })
      .then(() => {
        writeError = undefined
        hasFailedWrite = false
        failedPatch = undefined
        readError = undefined
        hasReadError = false
        reportStorageError(syncKey)
      })
      .catch((error: unknown) => {
        writeError = error
        hasFailedWrite = true
        failedPatch = attemptedPatch
        reportStorageError(syncKey, error)
        console.error((error as Error)?.message || 'Failed to write storage')
      })
      .finally(() => {
        pendingWrites -= 1
        return reconcileStorageValue()
      })
    return writeQueue
  }

  const stopStorageWatch = storage.watch<unknown>(syncKey, () => {
    storageRevision += 1
    needsStorageRefresh = true
    if (pendingWrites || hasFailedWrite) {
      needsStorageRefresh = true
      return
    }
    if (hasLocalMutationBeforeHydration) {
      return
    }
    refreshQueue = reconcileStorageValue()
  })

  if (getCurrentScope()) {
    onScopeDispose(stopStorageWatch)
  }

  async function syncStorage() {
    const revision = storageRevision
    const editRevision = localRevision
    let storageValue: unknown
    try {
      storageValue = await readStorageValue()
    } catch (error) {
      isHydrated = true
      if (
        (revision !== storageRevision || editRevision !== localRevision)
        && !hasLocalMutationBeforeHydration
      ) {
        return
      }
      throw error
    }
    let shouldRepairArray = false
    if (
      storageValue !== null
      && !hasLocalMutationBeforeHydration
      && revision === storageRevision
      && editRevision === localRevision
      && !pendingWrites
      && !hasFailedWrite
    ) {
      const parsedValue = parseStorageValue(storageValue)

      if (parsedValue !== undefined) {
        applyStorageValue(parsedValue)
        shouldRepairArray =
          Array.isArray(parsedValue) && !Array.isArray(storageValue)
      }
    }

    isHydrated = true
    if (revision === storageRevision && editRevision === localRevision) {
      acknowledgeRead()
    }

    if (hasLocalMutationBeforeHydration || shouldRepairArray) {
      hasLocalMutationBeforeHydration = false
      await persistStorageValue(
        options.mergeFields ? unhydratedPatch : undefined,
      )
      unhydratedPatch = {}
    }
  }

  /**
   * Preserve read failures for an explicit retry without inventing stored data.
   */
  function handleReadError(error: unknown) {
    isHydrated = true
    readError = error
    hasReadError = true
    reportStorageError(syncKey, error)
    if (hasLocalMutationBeforeHydration) {
      hasLocalMutationBeforeHydration = false
      persistStorageValue(options.mergeFields ? unhydratedPatch : undefined)
      unhydratedPatch = {}
    }
    const message = (error as Error)?.message || 'Failed to sync storage'
    console.error(message)
  }

  const ready = syncStorage().catch(handleReadError)

  /**
   * Record an explicit replacement even when it equals the visible fallback.
   *
   * @param input - Complete value selected by an apply/reset command.
   */
  function set(input: V) {
    localRevision += 1
    applyStorageValue(input)
    if (!isHydrated) {
      hasLocalMutationBeforeHydration = true
      unhydratedPatch = undefined
      return
    }
    persistStorageValue()
  }

  watch(
    value,
    (next, previous) => {
      if (isApplyingStorageValue) {
        return
      }
      localRevision += 1
      const snapshot = cloneStorageValue(next)
      const patch =
        options.mergeFields && next === previous
          ? getStorageFieldChanges(observedSnapshot, snapshot)
          : undefined
      observedSnapshot = snapshot

      if (!isHydrated) {
        hasLocalMutationBeforeHydration = true
        unhydratedPatch =
          patch === undefined || unhydratedPatch === undefined
            ? undefined
            : { ...unhydratedPatch, ...patch }
        return
      }

      persistStorageValue(patch)
    },
    { deep: true, flush: 'sync' },
  )

  /**
   * Await queued writes and reject when the latest value was not persisted.
   */
  async function flush(
    options: {
      /**
       * Retry the current value after an earlier write failed.
       */
      retry?: boolean
    } = {},
  ) {
    await ready
    let hasRetriedWrite = false
    let hasRetriedRead = false
    for (;;) {
      const pending = writeQueue
      const refreshing = refreshQueue
      await Promise.all([pending, refreshing])
      if (pending !== writeQueue || refreshing !== refreshQueue) {
        continue
      }
      if (options.retry && hasFailedWrite && !hasRetriedWrite) {
        hasRetriedWrite = true
        persistStorageValue(failedPatch)
        continue
      }
      if (hasFailedWrite) {
        throw writeError
      }
      if (options.retry && hasReadError && !hasRetriedRead) {
        hasRetriedRead = true
        await syncStorage().catch(handleReadError)
        continue
      }
      if (hasReadError) {
        throw readError
      }
      return
    }
  }

  return {
    value,
    set,
    flush,
  }
}
