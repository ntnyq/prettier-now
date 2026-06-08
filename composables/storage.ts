/**
 * @file useStorage
 */

import { ref, watch } from 'vue'
import { storage } from '#imports'
import { Logger } from '@/utils/logger'
import type { Ref } from 'vue'
import type { StorageItemKey } from '#imports'
import type { JsonValue } from '@/types/json'

export function useStorage<V extends JsonValue>(key: string): Ref<V | null>
export function useStorage<V extends JsonValue>(
  key: string,
  defaultValue: V,
): Ref<V>
export function useStorage<V extends JsonValue>(
  key: string,
  defaultValue?: V,
): Ref<V | null> {
  const syncKey: StorageItemKey = `local:${key}`
  const value = ref(
    defaultValue === undefined ? null : defaultValue,
  ) as Ref<V | null>
  let isHydrated = false
  let isApplyingHydratedValue = false
  let hasLocalMutationBeforeHydration = false

  async function syncStorage() {
    const storageValue = await storage.getItem<V>(syncKey)
    if (storageValue !== null && !hasLocalMutationBeforeHydration) {
      isApplyingHydratedValue = true
      value.value = storageValue
      isApplyingHydratedValue = false
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

    await storage.setItem(syncKey, value.value)
  })

  return value
}
