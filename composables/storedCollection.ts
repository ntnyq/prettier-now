import * as v from 'valibot'
import { getCurrentScope, onScopeDispose, shallowRef } from 'vue'
import { storage } from '#imports'
import { reportStorageError } from '@/composables/storageErrors'
import {
  areStorageValuesEqual,
  normalizeStoredArray,
  withStorageLock,
} from '@/utils/storage'
import type { StorageItemKey } from '#imports'
import type { JsonValue } from '@/types/json'
import type { StorageSchema } from '@/types/storage'

/**
 * Observe an existing collection key and serialize read-modify-write operations
 * across extension pages using an origin-scoped Web Lock.
 *
 * @param key - Existing local storage key.
 * @param schema - Validator and migration/normalization for the collection.
 * @returns Current collection and an acknowledged mutation command.
 */
export function useStoredCollection<Item extends JsonValue>(
  key: string,
  schema: StorageSchema<Item[]>,
) {
  const storageKey: StorageItemKey = `local:${key}`
  const items = shallowRef<Item[]>([])

  /**
   * Decode legacy representations and apply collection-specific normalization.
   */
  function parse(input: unknown): Item[] | undefined {
    if (input === null) {
      return []
    }
    const result = v.safeParse(schema, normalizeStoredArray(input))
    return result.success ? result.output : undefined
  }

  /**
   * Keep initialization, repairs and mutations inside the same cross-page lock.
   */
  async function update(
    transform?: (current: Item[]) => Item[],
    options: {
      /**
       * Discard an unrecognized representation only for explicit clearing.
       */
      reset?: boolean
    } = {},
  ) {
    try {
      return await withStorageLock(storageKey, async () => {
        const stored = await storage.getItem<unknown>(storageKey)
        const current = parse(stored)
        if (current === undefined && !options.reset) {
          throw new Error(`Invalid stored collection: ${key}`)
        }
        if (!transform && current !== undefined) {
          // Reading valid legacy data must not depend on a repair write.
          items.value = current
        }
        const next = transform
          ? v.parse(schema, transform(current ?? []))
          : (current ?? [])
        // Detach proxies and snapshot references before calling browser storage.
        // eslint-disable-next-line unicorn/prefer-structured-clone -- callers may supply Vue proxies.
        const snapshot = JSON.parse(JSON.stringify(next)) as Item[]
        if (
          transform
          || (current !== undefined
            && stored !== null
            && !areStorageValuesEqual(stored, snapshot))
        ) {
          await storage.setItem(storageKey, snapshot)
        }
        items.value = snapshot
        reportStorageError(storageKey)
      })
    } catch (error) {
      reportStorageError(storageKey, error)
      throw error
    }
  }

  const stop = storage.watch<unknown>(storageKey, () => {
    // Notifications may lag behind newer reads or writes; re-read under the lock.
    update().catch(() => {})
  })
  if (getCurrentScope()) {
    onScopeDispose(stop)
  }

  // Errors remain visible; explicit mutation commands still reject for callers.
  const ready = update().catch(() => {})

  return {
    items,
    update,
    ready,
  }
}
