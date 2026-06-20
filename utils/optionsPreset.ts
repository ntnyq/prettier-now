import {
  DEFAULT_JAVA_OPTIONS,
  DEFAULT_OPTIONS,
  DEFAULT_PHP_OPTIONS,
  DEFAULT_SVELTE_OPTIONS,
  DEFAULT_TOML_OPTIONS,
  DEFAULT_XML_OPTIONS,
  JAVA_ENTRYPOINTS,
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

function isBoolean(value: unknown) {
  return typeof value === 'boolean'
}

function isNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value)
}

function isOneOf<V extends string>(value: unknown, values: readonly V[]) {
  return typeof value === 'string' && values.includes(value as V)
}

function hasValidValues(
  value: Record<string, unknown>,
  validators: Record<string, (value: unknown) => boolean>,
) {
  return Object.entries(validators).every(([key, validator]) =>
    validator(value[key]),
  )
}

const snapshotValidators: Record<
  (typeof OPTIONS_SNAPSHOT_KEYS)[number],
  Record<string, (value: unknown) => boolean>
> = {
  options: {
    arrowParens: value => isOneOf(value, ['always', 'avoid']),
    bracketSameLine: isBoolean,
    bracketSpacing: isBoolean,
    embeddedLanguageFormatting: value => isOneOf(value, ['auto', 'off']),
    endOfLine: value => isOneOf(value, ['auto', 'cr', 'crlf', 'lf']),
    experimentalOperatorPosition: value => isOneOf(value, ['end', 'start']),
    experimentalTernaries: isBoolean,
    htmlWhitespaceSensitivity: value =>
      isOneOf(value, ['css', 'ignore', 'strict']),
    jsxSingleQuote: isBoolean,
    objectWrap: value => isOneOf(value, ['collapse', 'preserve']),
    printWidth: isNumber,
    proseWrap: value => isOneOf(value, ['always', 'never', 'preserve']),
    quoteProps: value =>
      isOneOf(value, ['as-needed', 'consistent', 'preserve']),
    semi: isBoolean,
    singleAttributePerLine: isBoolean,
    singleQuote: isBoolean,
    tabWidth: isNumber,
    trailingComma: value => isOneOf(value, ['all', 'es5', 'none']),
    useTabs: isBoolean,
    vueIndentScriptAndStyle: isBoolean,
  },
  xmlPluginOptions: {
    xmlQuoteAttributes: value =>
      isOneOf(value, ['double', 'preserve', 'single']),
    xmlSelfClosingSpace: isBoolean,
    xmlSortAttributesByKey: isBoolean,
    xmlWhitespaceSensitivity: value =>
      isOneOf(value, ['ignore', 'preserve', 'strict']),
  },
  phpPluginOptions: {
    braceStyle: value => isOneOf(value, ['1tbs', 'per-cs']),
    phpVersion: value =>
      isOneOf(value, [
        '5.0',
        '5.1',
        '5.2',
        '5.3',
        '5.4',
        '5.5',
        '5.6',
        '7.0',
        '7.1',
        '7.2',
        '7.3',
        '7.4',
        '8.0',
        '8.1',
        '8.2',
      ]),
    trailingCommaPHP: isBoolean,
  },
  javaPluginOptions: {
    entrypoint: value => isOneOf(value, JAVA_ENTRYPOINTS),
  },
  sveltePluginOptions: {
    svelteAllowShorthand: isBoolean,
    svelteIndentScriptAndStyle: isBoolean,
    svelteSortOrder: value =>
      isOneOf(value, [
        'markup-options-scripts-styles',
        'markup-options-styles-scripts',
        'markup-scripts-options-styles',
        'markup-scripts-styles-options',
        'markup-styles-options-scripts',
        'markup-styles-scripts-options',
        'none',
        'options-markup-scripts-styles',
        'options-markup-styles-scripts',
        'options-scripts-markup-styles',
        'options-scripts-styles-markup',
        'options-styles-markup-scripts',
        'options-styles-scripts-markup',
        'scripts-markup-options-styles',
        'scripts-markup-styles-options',
        'scripts-options-markup-styles',
        'scripts-options-styles-markup',
        'scripts-styles-markup-options',
        'scripts-styles-options-markup',
        'styles-markup-options-scripts',
        'styles-markup-scripts-options',
        'styles-options-markup-scripts',
        'styles-options-scripts-markup',
        'styles-scripts-markup-options',
        'styles-scripts-options-markup',
      ]),
  },
  tomlPluginOptions: {
    alignComments: isBoolean,
    alignEntries: isBoolean,
    allowedBlankLines: isNumber,
    arrayAutoCollapse: isBoolean,
    arrayAutoExpand: isBoolean,
    compactArrays: isBoolean,
    compactEntries: isBoolean,
    compactInlineTables: isBoolean,
    indentEntries: isBoolean,
    indentTables: isBoolean,
    reorderKeys: isBoolean,
  },
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
      || !hasValidValues(value, snapshotValidators[key])
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
