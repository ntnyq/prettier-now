import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function readSource(path: string) {
  return readFileSync(resolve(import.meta.dirname, `../${path}`), 'utf8')
}

describe('codemirror pug language', () => {
  it('maps legacy pug token names to known highlight tags', () => {
    const cacheSource = readSource('utils/cache.ts')

    expect(cacheSource).toContain('tokenTable')
    expect(cacheSource).toContain('indent: t.meta')
    expect(cacheSource).toContain('colon: t.punctuation')
    expect(cacheSource).toContain('dot: t.punctuation')
  })
})
