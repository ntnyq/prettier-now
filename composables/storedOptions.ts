import { computed } from 'vue'
import { useStorageBinding } from '@/composables/storage'
import type { Ref } from 'vue'
import type { JsonValue } from '@/types/json'
import type { StorageSchema } from '@/types/storage'

/**
 * Bind a finite option group to its existing per-option storage keys.
 *
 * @param defaults - Default values keyed by their persisted option names.
 * @param schemas - Runtime validators for the same option names.
 * @returns Individual bindings, the current group and a snapshot setter.
 */
export function useStoredOptions<
  Options extends { [Key in keyof Options]: JsonValue },
>(
  defaults: Options,
  schemas: { [Key in keyof Options]: StorageSchema<Options[Key]> },
) {
  const keys = Object.keys(defaults) as (keyof Options & string)[]
  const bindings = keys.map(key =>
    useStorageBinding(key, defaults[key], schemas[key]),
  )
  const fields = Object.fromEntries(
    keys.map((key, index) => [key, bindings[index]!.value]),
  ) as { [Key in keyof Options]: Ref<Options[Key]> }

  const options = computed(() => {
    const snapshot = { ...defaults }
    for (const key of keys) {
      snapshot[key] = fields[key].value
    }
    return snapshot
  })

  /**
   * Apply a validated snapshot without changing persisted key names.
   *
   * @param snapshot - Values for this option group.
   */
  function apply(snapshot: Options) {
    for (const [index, key] of keys.entries()) {
      bindings[index]!.set(snapshot[key])
    }
  }

  return {
    fields,
    options,
    apply,
    flush() {
      return Promise.all(
        bindings.map(binding => binding.flush({ retry: true })),
      )
    },
  }
}
