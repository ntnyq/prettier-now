<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import { ListboxGroup, ListboxGroupLabel, useId } from 'reka-ui'
import { computed, onMounted, onUnmounted } from 'vue'
import { cn } from '@/lib/utils'
import { provideCommandGroupContext, useCommand } from '.'
import type { ListboxGroupProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<
  ListboxGroupProps & {
    class?: HTMLAttributes['class']
    heading?: string
  }
>()

const delegatedProps = reactiveOmit(props, 'class')

const { allGroups, filterState } = useCommand()
const id = useId()

const isRender = computed(() =>
  filterState.search ? filterState.filtered.groups.has(id) : true,
)

provideCommandGroupContext({ id })
onMounted(() => {
  if (!allGroups.value.has(id)) {
    allGroups.value.set(id, new Set())
  }
})
onUnmounted(() => {
  allGroups.value.delete(id)
})
</script>

<template>
  <ListboxGroup
    v-bind="delegatedProps"
    :class="cn('text-foreground overflow-hidden p-1', props.class)"
    :hidden="isRender ? undefined : true"
    :id
    data-slot="command-group"
  >
    <ListboxGroupLabel
      v-if="heading"
      data-slot="command-group-heading"
      class="px-2 py-1.5 text-xs font-medium text-muted-foreground"
    >
      {{ heading }}
    </ListboxGroupLabel>
    <slot />
  </ListboxGroup>
</template>
