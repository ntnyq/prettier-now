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

type StorageSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>

export function useStorage<V extends JsonValue>(key: string): Ref<V | null>
export function useStorage<V extends JsonValue>(
  key: string,
  defaultValue: V,
): Ref<V>
export function useStorage<V extends JsonValue>(
  key: string,
  defaultValue: V,
  schema: StorageSchema,
): Ref<V>
export function useStorage<V extends JsonValue>(
  key: string,
  defaultValue?: V,
  schema?: StorageSchema,
): Ref<V | null> {
  const syncKey: StorageItemKey = `local:${key}`
  const value = ref(
    defaultValue === undefined ? null : defaultValue,
  ) as Ref<V | null>
  let isHydrated = false
  let isApplyingHydratedValue = false
  let hasLocalMutationBeforeHydration = false

  function parseStorageValue(storageValue: unknown) {
    if (!schema) {
      return storageValue as V
    }

    const result = v.safeParse(schema, storageValue)
    return result.success ? (result.output as V) : undefined
  }

  async function syncStorage() {
    const storageValue = await storage.getItem<unknown>(syncKey)
    if (storageValue !== null && !hasLocalMutationBeforeHydration) {
      const parsedValue = parseStorageValue(storageValue)

      if (parsedValue !== undefined) {
        isApplyingHydratedValue = true
        value.value = parsedValue
        isApplyingHydratedValue = false
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
    if (isApplyingHydratedValue) {
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
