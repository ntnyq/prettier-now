import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { FOCUSED_EDITOR_MESSAGE } from '@/constants/focusedEditor'

vi.mock('#imports', () => ({
  storage: {
    async getItems(keys: string[]) {
      return keys.map(key => ({
        key,
        value: key === 'local:semi' ? false : null,
      }))
    },
    getItem: async () => null,
    setItem: async () => {},
  },
}))

beforeAll(async () => {
  await import('@/entrypoints/focused-editor-formatter/main')
})
afterEach(() => vi.restoreAllMocks())

describe('focused editor formatter page', () => {
  it('formats a posted request with persisted preferences and returns the correlated result', async () => {
    const post = vi.spyOn(window, 'postMessage').mockImplementation(() => {})
    window.dispatchEvent(
      new MessageEvent('message', {
        source: window,
        origin: 'https://page.test',
        data: {
          type: FOCUSED_EDITOR_MESSAGE.formatterFormatRequest,
          requestId: 'format-1',
          source: 'const a={value:1}',
          hints: ['language-javascript'],
        },
      }),
    )
    await vi.waitFor(() =>
      expect(post).toHaveBeenCalledWith(
        {
          type: FOCUSED_EDITOR_MESSAGE.formatterFormatResponse,
          requestId: 'format-1',
          ok: true,
          languageId: 'javascript',
          formatted: 'const a = { value: 1 }\n',
        },
        { targetOrigin: 'https://page.test' },
      ),
    )
  })

  it('ignores a request with malformed editor hints', async () => {
    const post = vi.spyOn(window, 'postMessage').mockImplementation(() => {})
    window.dispatchEvent(
      new MessageEvent('message', {
        source: window,
        origin: 'https://page.test',
        data: {
          type: FOCUSED_EDITOR_MESSAGE.formatterFormatRequest,
          requestId: 'invalid',
          source: 'const a=1',
          hints: 42,
        },
      }),
    )
    await flushPromises()
    expect(post).not.toHaveBeenCalled()
  })
})
