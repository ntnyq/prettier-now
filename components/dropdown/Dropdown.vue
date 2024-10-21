<script lang="ts" setup>
import { Dropdown as VDropdown } from 'floating-vue'
import { provide, useTemplateRef } from 'vue'
import { isDark } from '@/composables/useDark'
import { dropdownContextKey } from './ctx'
import type { Placement } from 'floating-vue'

defineProps<{
  placement?: Placement
}>()

const dropdownRef = useTemplateRef('dropdownRef')

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
    popper-class="v-dropdown-popper-container"
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

<style lang="css">
.v-dropdown-popper-container .v-popper__inner {
  --at-apply: 'max-h-400px of-y-auto';
}
</style>
