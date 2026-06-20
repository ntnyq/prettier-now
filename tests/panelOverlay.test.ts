import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function readComponent(path: string) {
  return readFileSync(resolve(import.meta.dirname, `../${path}`), 'utf8')
}

describe('panel overlays', () => {
  it('confirms before clearing history entries', () => {
    const source = readComponent('components/HistoryPanel.vue')

    expect(source).toContain('@/components/ui/alert-dialog')
    expect(source).not.toContain('window.confirm')
    expect(source).toContain('function clearHistory()')
    expect(source).toContain('workspaceStore.clearFormatHistory()')
    expect(source).toContain('appStore.setIsHistoryPanelVisible(false)')
    expect(source).toContain('@click="clearHistory"')
  })

  it('confirms before clearing logs', () => {
    const source = readComponent('components/LogPanel.vue')

    expect(source).toContain('@/components/ui/alert-dialog')
    expect(source).not.toContain('window.confirm')
    expect(source).toContain('function clearLog()')
    expect(source).toContain('logStore.clearAll()')
    expect(source).toContain('logStore.setIsLogPanelVisible(false)')
    expect(source).toContain('@click="clearLog"')
  })

  it('uses a wide dialog for diff instead of a sheet', () => {
    const source = readComponent('components/DiffPanel.vue')

    expect(source).toContain('@/components/ui/dialog')
    expect(source).not.toContain('@/components/ui/sheet')
    expect(source).toContain('max-w-[min(960px,96vw)]!')
  })

  it('keeps the empty diff dialog spacious and informative', () => {
    const source = readComponent('components/DiffPanel.vue')

    expect(source).toContain('min-h-[min(520px,72vh)]')
    expect(source).toContain("i18n.t('emptyDiff')")
  })
})
