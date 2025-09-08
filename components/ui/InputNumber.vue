<script lang="ts" setup>
withDefaults(
  defineProps<{
    step?: number
    min?: number
  }>(),
  {
    step: 1,
    min: 0,
  },
)

const number = defineModel<number>({ default: 0 })
</script>

<template>
  <input
    v-model="number"
    :min
    :step
    type="number"
    class="h-10 w-120px flex items-center justify-between gap-1 border border-base rounded-md px-2"
  />
</template>
