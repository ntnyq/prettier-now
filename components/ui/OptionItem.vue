<script lang="ts" setup>
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="relative flex flex-col gap-2 border border-base rounded-lg p-4">
    <div class="flex items-center justify-between">
      <h3 class="text-2xl font-500">
        <slot name="title">
          {{ title }}
        </slot>
      </h3>
      <div class="max-w-300px min-w-160px flex flex-none flex-row items-center justify-end">
        <slot name="action" />
      </div>
    </div>
    <p class="text-lg text-zinc-500 dark:text-zinc-300">
      <slot name="description">
        {{ description }}
      </slot>
    </p>
  </div>
</template>
