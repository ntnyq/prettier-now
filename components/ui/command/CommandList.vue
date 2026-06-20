<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import { ListboxContent, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'
import type { ListboxContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<
  ListboxContentProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <ListboxContent
    v-bind="forwarded"
    :class="
      cn(
        'max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto',
        props.class,
      )
    "
    data-slot="command-list"
  >
    <div role="presentation">
      <slot />
    </div>
  </ListboxContent>
</template>
