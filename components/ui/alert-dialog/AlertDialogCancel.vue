<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import { AlertDialogCancel, useForwardProps } from 'reka-ui'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AlertDialogCancelProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<
  AlertDialogCancelProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <AlertDialogCancel
    v-bind="forwardedProps"
    :class="cn(buttonVariants({ variant: 'outline' }), props.class)"
    data-slot="alert-dialog-cancel"
  >
    <slot />
  </AlertDialogCancel>
</template>
