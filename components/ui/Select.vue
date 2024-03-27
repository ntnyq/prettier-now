<script lang="ts" setup>
withDefaults(
  defineProps<{
    items?: string[]
    modelValue?: string
  }>(),
  {
    items: () => [],
  },
)
const emits = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <VMenu
    :class="{ dark: isDark }"
    class="flex"
  >
    <button
      role="button"
      class="h-10 min-w-[120px] flex items-center justify-between gap-1 border border-base rounded-md px-2 px-3"
    >
      <span>{{ modelValue }}</span>
      <div class="i-ri-arrow-drop-down-line text-lg text-zinc-400" />
    </button>
    <template #popper>
      <DropdownItem
        @click="emits('update:modelValue', item)"
        v-for="item in items"
        :key="item"
        :text="item"
        :checked="item === modelValue"
      />
    </template>
  </VMenu>
</template>
