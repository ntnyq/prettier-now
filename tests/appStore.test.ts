import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAppStore } from '@/stores/app'

const storageMock = vi.hoisted(() => ({
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

  it('controls the settings sheet visibility', () => {
    const appStore = useAppStore()

    expect(appStore.isSettingsSheetVisible).toBe(false)

    appStore.setIsSettingsSheetVisible(true)
    expect(appStore.isSettingsSheetVisible).toBe(true)

    appStore.setIsSettingsSheetVisible(false)
    expect(appStore.isSettingsSheetVisible).toBe(false)
  })
})
