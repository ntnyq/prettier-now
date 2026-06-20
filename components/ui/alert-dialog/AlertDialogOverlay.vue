<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import { AlertDialogOverlay } from 'reka-ui'
import { cn } from '@/lib/utils'
import type { AlertDialogOverlayProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<
  AlertDialogOverlayProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <AlertDialogOverlay
    v-bind="delegatedProps"
    :class="
      cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80',
        props.class,
      )
    "
    data-slot="alert-dialog-overlay"
  >
    <slot />
  </AlertDialogOverlay>
</template>
