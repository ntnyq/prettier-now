import { resolveLanguageParser } from '@/utils/languageInference'
import type { LanguageId } from '@/types/language'
import type { OptionsSnapshot } from '@/types/optionsPreset'
import type { FormatOptions } from '@/utils/format'

/**
 * Resolve one language's runtime options from a validated settings snapshot.
 *
 * @param snapshot - Core and plugin preferences.
 * @param languageId - Language to format.
 * @returns Options for the standalone Prettier runner.
 */
export function resolveFormatOptions(
  snapshot: OptionsSnapshot,
  languageId: LanguageId,
): FormatOptions {
  return {
    ...snapshot.options,
    ...snapshot.xmlPluginOptions,
    ...snapshot.phpPluginOptions,
    ...snapshot.javaPluginOptions,
    ...snapshot.sveltePluginOptions,
    ...snapshot.tomlPluginOptions,
    languageId,
    parser: resolveLanguageParser(languageId),
  }
}
