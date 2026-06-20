import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('language select', () => {
  const source = readFileSync(
    resolve(import.meta.dirname, '../components/navbar/LanguageSelect.vue'),
    'utf8',
  )

  it('uses stable language icon sizing', () => {
    expect(source).toContain('class="size-5 shrink-0"')
  })

  it('pins selected check mark to the right edge', () => {
    expect(source).toContain('class="ml-auto size-4 shrink-0"')
  })
})
