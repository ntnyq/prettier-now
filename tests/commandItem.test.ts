import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function readComponent(path: string) {
  return readFileSync(resolve(import.meta.dirname, `../${path}`), 'utf8')
}

describe('command item', () => {
  it('cleans group membership on unmount', () => {
    const source = readComponent('components/ui/command/CommandItem.vue')

    expect(source).toContain('onUnmounted(() => {')
    expect(source).toContain('allItems.value.delete(id)')
    expect(source).toContain('allGroups.value.get(groupId)?.delete(id)')
  })
})
