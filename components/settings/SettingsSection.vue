<script lang="ts" setup>
defineProps<{
  title: string
}>()
</script>

<template>
  <section class="space-y-3">
    <h2 class="text-lg font-semibold text-foreground">
      {{ title }}
    </h2>

    <div class="space-y-3">
      <slot />
    </div>
  </section>
</template>
