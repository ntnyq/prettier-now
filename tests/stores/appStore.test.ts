import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAppStore } from '@/stores/app'

const storageMock = vi.hoisted(() => ({
  watch: vi.fn(() => vi.fn()),
  getItem: vi.fn(async () => null),
  setItem: vi.fn(async () => {}),
}))

vi.mock('#imports', () => ({
  storage: storageMock,
}))

vi.stubGlobal('localStorage', {
  clear: vi.fn(),
})

describe('app store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('controls the settings dialog visibility', () => {
    const appStore = useAppStore()

    expect(appStore.isSettingsDialogOpen).toBe(false)

    appStore.setSettingsDialogOpen(true)
    expect(appStore.isSettingsDialogOpen).toBe(true)

    appStore.setSettingsDialogOpen(false)
    expect(appStore.isSettingsDialogOpen).toBe(false)
  })
})
