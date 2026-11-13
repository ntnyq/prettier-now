import { flushPromises } from '@vue/test-utils'
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import {
  FOCUSED_EDITOR_EVENT,
  FOCUSED_EDITOR_FORMAT_TIMEOUT,
  FOCUSED_EDITOR_MESSAGE,
} from '@/constants/focusedEditor'

const runtime = vi.hoisted(() => ({
  main: () => {},
  receive: async (_message: unknown) => {},
}))

vi.mock('#imports', () => ({
  defineContentScript(definition: { main: () => void }) {
    runtime.main = definition.main
    return definition
  },
  browser: {
    runtime: {
      getURL: (path: string) => `https://extension.test${path}`,
      onMessage: {
        addListener(listener: typeof runtime.receive) {
          runtime.receive = listener
        },
      },
    },
  },
}))

beforeAll(async () => {
  await import('@/entrypoints/focused-editor.content')
  runtime.main()
  window.addEventListener(FOCUSED_EDITOR_EVENT.getValueRequest, event => {
    const { requestId } = (event as CustomEvent<{ requestId: string }>).detail
    window.dispatchEvent(
      new CustomEvent(FOCUSED_EDITOR_EVENT.getValueResponse, {
        detail: { requestId, source: 'const a=1', hints: [] },
      }),
    )
  })
  window.addEventListener(FOCUSED_EDITOR_EVENT.setValueRequest, event => {
    const { requestId } = (event as CustomEvent<{ requestId: string }>).detail
    window.dispatchEvent(
      new CustomEvent(FOCUSED_EDITOR_EVENT.setValueResponse, {
        detail: { requestId },
      }),
    )
  })
})

beforeEach(() => {
  vi.useFakeTimers()
  const createElement = document.createElement.bind(document)
  vi.spyOn(document, 'createElement').mockImplementation((tagName, options) => {
    if (tagName !== 'iframe') {
      return createElement(tagName, options)
    }
    // Keep frame load/error events under test control without network access.
    const frame = createElement('div')
    Object.defineProperty(frame, 'contentWindow', {
      value: { postMessage: vi.fn() },
    })
    return frame
  })
})
afterEach(() => {
  document
    .querySelectorAll(
      '#prettier-now-focused-editor-formatter, #prettier-now-focused-editor-error',
    )
    .forEach(element => element.remove())
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

async function startFormat() {
  const pending = runtime.receive({
    type: FOCUSED_EDITOR_MESSAGE.formatFocusedEditor,
  })
  await flushPromises()
  const frame = document.querySelector<HTMLIFrameElement>(
    '#prettier-now-focused-editor-formatter',
  )!
  return {
    pending,
    frame,
  }
}

describe('focused editor content runtime', () => {
  it('can start formatting without secure-context UUID support', async () => {
    vi.spyOn(crypto, 'randomUUID').mockImplementation(() => {
      throw new Error('UUID is unavailable')
    })
    const { pending, frame } = await startFormat()
    expect(frame).not.toBeNull()
    frame.dispatchEvent(new Event('error'))
    await pending
  })

  it('ignores keyboard requests in an unfocused document', async () => {
    vi.spyOn(document, 'hasFocus').mockReturnValue(false)
    await runtime.receive({
      type: FOCUSED_EDITOR_MESSAGE.formatFocusedEditor,
      requireFocus: true,
    })
    expect(
      document.querySelector('#prettier-now-focused-editor-formatter'),
    ).toBeNull()
  })

  it('cleans up stalled iframe loads and allows retry', async () => {
    const first = await startFormat()
    await vi.advanceTimersByTimeAsync(FOCUSED_EDITOR_FORMAT_TIMEOUT)
    await first.pending
    expect(first.frame.isConnected).toBe(false)
    expect(
      document.querySelector('#prettier-now-focused-editor-error')?.textContent,
    ).toBe('Failed to load formatter runtime')
    const second = await startFormat()
    expect(second.frame).not.toBe(first.frame)
    second.frame.dispatchEvent(new Event('error'))
    await second.pending
    expect(second.frame.isConnected).toBe(false)
  })

  it('rejects responses from another window and recreates an unresponsive frame', async () => {
    const first = await startFormat()
    const post = vi
      .spyOn(first.frame.contentWindow!, 'postMessage')
      .mockImplementation(() => {})
    first.frame.dispatchEvent(new Event('load'))
    await flushPromises()
    const request = post.mock.calls[0]![0] as { requestId: string }
    window.dispatchEvent(
      new MessageEvent('message', {
        origin: 'https://extension.test',
        source: window,
        data: {
          requestId: request.requestId,
          type: FOCUSED_EDITOR_MESSAGE.formatterFormatResponse,
          ok: true,
          formatted: 'spoofed',
        },
      }),
    )
    await vi.advanceTimersByTimeAsync(FOCUSED_EDITOR_FORMAT_TIMEOUT)
    await first.pending
    expect(
      document.querySelector('#prettier-now-focused-editor-error')?.textContent,
    ).toBe('Formatter runtime timed out')
    const second = await startFormat()
    expect(second.frame).not.toBe(first.frame)
    second.frame.dispatchEvent(new Event('error'))
    await second.pending
  })
})
