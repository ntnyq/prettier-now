import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function readComponent(path: string) {
  return readFileSync(resolve(import.meta.dirname, `../${path}`), 'utf8')
}

describe('navbar actions', () => {
  it('moves history and log actions into the right-side more menu', () => {
    const navbarSource = readComponent('components/navbar/index.vue')
    const moreActionSource = readComponent('components/navbar/MoreAction.vue')

    expect(navbarSource).not.toContain('History,')
    expect(navbarSource).not.toContain('FileText,')
    expect(navbarSource).not.toContain('useLogStore')
    expect(navbarSource).not.toContain('setIsHistoryPanelVisible(true)')
    expect(navbarSource).not.toContain('setIsLogPanelVisible(true)')
    expect(navbarSource).toContain(
      ':show-workspace-actions="route.name === \'Home\'"',
    )

    expect(moreActionSource).toContain('History')
    expect(moreActionSource).toContain('FileText')
    expect(moreActionSource).toContain('showWorkspaceActions')
    expect(moreActionSource).toContain(
      'appStore.setIsHistoryPanelVisible(true)',
    )
    expect(moreActionSource).toContain('logStore.setIsLogPanelVisible(true)')
  })
})
