<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import { Separator } from 'reka-ui'
import { cn } from '@/lib/utils'
import type { SeparatorProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<
  SeparatorProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <Separator
    v-bind="delegatedProps"
    :class="cn('bg-border -mx-1 h-px', props.class)"
    data-slot="command-separator"
  >
    <slot />
  </Separator>
</template>
