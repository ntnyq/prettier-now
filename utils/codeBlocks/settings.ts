import * as v from 'valibot'
import { browser } from '#imports'

/**
 * Exact hostnames only, including IDN normalization by the URL parser.
 */
export function normalizeCodeBlockHostname(value: string) {
  const input = value.trim().toLowerCase().replace(/\.$/, '')
  if (!input || /[\s/@?#:*]/.test(input)) {
    return undefined
  }
  try {
    const url = new URL(`https://${input}`)
    return url.hostname && url.pathname === '/' ? url.hostname : undefined
  } catch {
    return undefined
  }
}
/**
 * Persisted feature settings, hydrated before any automatic page work.
 */
export const CodeBlockSettingsSchema = v.object({
  codeBlockButtons: v.optional(v.boolean(), true),
  codeBlockHiddenHosts: v.optional(
    v.pipe(
      v.array(
        v.pipe(
          v.string(),
          v.maxLength(253),
          v.check(value => normalizeCodeBlockHostname(value) === value),
        ),
      ),
      v.maxLength(200),
    ),
    [],
  ),
})
/**
 * Read settings with explicit errors instead of flashing enabled defaults.
 */
export async function readCodeBlockSettings() {
  return v.parse(
    CodeBlockSettingsSchema,
    await browser.storage.local.get([
      'codeBlockButtons',
      'codeBlockHiddenHosts',
    ]),
  )
}
