import type { JsonObject } from '@/types/json'
import type {
  PluginJavaOptions,
  PluginPHPOptions,
  PluginSvelteOptions,
  PluginTOMLOptions,
  PluginXMLOptions,
  PrettierOptions,
} from '@/types/options'

export interface OptionsSnapshot extends JsonObject {
  javaPluginOptions: PluginJavaOptions
  options: PrettierOptions
  phpPluginOptions: PluginPHPOptions
  sveltePluginOptions: PluginSvelteOptions
  tomlPluginOptions: PluginTOMLOptions
  version: 1
  xmlPluginOptions: PluginXMLOptions
}

export interface OptionsPreset extends JsonObject {
  createdAt: number
  id: string
  name: string
  snapshot: OptionsSnapshot
  updatedAt: number
}
