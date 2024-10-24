<script lang="ts" setup>
const number = defineModel<number>({ default: 0 })
</script>

<template>
  <input
    v-model="number"
    :min="0"
    :step="1"
    type="number"
    class="h-10 w-[120px] flex items-center justify-between gap-1 border border-base rounded-md px-2"
  />
</template>
