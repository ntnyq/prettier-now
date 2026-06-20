import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { LANGUAGE_ID } from '@/constants/language'
import { formatViaPrettier } from '@/utils/format'

function readSource(path: string) {
  return readFileSync(resolve(import.meta.dirname, `../${path}`), 'utf8')
}

describe('format via prettier', () => {
  it('formats pug through the browser-compatible plugin chain', async () => {
    await expect(
      formatViaPrettier(
        'main.app#demo(class="p-4"): section.card: h1.title Hello Pug: p.desc test\nstyle.\n  .foo{color:red}\n',
        {
          languageId: LANGUAGE_ID.pug,
          parser: 'pug',
        },
      ),
    ).resolves
      .toBe(`main#demo.app.p-4: section.card: h1.title Hello Pug: p.desc test
style.
  .foo {
    color: red;
  }
`)
  })

  it('caches the normalized pug plugin shape', async () => {
    const { clearPrettierPluginCache, getAllPrettierPlugins } =
      await import('@/utils/cache')

    clearPrettierPluginCache()

    await formatViaPrettier('div hello', {
      languageId: LANGUAGE_ID.pug,
      parser: 'pug',
    })

    const pugPlugin = getAllPrettierPlugins().find(plugin => {
      const parsers = plugin.parsers
      return Boolean(parsers && 'pug' in parsers)
    })

    expect(pugPlugin).toBeDefined()
    expect(pugPlugin).not.toHaveProperty('plugin')
  })

  it('keeps pug format options browser-safe', () => {
    const formatSource = readSource('utils/format.ts')

    expect(formatSource).toContain('PUG_DEFAULT_FORMAT_OPTIONS')
    expect(formatSource).toContain('pugEmptyAttributesForceQuotes: []')
    expect(formatSource).toContain('pugSortAttributesBeginning: []')
    expect(formatSource).toContain('pugSortAttributesEnd: []')
    expect(formatSource).not.toContain('getAllPrettierPlugins')
  })
})
