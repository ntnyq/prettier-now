<script lang="ts" setup>
import { computed, useId } from 'vue'
import type { VNode } from 'vue'

const props = defineProps<{
  id?: string
  title: string
  description?: string
}>()

const slots = defineSlots<{
  /**
   * Replaces the setting title.
   */
  title?: () => VNode[]
  /**
   * Replaces the setting description.
   */
  description?: () => VNode[]
  /**
   * Renders controls with their accessible label and description IDs.
   */
  action?: (props: {
    /**
     * ID of the description, when one is present.
     */
    descriptionId: string | undefined
    /**
     * ID of the setting title.
     */
    titleId: string
  }) => VNode[]
}>()

const fallbackId = useId()

const hasDescriptionSlot = computed(() => Boolean(slots.description))
const baseId = computed(() => props.id ?? `setting-${fallbackId}`)
const titleId = computed(() => `${baseId.value}-title`)
const descriptionId = computed(() =>
  hasDescriptionSlot.value || props.description
    ? `${baseId.value}-description`
    : undefined,
)
</script>

<template>
  <div
    class="flex flex-col gap-4 rounded-lg border bg-card p-4 text-card-foreground sm:flex-row sm:items-center sm:justify-between"
  >
    <div class="min-w-0 space-y-1">
      <div
        :id="titleId"
        class="text-sm font-medium"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <p
        v-if="hasDescriptionSlot || description"
        :id="descriptionId"
        class="text-sm text-muted-foreground"
      >
        <slot name="description">
          {{ description }}
        </slot>
      </p>
    </div>

    <div class="flex shrink-0 items-center justify-end">
      <slot
        :description-id
        :title-id
        name="action"
      />
    </div>
  </div>
</template>
