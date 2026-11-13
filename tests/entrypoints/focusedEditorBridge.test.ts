import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { FOCUSED_EDITOR_EVENT } from '@/constants/focusedEditor'
import { clearFocusedEditorElement } from '@/utils/focusedEditorElement'
import type {
  FocusedEditorGetValueResponseDetail,
  FocusedEditorSetValueResponseDetail,
} from '@/types/focusedEditor'

const runtime = vi.hoisted(() => ({
  main: () => {},
}))
vi.mock('#imports', () => ({
  defineContentScript(definition: { main: () => void }) {
    runtime.main = definition.main
    return definition
  },
}))

beforeAll(async () => {
  await import('@/entrypoints/focused-editor-main.content')
  runtime.main()
  document.execCommand = vi.fn((_command, _showUi, value) => {
    if (!(document.activeElement instanceof HTMLTextAreaElement)) {
      return false
    }
    document.activeElement.value = value ?? ''
    return true
  })
})

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  clearFocusedEditorElement()
  document.body.innerHTML = ''
  vi.clearAllTimers()
  vi.useRealTimers()
})

function createTextarea(source: string) {
  const element = document.createElement('textarea')
  element.value = source
  document.body.append(element)
  element.focus()
  return element
}

function readEditor(requestId: string) {
  let response: FocusedEditorGetValueResponseDetail | undefined
  window.addEventListener(
    FOCUSED_EDITOR_EVENT.getValueResponse,
    event => {
      response = (event as CustomEvent<FocusedEditorGetValueResponseDetail>)
        .detail
    },
    { once: true },
  )
  window.dispatchEvent(
    new CustomEvent(FOCUSED_EDITOR_EVENT.getValueRequest, {
      detail: { requestId },
    }),
  )
  return response
}

function writeEditor(requestId: string, value: string) {
  let response: FocusedEditorSetValueResponseDetail | undefined
  window.addEventListener(
    FOCUSED_EDITOR_EVENT.setValueResponse,
    event => {
      response = (event as CustomEvent<FocusedEditorSetValueResponseDetail>)
        .detail
    },
    { once: true },
  )
  window.dispatchEvent(
    new CustomEvent(FOCUSED_EDITOR_EVENT.setValueRequest, {
      detail: { requestId, value },
    }),
  )
  return response
}

describe('focused editor bridge', () => {
  it('ignores malformed page events without consuming a valid editor snapshot', () => {
    const element = createTextarea('const a=1')
    readEditor('valid')
    window.dispatchEvent(new CustomEvent(FOCUSED_EDITOR_EVENT.getValueRequest))
    window.dispatchEvent(
      new CustomEvent(FOCUSED_EDITOR_EVENT.setValueRequest, {
        detail: { requestId: 'valid', value: 42 },
      }),
    )
    expect(element.value).toBe('const a=1')
    expect(writeEditor('valid', 'const a = 1;\n')?.errorMessage).toBeUndefined()
    expect(element.value).toBe('const a = 1;\n')
  })

  it('does not replace another editor after focus changes', () => {
    const a = createTextarea('const a=1')
    expect(readEditor('a')?.source).toBe('const a=1')
    const b = createTextarea('unrelated draft')
    expect(writeEditor('a', 'const a = 1;\n')?.errorMessage).toBeTruthy()
    expect(a.value).toBe('const a=1')
    expect(b.value).toBe('unrelated draft')
  })

  it('preserves edits made while formatting', () => {
    const element = createTextarea('const a=1')
    readEditor('a')
    element.value = 'const a=2'
    expect(writeEditor('a', 'const a = 1;\n')?.errorMessage).toBeTruthy()
    expect(element.value).toBe('const a=2')
  })

  it('only accepts the latest snapshot once', () => {
    const element = createTextarea('const a=1')
    readEditor('old')
    readEditor('new')
    expect(writeEditor('old', 'old result')?.errorMessage).toBeTruthy()
    expect(writeEditor('new', 'const a = 1;\n')?.errorMessage).toBeUndefined()
    expect(element.value).toBe('const a = 1;\n')
    expect(writeEditor('new', 'replayed result')?.errorMessage).toBeTruthy()
    expect(element.value).toBe('const a = 1;\n')
  })
})
