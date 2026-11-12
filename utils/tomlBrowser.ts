/**
 * Browser implementation of the tombit formatting API used by Prettier.
 */

import init, { format as formatToml } from '@tombi-toml/wasm-lib'
import type { FormatResult } from '@tombi-toml/wasm-lib'

/**
 * In-memory configuration supplied by prettier-plugin-toml.
 */
interface TombiBrowserOptions {
  /**
   * Explicit formatter configuration; extension pages do not discover files.
   */
  overrideConfig?: {
    /**
     * TOML syntax version selected by the plugin.
     */
    'toml-version'?: string
    /**
     * Formatting rules translated from Prettier's options.
     */
    format?: {
      /**
       * Tombi rule names and their scalar values.
       */
      rules?: Record<string, string | number | boolean>
    }
  }
}

/**
 * Shared initialization promise for concurrent formatting requests.
 */
let initialization: ReturnType<typeof init> | undefined

/**
 * Format TOML without native addons, shared memory, or WASI worker pools.
 *
 * @param source - TOML source to format.
 * @param sourcePath - Virtual filename used by Tombi's diagnostics.
 * @param options - Explicit configuration supplied by the Prettier plugin.
 * @returns Formatted source and syntax diagnostics.
 */
export async function format(
  source: string,
  sourcePath: string,
  options?: TombiBrowserOptions,
): Promise<FormatResult> {
  initialization ??= init()
  await initialization

  const config = options?.overrideConfig
  const version = config?.['toml-version']
  const rules = config?.format?.rules ?? {}
  const configText = [
    ...(version ? [`toml-version = ${JSON.stringify(version)}`] : []),
    '[schema]',
    'enabled = false',
    '[format.rules]',
    ...Object.entries(rules).map(
      ([name, value]) => `${JSON.stringify(name)} = ${JSON.stringify(value)}`,
    ),
  ].join('\n')

  return formatToml(source, sourcePath, { config: configText })
}
