import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, reactive } from 'vue'
import EditorSource from '@/components/EditorSource.vue'

const state = vi.hoisted(() => ({
  workspace: {},
  config: {},
}))
vi.mock('@/stores/workspace', () => ({
  useWorkspaceStore: () => state.workspace,
}))
vi.mock('@/stores/config', () => ({
  useConfigStore: () => state.config,
}))

describe('source auto formatting', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  function setup() {
    const workspace = reactive({
      activeJobId: 'a',
      sourceCode: '',
      languageId: 'javascript',
      formatActiveJob: vi.fn(),
    })
    const config = reactive({ autoFormat: true })
    state.workspace = workspace
    state.config = config
    const wrapper = mount(EditorSource, { global: { stubs: { Editor: true } } })
    return {
      workspace,
      config,
      wrapper,
    }
  }

  it('debounces source edits', async () => {
    const { workspace, wrapper } = setup()
    workspace.sourceCode = 'a'
    await nextTick()
    await vi.advanceTimersByTimeAsync(200)
    workspace.sourceCode = 'b'
    await nextTick()
    await vi.advanceTimersByTimeAsync(200)
    expect(workspace.formatActiveJob).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(100)
    expect(workspace.formatActiveJob).toHaveBeenCalledOnce()
    wrapper.unmount()
  })

  it.each(['unmount', 'disable', 'switch'] as const)(
    'cancels a pending format on %s',
    async action => {
      const { workspace, config, wrapper } = setup()
      workspace.sourceCode = 'draft'
      await nextTick()
      if (action === 'unmount') {
        wrapper.unmount()
      }
      if (action === 'disable') {
        config.autoFormat = false
      }
      if (action === 'switch') {
        workspace.activeJobId = 'b'
        workspace.sourceCode = 'other draft'
      }
      await nextTick()
      await vi.advanceTimersByTimeAsync(300)
      expect(workspace.formatActiveJob).not.toHaveBeenCalled()
      if (action !== 'unmount') {
        wrapper.unmount()
      }
    },
  )
})
