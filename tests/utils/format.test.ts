import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { LANGUAGE_ID } from '@/constants/language'
import { formatViaPrettier } from '@/utils/format'

function readSource(path: string) {
  return readFileSync(resolve(import.meta.dirname, `../../${path}`), 'utf8')
}

describe('format via prettier', () => {
  it.each([
    ['javascript', 'babel', 'const a={value:1}'],
    ['typescript', 'typescript', 'const a:number=1'],
    ['html', 'html', "<main class = 'demo'><p>hello</p></main>"],
    ['angular', 'angular', '<p>{{value}}</p>'],
    ['css', 'css', 'body{color:red}'],
    ['less', 'less', '@color:red;body{color:@color}'],
    ['scss', 'scss', '$color:red;body{color:$color}'],
    ['xml', 'xml', '<root><item value="1"/></root>'],
    ['json', 'json', '{"value":1}'],
    ['yaml', 'yaml', 'value:  [1,2]'],
    ['php', 'php', '<?php $value=1;'],
    ['java', 'java', 'class Main{int value=1;}'],
    ['graphql', 'graphql', 'query Demo{user{id name}}'],
  ] as const)('formats %s consistently', async (languageId, parser, source) => {
    const options = { languageId, parser }
    const result = await formatViaPrettier(source, options)
    expect(result.trim()).not.toBe(source)
    expect(await formatViaPrettier(result, options)).toBe(result)
  })

  it.each([
    ['yaml', 'value:  [1,2]', 'value: [1, 2]'],
    ['graphql', 'query Demo{user{id name}}', 'query Demo {'],
  ])(
    'formats %s code fences in Markdown',
    async (language, source, expected) => {
      const result = await formatViaPrettier(
        [`\`\`\`${language}`, source, '```'].join('\n'),
        { languageId: LANGUAGE_ID.markdown, parser: 'markdown' },
      )
      expect(result).toContain(expected)
    },
  )

  it('formats HTML code fences in Markdown', async () => {
    const result = await formatViaPrettier(
      '```html\n<div><p>hello</p><p>world</p></div>\n```',
      {
        languageId: LANGUAGE_ID.markdown,
        parser: 'markdown',
      },
    )
    expect(result).toContain('<div>\n  <p>hello</p>\n  <p>world</p>\n</div>')
  })

  it.each([
    ['vue', '<script setup lang="ts">const x:number=1</script>'],
    ['svelte', '<script lang="ts">let x:number=1</script><p>{x}</p>'],
    ['markdown', '```typescript\nconst x:number=1\n```'],
  ] as const)(
    'formats embedded TypeScript in %s',
    async (languageId, source) => {
      const result = await formatViaPrettier(source, {
        languageId,
        parser: languageId,
      })
      expect(result).toMatch(/(?:const|let) x: number = 1;/)
    },
  )
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
    const { loadPrettierPlugin } = await import('@/utils/prettierPlugins')
    const pugPlugin = await loadPrettierPlugin(LANGUAGE_ID.pug)
    expect(await loadPrettierPlugin(LANGUAGE_ID.pug)).toBe(pugPlugin)
    expect(pugPlugin?.parsers).toHaveProperty('pug')
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

  it('preloads postcss for embedded css parsers', () => {
    const formatSource = readSource('utils/format.ts')

    expect(formatSource).toContain(
      "import pluginPostcss from 'prettier/plugins/postcss'",
    )
    expect(formatSource).toContain('pluginPostcss,')
  })

  it('does not dynamically load css-family plugins already preloaded by postcss', () => {
    const formatSource = readSource('utils/format.ts')

    expect(formatSource).toContain('PRELOADED_PLUGIN_LANGUAGE_IDS')
    expect(formatSource).toContain('LANGUAGE_ID.css')
    expect(formatSource).toContain('LANGUAGE_ID.less')
    expect(formatSource).toContain('LANGUAGE_ID.scss')
    expect(formatSource).toContain(
      'PRELOADED_PLUGIN_LANGUAGE_IDS.has(languageId)',
    )
  })
})
