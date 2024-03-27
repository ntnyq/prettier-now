<script lang="ts" setup>
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-row items-center justify-between gap-20 border rounded-lg p-4">
    <div class="flex flex-col">
      <h3 class="mb-2 text-2xl font-500">
        <slot name="title">
          {{ title }}
        </slot>
      </h3>
      <p class="text-lg text-zinc-500">
        <slot name="description">
          {{ description }}
        </slot>
      </p>
    </div>
    <div class="flex flex-row items-center">
      <slot name="action" />
    </div>
  </div>
</template>
