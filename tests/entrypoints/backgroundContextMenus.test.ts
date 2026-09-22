import { describe, expect, it, vi } from 'vitest'

const browserMock = vi.hoisted(() => ({
  contextMenus: {
    create: vi.fn(),
    onClicked: {
      addListener: vi.fn(),
    },
    removeAll: vi.fn(async () => {}),
  },
  commands: {
    onCommand: {
      addListener: vi.fn(),
    },
  },
  runtime: {
    onInstalled: {
      addListener: vi.fn(),
    },
    onMessage: {
      addListener: vi.fn(),
    },
    openOptionsPage: vi.fn(),
  },
  tabs: {
    query: vi.fn(async () => []),
    sendMessage: vi.fn(),
  },
}))

vi.mock('#imports', () => ({
  browser: browserMock,
  defineBackground: vi.fn(options => options),
}))

const { registerContextMenus } = await import('@/entrypoints/background')

describe('background context menus', () => {
  it('clears existing menus before registering fixed menu ids', async () => {
    await registerContextMenus(key => key)

    expect(browserMock.contextMenus.removeAll).toHaveBeenCalledTimes(1)
    expect(browserMock.contextMenus.create).toHaveBeenCalledTimes(2)
    expect(browserMock.contextMenus.create).toHaveBeenNthCalledWith(1, {
      id: 'open-options-page',
      title: 'openOptionsPage',
    })
    expect(browserMock.contextMenus.create).toHaveBeenNthCalledWith(2, {
      contexts: ['editable'],
      id: 'format-focused-editor',
      title: 'formatFocusedEditor',
    })

    const [removeAllCallOrder] =
      browserMock.contextMenus.removeAll.mock.invocationCallOrder
    const [createCallOrder] =
      browserMock.contextMenus.create.mock.invocationCallOrder

    if (removeAllCallOrder === undefined || createCallOrder === undefined) {
      throw new Error('Expected context menu calls to be recorded')
    }

    expect(removeAllCallOrder).toBeLessThan(createCallOrder)
  })
})
