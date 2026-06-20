<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import { buttonVariants } from '.'
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import type { ButtonVariants } from '.'

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})
</script>

<template>
  <Primitive
    :data-variant="variant"
    :data-size="size"
    :as
    :as-child
    :class="cn(buttonVariants({ variant, size }), props.class)"
    data-slot="button"
  >
    <slot />
  </Primitive>
</template>
