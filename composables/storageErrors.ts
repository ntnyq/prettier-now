import { shallowRef } from 'vue'

/**
 * Current storage failures by key, retained until that key succeeds again.
 */
export const storageErrors = shallowRef<Record<string, string>>({})

/**
 * Report or clear a persistence failure without depending on application stores.
 *
 * @param key - Persisted storage key.
 * @param error - Failure to expose, or undefined after successful persistence.
 */
export function reportStorageError(key: string, error?: unknown) {
  const errors = { ...storageErrors.value }
  if (error === undefined) {
    delete errors[key]
  } else {
    errors[key] =
      error instanceof Error ? error.message : 'Failed to save storage'
  }
  storageErrors.value = errors
}
