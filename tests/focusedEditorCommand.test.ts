import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { COMMANDS } from '@/constants/command'
import { CONTEXT_MENU_ID } from '@/constants/meta'

function readSource(path: string) {
  return readFileSync(resolve(import.meta.dirname, `../${path}`), 'utf8')
}

describe('focused editor format command', () => {
  it('declares command and menu ids for focused editor formatting', () => {
    expect(COMMANDS).toHaveProperty('formatFocusedEditor')
    expect(CONTEXT_MENU_ID).toHaveProperty('formatFocusedEditor')
  })

  it('allows manual shortcut binding without shipping a default shortcut', () => {
    const configSource = readSource('wxt.config.ts')
    const commandBlock = configSource.match(
      /formatFocusedEditor:\s*\{[\s\S]*?\},\n\s*openOptionsPage:/,
    )?.[0]

    expect(configSource).toContain('formatFocusedEditor')
    expect(commandBlock).toBeDefined()
    expect(commandBlock).not.toContain('suggested_key')
  })
})
