<script setup lang="ts">
import { AccordionRoot, useForwardPropsEmits } from 'reka-ui'
import type { AccordionRootEmits, AccordionRootProps } from 'reka-ui'

const props = defineProps<AccordionRootProps>()
const emit = defineEmits<AccordionRootEmits>()

const forwarded = useForwardPropsEmits(props, emit)
</script>

<template>
  <AccordionRoot
    v-slot="slotProps"
    data-slot="accordion"
    v-bind="forwarded"
  >
    <slot v-bind="slotProps" />
  </AccordionRoot>
</template>
