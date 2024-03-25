<script lang="ts" setup>
import { inject, ref } from 'vue'
import { dropdownContextKey } from './ctx'

defineProps<{
  text?: string
  description?: string
  icon?: string
  checked?: boolean
}>()
const emits = defineEmits<{
  click: [evt: MouseEvent]
}>()

const { hide } = inject(dropdownContextKey, undefined) || {}
const elRef = ref<HTMLDivElement>()

const handleClick = (evt: MouseEvent) => {
  hide?.()
  emits('click', evt)
}
</script>

<template>
  <div
    @click="handleClick"
    v-bind="$attrs"
    ref="elRef"
    :aria-label="text"
    class="flex cursor-pointer items-center justify-between gap-2 px-3 py-2 hover:bg-zinc-100"
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
        v-if="!checked"
        class="h-[1.2em] w-[1.2em]"
      />
    </div>

    <div
      v-if="checked"
      class="i-ri-check-line"
    />
  </div>
</template>
