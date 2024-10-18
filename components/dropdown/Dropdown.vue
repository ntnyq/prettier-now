<script lang="ts" setup>
import { Dropdown as VDropdown } from 'floating-vue'
import { provide, ref } from 'vue'
import { isDark } from '@/composables/useDark'
import { dropdownContextKey } from './ctx'
import type { Placement } from 'floating-vue'

defineProps<{
  placement?: Placement
}>()

const dropdownRef = ref<InstanceType<typeof VDropdown>>()

provide(dropdownContextKey, {
  hide: () => {
    dropdownRef.value?.hide()
  },
})
</script>

<template>
  <VDropdown
    v-bind="$attrs"
    ref="dropdownRef"
    :show-triggers="['click']"
    :class="{ dark: isDark }"
    :placement="placement || 'auto'"
  >
    <slot />
    <template #popper="scope">
      <slot
        name="popper"
        v-bind="scope"
      />
    </template>
  </VDropdown>
</template>
