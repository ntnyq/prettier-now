import type { JsonObject } from '@/types/json'
import type {
  PluginJavaOptions,
  PluginPHPOptions,
  PluginSvelteOptions,
  PluginTOMLOptions,
  PluginXMLOptions,
  PrettierOptions,
} from '@/types/options'

/**
 * Versioned snapshot of all formatting options.
 */
export interface OptionsSnapshot extends JsonObject {
  /**
   * Java plugin option values.
   */
  javaPluginOptions: PluginJavaOptions

  /**
   * Core Prettier option values.
   */
  options: PrettierOptions

  /**
   * PHP plugin option values.
   */
  phpPluginOptions: PluginPHPOptions

  /**
   * Svelte plugin option values.
   */
  sveltePluginOptions: PluginSvelteOptions

  /**
   * TOML plugin option values.
   */
  tomlPluginOptions: PluginTOMLOptions

  /**
   * Snapshot schema version.
   */
  version: 1

  /**
   * XML plugin option values.
   */
  xmlPluginOptions: PluginXMLOptions
}

/**
 * Named formatting options preset.
 */
export interface OptionsPreset extends JsonObject {
  /**
   * Unix timestamp for when the preset was created.
   */
  createdAt: number

  /**
   * Stable preset identifier.
   */
  id: string

  /**
   * User-facing preset name.
   */
  name: string

  /**
   * Formatting options captured by the preset.
   */
  snapshot: OptionsSnapshot

  /**
   * Unix timestamp for when the preset was last updated.
   */
  updatedAt: number
}
