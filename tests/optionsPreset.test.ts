import { describe, expect, it } from 'vitest'
import {
  createDefaultOptionsSnapshot,
  parseOptionsSnapshot,
  removeOptionsPreset,
  upsertOptionsPreset,
} from '@/utils/optionsPreset'

describe('options preset utilities', () => {
  it('creates a versioned default options snapshot', () => {
    expect(createDefaultOptionsSnapshot()).toMatchObject({
      version: 1,
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
        allowedBlankLines: 1,
      },
    })
  })

  it('parses a valid options snapshot from json', () => {
    const snapshot = createDefaultOptionsSnapshot()

    expect(parseOptionsSnapshot(JSON.stringify(snapshot))).toEqual(snapshot)
  })

  it('rejects invalid imported snapshots', () => {
    expect(() => parseOptionsSnapshot('{ bad json')).toThrow(
      'Invalid options file',
    )
    expect(() => parseOptionsSnapshot(JSON.stringify({ version: 2 }))).toThrow(
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
            printWidth: 0,
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
            tabWidth: 0,
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
            allowedBlankLines: -1,
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
