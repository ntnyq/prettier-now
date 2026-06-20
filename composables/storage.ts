/**
 * @file useStorage
 */

import * as v from 'valibot'
import { ref, watch } from 'vue'
import { storage } from '#imports'
import { Logger } from '@/utils/logger'
import type { Ref } from 'vue'
import type { StorageItemKey } from '#imports'
import type { JsonValue } from '@/types/json'

type StorageSchema<V extends JsonValue> = v.BaseSchema<
  unknown,
  V,
  v.BaseIssue<unknown>
>

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
  const value = ref(
    defaultValue === undefined ? null : defaultValue,
  ) as Ref<V | null>
  let isHydrated = false
  let shouldSkipNextWrite = false
  let hasLocalMutationBeforeHydration = false

  function parseStorageValue(storageValue: unknown) {
    if (!schema) {
      return storageValue as V
    }

    const result = v.safeParse(schema, storageValue)
    return result.success ? result.output : undefined
  }

  async function syncStorage() {
    const storageValue = await storage.getItem<unknown>(syncKey)
    if (storageValue !== null && !hasLocalMutationBeforeHydration) {
      const parsedValue = parseStorageValue(storageValue)

      if (parsedValue !== undefined && value.value !== parsedValue) {
        shouldSkipNextWrite = true
        value.value = parsedValue
      }
    }

    isHydrated = true

    if (hasLocalMutationBeforeHydration) {
      await storage.setItem(syncKey, value.value)
    }
  }

  syncStorage().catch((err: unknown) => {
    const message = (err as Error)?.message || 'Failed to sync storage'
    Logger.error(message)
  })

  watch(value, async () => {
    if (shouldSkipNextWrite) {
      shouldSkipNextWrite = false
      return
    }

    if (!isHydrated) {
      hasLocalMutationBeforeHydration = true
      return
    }

    try {
      await storage.setItem(syncKey, value.value)
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Failed to write storage'
      Logger.error(message)
    }
  })

  return value
}
