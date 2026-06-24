import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function readSource(path: string) {
  return readFileSync(resolve(import.meta.dirname, `../${path}`), 'utf8')
}

describe('focused editor formatting runtime', () => {
  it('keeps prettier formatting out of the background worker', () => {
    const backgroundSource = readSource('entrypoints/background.ts')

    expect(backgroundSource).not.toContain("from '@/utils/format'")
    expect(backgroundSource).not.toContain('formatViaPrettier')
    expect(backgroundSource).not.toContain('readStoredFormatOptions')
    expect(backgroundSource).not.toContain(
      'FOCUSED_EDITOR_MESSAGE.formatSource',
    )
  })

  it('keeps prettier formatting out of the content script runtime', () => {
    const contentSource = readSource('entrypoints/focused-editor.content.ts')

    expect(contentSource).toContain('focused-editor-formatter')
    expect(contentSource).not.toContain("import('@/utils/format')")
    expect(contentSource).not.toContain('formatViaPrettier')
    expect(contentSource).not.toContain('readStoredFormatOptions')
    expect(contentSource).not.toContain('browser.runtime.sendMessage')
  })

  it('formats focused editor content inside the hidden formatter page', () => {
    const formatterSource = readSource(
      'entrypoints/focused-editor-formatter/main.ts',
    )

    expect(formatterSource).toContain("from '@/utils/format'")
    expect(formatterSource).toContain('formatViaPrettier')
    expect(formatterSource).toContain('readStoredFormatOptions')
  })

  it('exposes the formatter page as a web accessible resource', () => {
    const configSource = readSource('wxt.config.ts')

    expect(configSource).toContain('web_accessible_resources')
    expect(configSource).toContain('focused-editor-formatter.html')
    expect(configSource).toContain('chunks/*')
  })
})
