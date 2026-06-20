import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('settings overlay', () => {
  it('uses shadcn dialog primitives instead of sheet primitives', () => {
    const source = readFileSync(
      resolve(import.meta.dirname, '../components/settings/SettingsDialog.vue'),
      'utf8',
    )

    expect(source).toContain('@/components/ui/dialog')
    expect(source).not.toContain('@/components/ui/sheet')
  })
})
