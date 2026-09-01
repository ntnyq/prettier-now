<script setup lang="ts">
import { PopoverRoot, useForwardPropsEmits } from 'reka-ui'
import type { PopoverRootEmits, PopoverRootProps } from 'reka-ui'

const props = defineProps<PopoverRootProps>()
const emit = defineEmits<PopoverRootEmits>()

const forwarded = useForwardPropsEmits(props, emit)
</script>

<template>
  <PopoverRoot
    v-slot="slotProps"
    data-slot="popover"
    v-bind="forwarded"
  >
    <slot v-bind="slotProps" />
  </PopoverRoot>
</template>
