import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { build } from 'vite'
import { afterEach, describe, expect, it } from 'vitest'

const outputDirs: string[] = []

async function createBrowserBundle() {
  const root = await mkdtemp(
    join(process.cwd(), 'node_modules/.tmp/prettier-now-pug-'),
  )
  const outDir = join(root, 'dist')
  const entry = join(root, 'entry.mjs')

  outputDirs.push(root)

  await writeFile(
    entry,
    `
      import prettier from 'prettier/standalone'
      import pluginBabel from 'prettier/plugins/babel'
      import pluginEstree from 'prettier/plugins/estree'
      import pluginPostcss from 'prettier/plugins/postcss'
      import * as pluginPug from '@prettier/plugin-pug'

      export async function formatPug(source) {
        return prettier.format(source, {
          parser: 'pug',
          plugins: [
            pluginBabel,
            pluginEstree,
            pluginPostcss,
            pluginPug.plugin ?? pluginPug,
          ],
        })
      }
    `,
  )

  await build({
    root: process.cwd(),
    build: {
      emptyOutDir: true,
      lib: {
        entry,
        fileName: 'pug-browser',
        formats: ['es'],
      },
      minify: false,
      outDir,
      rollupOptions: {
        output: {
          chunkFileNames: '[name].js',
        },
      },
      target: 'es2022',
    },
    configFile: false,
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.PRETTIER_PLUGIN_PUG_LOG_LEVEL': 'undefined',
    },
    logLevel: 'silent',
  })

  return {
    entry: join(outDir, 'pug-browser.js'),
    outDir,
  }
}

describe('pug prettier plugin browser bundle', () => {
  afterEach(async () => {
    await Promise.all(
      outputDirs.splice(0).map(dir =>
        rm(dir, {
          force: true,
          recursive: true,
        }),
      ),
    )
  })

  it('bundles without Node builtin externals and formats embedded CSS', async () => {
    const { entry } = await createBrowserBundle()
    const bundle = await readFile(entry, 'utf8')

    expect(bundle).not.toContain('__vite-browser-external')
    expect(bundle).not.toContain('node:util')

    const browserBundle = await import(pathToFileURL(entry).href)
    const formatted = await browserBundle.formatPug(`
style.
  .foo{color:red}
`)

    expect(formatted).toBe(`style.
  .foo {
    color: red;
  }
`)
  })
})
