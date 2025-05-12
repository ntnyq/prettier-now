<script lang="ts" setup>
import { isString } from '@ntnyq/utils'
import { computed, inject } from 'vue'
import { isDark } from '@/composables/dark'
import { dropdownContextKey } from './ctx'
import type { ThemeableValue } from '@/types'

const props = defineProps<{
  text?: string
  description?: string
  icon?: ThemeableValue<string>
  checked?: boolean
  checkable?: boolean
}>()
const emits = defineEmits<{
  click: [evt: MouseEvent]
}>()
defineOptions({
  inheritAttrs: false,
})

const { hide } = inject(dropdownContextKey, undefined) || {}

const resolvedIcon = computed(() => {
  if (!props.icon) {
    return
  }
  if (isString(props.icon)) {
    return props.icon
  }
  return isDark.value ? props.icon.dark : props.icon.light
})

function handleClick(evt: MouseEvent) {
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
        :class="resolvedIcon"
      />
      <slot>
        {{ text }}
      </slot>
      <div
        v-if="!checked && checkable"
        class="h-1.2em w-1.2em"
      />
    </div>
    <div
      v-if="checked && checkable"
      class="i-ri:check-line"
    />
  </div>
</template>
