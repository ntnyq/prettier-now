<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import { AccordionItem, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'
import type { AccordionItemProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<
  AccordionItemProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <AccordionItem
    v-slot="slotProps"
    v-bind="forwardedProps"
    :class="cn('border-b last:border-b-0', props.class)"
    data-slot="accordion-item"
  >
    <slot v-bind="slotProps" />
  </AccordionItem>
</template>
