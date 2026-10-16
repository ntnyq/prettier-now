import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, reactive } from 'vue'
import EditorSource from '@/components/EditorSource.vue'

const state = vi.hoisted(() => ({
  workspace: {
    sourceCode: '',
    activeJobId: 'A',
    languageId: 'typescript',
    formatActiveJob: () => {},
  },
  config: { autoFormat: true },
}))
vi.mock('@/stores/config', () => ({ useConfigStore: () => state.config }))
vi.mock('@/stores/workspace', () => ({
  useWorkspaceStore: () => state.workspace,
}))
const editor = defineComponent({
  props: ['modelValue'],
  emits: ['update:modelValue', 'userChange'],
  template:
    '<textarea :value="modelValue" @input="$emit(\'userChange\', $event.target.value); $emit(\'update:modelValue\', $event.target.value)" />',
})
afterEach(() => vi.useRealTimers())

describe('user-only auto format', () => {
  it('formats input, not programmatic imports or task switches, and cancels pending work', async () => {
    vi.useFakeTimers()
    const format = vi.fn()
    state.workspace = reactive({
      sourceCode: '',
      languageId: 'typescript',
      activeJobId: 'A',
      formatActiveJob: format,
    })
    state.config = reactive({ autoFormat: true })
    const wrapper = mount(EditorSource, {
      global: { stubs: { Editor: editor } },
    })
    state.workspace.sourceCode = 'imported'
    await vi.advanceTimersByTimeAsync(400)
    expect(format).not.toHaveBeenCalled()
    await wrapper.get('textarea').setValue('edited')
    await vi.advanceTimersByTimeAsync(301)
    expect(format).toHaveBeenCalledTimes(1)
    await wrapper.get('textarea').setValue('pending')
    state.workspace.activeJobId = 'B'
    state.workspace.sourceCode = 'B'
    await vi.advanceTimersByTimeAsync(400)
    expect(format).toHaveBeenCalledTimes(1)
    await wrapper.get('textarea').setValue('another')
    state.config.autoFormat = false
    await vi.advanceTimersByTimeAsync(400)
    expect(format).toHaveBeenCalledTimes(1)
    state.config.autoFormat = true
    await wrapper.get('textarea').setValue('last')
    wrapper.unmount()
    await vi.advanceTimersByTimeAsync(400)
    expect(format).toHaveBeenCalledTimes(1)
  })
})
