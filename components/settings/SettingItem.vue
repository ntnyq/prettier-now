<script lang="ts" setup>
import { computed, useSlots } from 'vue'

defineProps<{
  title: string
  description?: string
}>()

const slots = useSlots()
const typedSlots = slots as { description?: unknown }
const hasDescriptionSlot = computed(() => Boolean(typedSlots.description))
</script>

<template>
  <div
    class="flex flex-col gap-4 rounded-lg border bg-card p-4 text-card-foreground sm:flex-row sm:items-center sm:justify-between"
  >
    <div class="min-w-0 space-y-1">
      <div class="text-sm font-medium">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <p
        v-if="hasDescriptionSlot || description"
        class="text-sm text-muted-foreground"
      >
        <slot name="description">
          {{ description }}
        </slot>
      </p>
    </div>

    <div class="flex shrink-0 items-center justify-end">
      <slot name="action" />
    </div>
  </div>
</template>
