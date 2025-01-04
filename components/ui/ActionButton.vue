<script lang="ts" setup>
defineProps<{
  label?: string
  icon?: string
  labelClass?: string
}>()
</script>

<template>
  <button
    :aria-label="label"
    type="button"
    role="button"
    class="btn-action"
  >
    <div
      v-if="icon"
      :class="icon"
      class="mr-2"
    />
    <span :class="labelClass">
      <slot>
        {{ label }}
      </slot>
    </span>
  </button>
</template>
