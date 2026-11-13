import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import StorageStatus from '@/components/StorageStatus.vue'
import { reportStorageError, storageErrors } from '@/composables/storageErrors'

describe('storage failure status', () => {
  afterEach(() => {
    storageErrors.value = {}
  })

  it('keeps failures visible until the affected key succeeds', async () => {
    storageErrors.value = {}
    const wrapper = mount(StorageStatus)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    reportStorageError('local:semi', new Error('Quota exceeded'))
    reportStorageError('local:printWidth', new Error('Unavailable'))
    await wrapper.vm.$nextTick()
    expect(wrapper.get('[role="alert"]').text()).toContain('Quota exceeded')
    reportStorageError('local:printWidth')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Quota exceeded')
    expect(wrapper.text()).not.toContain('Unavailable')
    reportStorageError('local:semi')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    wrapper.unmount()
  })
})
