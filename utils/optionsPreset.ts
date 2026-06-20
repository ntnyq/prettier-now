import {
  DEFAULT_JAVA_OPTIONS,
  DEFAULT_OPTIONS,
  DEFAULT_PHP_OPTIONS,
  DEFAULT_SVELTE_OPTIONS,
  DEFAULT_TOML_OPTIONS,
  DEFAULT_XML_OPTIONS,
} from '@/constants/options'
import type { OptionsPreset, OptionsSnapshot } from '@/types/optionsPreset'

const OPTIONS_SNAPSHOT_VERSION = 1
const OPTIONS_SNAPSHOT_KEYS = [
  'options',
  'xmlPluginOptions',
  'phpPluginOptions',
  'javaPluginOptions',
  'sveltePluginOptions',
  'tomlPluginOptions',
] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasKeys(value: unknown, keys: string[]) {
  if (!isRecord(value)) {
    return false
  }

  return keys.every(key => key in value)
}

export function createDefaultOptionsSnapshot() {
  return {
    version: OPTIONS_SNAPSHOT_VERSION,
    options: { ...DEFAULT_OPTIONS },
    xmlPluginOptions: { ...DEFAULT_XML_OPTIONS },
    phpPluginOptions: { ...DEFAULT_PHP_OPTIONS },
    javaPluginOptions: { ...DEFAULT_JAVA_OPTIONS },
    sveltePluginOptions: { ...DEFAULT_SVELTE_OPTIONS },
    tomlPluginOptions: { ...DEFAULT_TOML_OPTIONS },
  } satisfies OptionsSnapshot
}

export function parseOptionsSnapshot(source: string) {
  let parsed: unknown

  try {
    parsed = JSON.parse(source)
  } catch (err) {
    throw new Error('Invalid options file', { cause: err })
  }

  if (!isRecord(parsed)) {
    throw new Error('Unsupported options file')
  }

  const { version } = parsed

  if (version !== OPTIONS_SNAPSHOT_VERSION) {
    throw new Error('Unsupported options file')
  }

  if (!hasKeys(parsed, [...OPTIONS_SNAPSHOT_KEYS])) {
    throw new Error('Invalid options file')
  }

  const defaults = createDefaultOptionsSnapshot()

  for (const key of OPTIONS_SNAPSHOT_KEYS) {
    const value = parsed[key]
    const defaultValue = defaults[key]

    if (
      !isRecord(value)
      || !Object.keys(defaultValue).every(defaultKey => defaultKey in value)
    ) {
      throw new Error('Invalid options file')
    }
  }

  return parsed as unknown as OptionsSnapshot
}

export function stringifyOptionsSnapshot(snapshot: OptionsSnapshot) {
  return `${JSON.stringify(snapshot, null, 2)}\n`
}

export function upsertOptionsPreset(
  presets: OptionsPreset[],
  preset: OptionsPreset,
) {
  return [preset, ...presets.filter(item => item.id !== preset.id)].sort(
    (a, b) => b.updatedAt - a.updatedAt,
  )
}

export function removeOptionsPreset(presets: OptionsPreset[], id: string) {
  return presets.filter(preset => preset.id !== id)
}

export function createOptionsPreset(params: {
  name: string
  snapshot: OptionsSnapshot
  now?: number
}) {
  const now = params.now ?? Date.now()

  return {
    id: `${now}-${params.name.trim().toLowerCase().replaceAll(/\s+/g, '-')}`,
    name: params.name.trim(),
    createdAt: now,
    updatedAt: now,
    snapshot: params.snapshot,
  } satisfies OptionsPreset
}
