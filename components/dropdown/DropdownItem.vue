<script lang="ts" setup>
import { inject } from 'vue'
import { dropdownContextKey } from './ctx'

defineProps<{
  text?: string
  description?: string
  icon?: string
  checked?: boolean
  checkable?: boolean
}>()
const emits = defineEmits<{
  click: [evt: MouseEvent]
}>()

const { hide } = inject(dropdownContextKey, undefined) || {}

const handleClick = (evt: MouseEvent) => {
  hide?.()
  emits('click', evt)
}
</script>

<template>
  <div
    @click="handleClick"
    v-bind="$attrs"
    :aria-label="text"
    class="flex cursor-pointer items-center justify-between gap-2 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-600"
  >
    <div class="flex items-center gap-2">
      <div
        v-if="icon"
        :class="icon"
      />
      <slot>
        {{ text }}
      </slot>
      <div
        v-if="!checked && checkable"
        class="h-[1.2em] w-[1.2em]"
      />
    </div>
    <div
      v-if="checked && checkable"
      class="i-ri-check-line"
    />
  </div>
</template>
