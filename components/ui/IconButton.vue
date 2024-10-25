<script lang="ts" setup>
defineProps<{
  icon: string
  href?: string
  tooltip?: string
  iconClass?: string
}>()
</script>

<template>
  <component
    v-tooltip="{ content: tooltip }"
    :is="href ? 'a' : 'button'"
    :type="href ? 'link' : 'button'"
    :aria-label="tooltip"
    role="button"
    class="icon-button"
  >
    <slot>
      <span
        :class="[icon, iconClass]"
        class="block"
      />
    </slot>
  </component>
</template>
