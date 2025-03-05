<script lang="ts" setup>
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="relative py-4">
    <div class="relative mb-4">
      <h3 class="text-2xl font-medium">{{ title }}</h3>
    </div>
    <div class="relative flex flex-col gap-4">
      <slot />
    </div>
  </div>
</template>
