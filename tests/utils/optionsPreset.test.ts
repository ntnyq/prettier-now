import * as v from 'valibot'
import { describe, expect, it } from 'vitest'
import {
  createDefaultOptionsSnapshot,
  createOptionsPreset,
  OptionsPresetListSchema,
  OptionsPresetSchema,
  OptionsSnapshotSchema,
  parseOptionsSnapshot,
  removeOptionsPreset,
  stringifyOptionsSnapshot,
  upsertOptionsPreset,
} from '@/utils/optionsPreset'

describe('options preset utilities', () => {
  it('reuses snapshot schemas for persisted option presets', () => {
    const preset = createOptionsPreset({
      name: 'Team',
      now: 1,
      snapshot: createDefaultOptionsSnapshot(),
    })
    const invalidPreset = {
      ...preset,
      snapshot: {
        ...preset.snapshot,
        options: {
          ...preset.snapshot.options,
          printWidth: 0.5,
        },
      },
    }

    expect(v.safeParse(OptionsSnapshotSchema, preset.snapshot).success).toBe(
      true,
    )
    expect(v.safeParse(OptionsPresetSchema, preset).success).toBe(true)
    expect(v.safeParse(OptionsPresetListSchema, [preset]).success).toBe(true)
    expect(v.safeParse(OptionsPresetSchema, invalidPreset).success).toBe(false)
    expect(v.safeParse(OptionsPresetListSchema, [invalidPreset]).success).toBe(
      false,
    )
  })

  it('creates a versioned default options snapshot', () => {
    expect(createDefaultOptionsSnapshot()).toMatchObject({
      version: 2,
      options: {
        printWidth: 80,
        tabWidth: 2,
      },
      xmlPluginOptions: {
        xmlSelfClosingSpace: true,
      },
      phpPluginOptions: {
        phpVersion: '7.0',
      },
      javaPluginOptions: {
        entrypoint: 'compilationUnit',
      },
      sveltePluginOptions: {
        svelteAllowShorthand: true,
      },
      tomlPluginOptions: {
        groupBlankLinesLimit: null,
      },
    })
  })

  it('round-trips zero width settings accepted by the formatter', () => {
    const snapshot = createDefaultOptionsSnapshot()
    snapshot.options.printWidth = 0
    snapshot.options.tabWidth = 0
    expect(parseOptionsSnapshot(stringifyOptionsSnapshot(snapshot))).toEqual(
      snapshot,
    )
  })

  it('parses a valid options snapshot from json', () => {
    const snapshot = createDefaultOptionsSnapshot()

    expect(parseOptionsSnapshot(JSON.stringify(snapshot))).toEqual(snapshot)
  })

  it('upgrades version 1 imports and saved presets without losing other settings', () => {
    const legacySnapshot = {
      ...createDefaultOptionsSnapshot(),
      version: 1,
      tomlPluginOptions: {
        alignComments: true,
        alignEntries: false,
        allowedBlankLines: 2,
        arrayAutoCollapse: true,
        arrayAutoExpand: true,
        compactArrays: true,
        compactEntries: false,
        compactInlineTables: false,
        indentEntries: true,
        indentTables: false,
        reorderKeys: true,
      },
    }
    const migrated = parseOptionsSnapshot(JSON.stringify(legacySnapshot))

    expect(migrated.version).toBe(2)
    expect(migrated.options).toEqual(legacySnapshot.options)
    expect(migrated.tomlPluginOptions).toMatchObject({
      groupBlankLinesLimit: 2,
      arrayBracketSpaceWidth: 0,
      indentTableKeyValuePairs: true,
    })
    expect(migrated.tomlPluginOptions).not.toHaveProperty('reorderKeys')
    const result = v.parse(OptionsPresetListSchema, [
      {
        id: 'legacy',
        name: 'Legacy',
        createdAt: 1,
        updatedAt: 1,
        snapshot: legacySnapshot,
      },
    ])
    expect(result[0]?.snapshot).toEqual(migrated)
    expect(parseOptionsSnapshot(JSON.stringify(migrated))).toEqual(migrated)
  })

  it('rejects invalid imported snapshots', () => {
    expect(() => parseOptionsSnapshot('{ bad json')).toThrow(
      'Invalid options file',
    )
    expect(() => parseOptionsSnapshot(JSON.stringify({ version: 3 }))).toThrow(
      'Unsupported options file',
    )
    expect(() =>
      parseOptionsSnapshot(JSON.stringify({ version: 1, options: {} })),
    ).toThrow('Invalid options file')
  })

  it('rejects snapshots with invalid option value types', () => {
    const snapshot = createDefaultOptionsSnapshot()

    expect(() =>
      parseOptionsSnapshot(
        JSON.stringify({
          ...snapshot,
          options: {
            ...snapshot.options,
            printWidth: 'wide',
          },
        }),
      ),
    ).toThrow('Invalid options file')

    expect(() =>
      parseOptionsSnapshot(
        JSON.stringify({
          ...snapshot,
          options: {
            ...snapshot.options,
            trailingComma: 'sometimes',
          },
        }),
      ),
    ).toThrow('Invalid options file')
  })

  it('rejects snapshots with numeric options outside supported ranges', () => {
    const snapshot = createDefaultOptionsSnapshot()

    expect(() =>
      parseOptionsSnapshot(
        JSON.stringify({
          ...snapshot,
          options: {
            ...snapshot.options,
            printWidth: -1,
          },
        }),
      ),
    ).toThrow('Invalid options file')

    expect(() =>
      parseOptionsSnapshot(
        JSON.stringify({
          ...snapshot,
          options: {
            ...snapshot.options,
            printWidth: 0.5,
          },
        }),
      ),
    ).toThrow('Invalid options file')

    expect(() =>
      parseOptionsSnapshot(
        JSON.stringify({
          ...snapshot,
          options: {
            ...snapshot.options,
            tabWidth: -1,
          },
        }),
      ),
    ).toThrow('Invalid options file')

    expect(() =>
      parseOptionsSnapshot(
        JSON.stringify({
          ...snapshot,
          options: {
            ...snapshot.options,
            tabWidth: 0.5,
          },
        }),
      ),
    ).toThrow('Invalid options file')

    expect(() =>
      parseOptionsSnapshot(
        JSON.stringify({
          ...snapshot,
          tomlPluginOptions: {
            ...snapshot.tomlPluginOptions,
            groupBlankLinesLimit: 0,
          },
        }),
      ),
    ).toThrow('Invalid options file')
  })

  it('upserts presets by id and keeps newest first', () => {
    const snapshot = createDefaultOptionsSnapshot()
    const firstPreset = {
      id: 'team',
      name: 'Team',
      createdAt: 1,
      updatedAt: 1,
      snapshot,
    }
    const updatedPreset = {
      ...firstPreset,
      name: 'Team Updated',
      updatedAt: 2,
    }

    expect(upsertOptionsPreset([], firstPreset)).toEqual([firstPreset])
    expect(upsertOptionsPreset([firstPreset], updatedPreset)).toEqual([
      updatedPreset,
    ])
  })

  it('removes presets by id', () => {
    const snapshot = createDefaultOptionsSnapshot()
    const presets = [
      {
        id: 'a',
        name: 'A',
        createdAt: 1,
        updatedAt: 1,
        snapshot,
      },
      {
        id: 'b',
        name: 'B',
        createdAt: 2,
        updatedAt: 2,
        snapshot,
      },
    ]

    expect(removeOptionsPreset(presets, 'a')).toEqual([presets[1]])
  })
})
