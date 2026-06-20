<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import { AlertDialogTrigger, useForwardProps } from 'reka-ui'
import type { AlertDialogTriggerProps } from 'reka-ui'

const props = defineProps<AlertDialogTriggerProps>()

const delegatedProps = reactiveOmit(props)

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <AlertDialogTrigger
    v-bind="forwardedProps"
    data-slot="alert-dialog-trigger"
  >
    <slot />
  </AlertDialogTrigger>
</template>
