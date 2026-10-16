import * as v from 'valibot'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { browser } from '#imports'
import {
  CodeBlockSettingsSchema,
  readCodeBlockSettings,
} from '@/utils/codeBlocks/settings'

/**
 * Explicitly hydrated settings shared by popup and settings UI.
 */
export function useCodeBlockSettings() {
  const settings = ref<v.InferOutput<typeof CodeBlockSettingsSchema>>()
  const hasError = ref(false)
  const isSaving = ref(false)
  let disposed = false
  async function refresh() {
    try {
      const result = await readCodeBlockSettings()
      if (!disposed) {
        settings.value = result
        hasError.value = false
      }
    } catch {
      if (!disposed) {
        hasError.value = true
      }
    }
  }
  async function save(value: v.InferOutput<typeof CodeBlockSettingsSchema>) {
    isSaving.value = true
    try {
      await browser.storage.local.set(v.parse(CodeBlockSettingsSchema, value))
      await refresh()
    } catch {
      hasError.value = true
    } finally {
      isSaving.value = false
    }
  }
  function changed(_changes: unknown, area: string) {
    if (area === 'local') {
      refresh()
    }
  }
  onMounted(() => {
    refresh()
    browser.storage.onChanged.addListener(changed)
  })
  onBeforeUnmount(() => {
    disposed = true
    browser.storage.onChanged.removeListener(changed)
  })
  return { settings, hasError, isSaving, save, refresh }
}
