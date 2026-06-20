import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useConfigStore } from '@/stores/config'
import { Toast } from '@/utils/toast'

const toastMock = vi.hoisted(() => {
  const toast = vi.fn()
  return Object.assign(toast, {
    dismiss: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  })
})

vi.mock('vue-sonner', () => ({
  toast: toastMock,
}))

vi.mock('#imports', () => ({
  storage: {
    getItem: vi.fn(async () => null),
    setItem: vi.fn(async () => {}),
  },
}))

vi.stubGlobal('localStorage', {
  clear: vi.fn(),
})

describe('Toast', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    toastMock.mockClear()
    toastMock.info.mockClear()
    toastMock.error.mockClear()
    toastMock.dismiss.mockClear()
  })

  it('does not show messages when silent mode is enabled', () => {
    const configStore = useConfigStore()
    configStore.silent = true

    Toast.info('Saved')
    Toast.error('Failed')

    expect(toastMock.info).not.toHaveBeenCalled()
    expect(toastMock.error).not.toHaveBeenCalled()
  })

  it('clears existing toasts before showing by default', () => {
    Toast.info('Saved')

    expect(toastMock.dismiss).toHaveBeenCalledTimes(1)
    expect(toastMock.info).toHaveBeenCalledWith('Saved', {
      duration: 2000,
    })
  })

  it('shows errors through sonner error toasts', () => {
    Toast.error('Failed')

    expect(toastMock.dismiss).toHaveBeenCalledTimes(1)
    expect(toastMock.error).toHaveBeenCalledWith('Failed', {
      duration: 2000,
    })
  })
})
