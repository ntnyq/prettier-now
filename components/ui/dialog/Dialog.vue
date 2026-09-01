<script setup lang="ts">
import { DialogRoot, useForwardPropsEmits } from 'reka-ui'
import type { DialogRootEmits, DialogRootProps } from 'reka-ui'

const props = defineProps<DialogRootProps>()
const emit = defineEmits<DialogRootEmits>()

const forwarded = useForwardPropsEmits(props, emit)
</script>

<template>
  <DialogRoot
    v-slot="slotProps"
    data-slot="dialog"
    v-bind="forwarded"
  >
    <slot v-bind="slotProps" />
  </DialogRoot>
</template>
