// @vitest-environment node

import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import pluginBabel from 'prettier/plugins/babel'
import pluginEstree from 'prettier/plugins/estree'
import { format } from 'prettier/standalone'
import { build } from 'vite'
import { afterEach, describe, expect, it, vi } from 'vitest'
import wxtConfig from '../../wxt.config'

const outputDirs: string[] = []

describe('toml prettier plugin browser bundle', () => {
  afterEach(async () => {
    vi.unstubAllGlobals()
    await Promise.all(
      outputDirs.splice(0).map(dir =>
        rm(dir, {
          force: true,
          recursive: true,
        }),
      ),
    )
  })

  it('bundles and formats without shared memory, workers or Node addons', async () => {
    const tempDir = join(process.cwd(), 'node_modules/.tmp')
    await mkdir(tempDir, { recursive: true })
    const root = await mkdtemp(join(tempDir, 'prettier-now-toml-'))
    outputDirs.push(root)

    const entry = join(root, 'entry.mjs')
    const outDir = join(root, 'dist')
    await writeFile(entry, "export { default } from 'prettier-plugin-toml'\n")
    const config = await wxtConfig.vite?.({
      browser: 'firefox',
      command: 'build',
      mode: 'production',
      manifestVersion: 2,
    })
    const result = await build({
      configFile: false,
      logLevel: 'silent',
      resolve: config?.resolve,
      build: {
        outDir,
        target: 'es2022',
        rolldownOptions: {
          input: entry,
          preserveEntrySignatures: 'strict',
          output: { entryFileNames: 'toml-browser.js' },
        },
      },
    })

    if (!('output' in result)) {
      throw new Error('Expected a single browser build output')
    }
    const files = await readdir(join(outDir, 'assets'))
    const wasm = files.find(file => file.endsWith('.wasm'))
    if (!wasm) {
      throw new Error('Missing TOML WASM asset')
    }
    expect(files.some(file => file.includes('worker'))).toBe(false)
    const imports = result.output.flatMap(chunk =>
      chunk.type === 'chunk' ? chunk.imports : [],
    )
    expect(imports).not.toEqual(
      expect.arrayContaining([
        expect.stringMatching(
          /^(?:node:|tombit|@tombit\/|@emnapi\/|@napi-rs\/)/,
        ),
      ]),
    )

    const bytes = await readFile(join(outDir, 'assets', wasm))
    const fetchWasm = vi.fn(
      async () =>
        new Response(bytes, {
          headers: { 'Content-Type': 'application/wasm' },
        }),
    )
    vi.stubGlobal('fetch', fetchWasm)
    vi.stubGlobal('SharedArrayBuffer', undefined)
    vi.stubGlobal('Worker', undefined)

    const { default: plugin } = await import(
      pathToFileURL(join(outDir, 'toml-browser.js')).href
    )
    const options = {
      parser: 'toml',
      plugins: [pluginBabel, pluginEstree, plugin],
    }
    const results = await Promise.all([
      format('a=1\n', options),
      format('title="hello"\n', { ...options, singleQuote: true }),
    ])
    expect(results).toEqual(['a = 1\n', "title = 'hello'\n"])
    expect(fetchWasm).toHaveBeenCalledOnce()

    await expect(format('a = [', options)).rejects.toMatchObject({
      name: 'TombiFormatError',
      loc: { start: { line: 1 } },
    })
  })
})
