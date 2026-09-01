<script setup lang="ts">
import { DropdownMenuSub, useForwardPropsEmits } from 'reka-ui'
import type { DropdownMenuSubEmits, DropdownMenuSubProps } from 'reka-ui'

const props = defineProps<DropdownMenuSubProps>()
const emit = defineEmits<DropdownMenuSubEmits>()

const forwarded = useForwardPropsEmits(props, emit)
</script>

<template>
  <DropdownMenuSub
    v-slot="slotProps"
    data-slot="dropdown-menu-sub"
    v-bind="forwarded"
  >
    <slot v-bind="slotProps" />
  </DropdownMenuSub>
</template>
