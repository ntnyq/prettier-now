<script lang="ts" setup>
import { Dropdown as VDropdown } from 'floating-vue'
import { provide, useTemplateRef } from 'vue'
import { isDark } from '@/composables/dark'
import { dropdownContextKey } from './ctx'
import type { Placement, TriggerEvent } from 'floating-vue'

withDefaults(
  defineProps<{
    placement?: Placement
    showTriggers?: TriggerEvent[]
  }>(),
  {
    placement: 'auto',
    showTriggers: () => ['click'],
  },
)
defineOptions({
  inheritAttrs: false,
})

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
    :show-triggers
    :class="{ dark: isDark }"
    :placement
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
