<script setup lang="ts">
import { TooltipRoot, useForwardPropsEmits } from 'reka-ui'
import type { TooltipRootEmits, TooltipRootProps } from 'reka-ui'

const props = defineProps<TooltipRootProps>()
const emit = defineEmits<TooltipRootEmits>()

const forwarded = useForwardPropsEmits(props, emit)
</script>

<template>
  <TooltipRoot
    v-slot="slotProps"
    data-slot="tooltip"
    v-bind="forwarded"
  >
    <slot v-bind="slotProps" />
  </TooltipRoot>
</template>
