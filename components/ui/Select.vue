<script lang="ts" setup>
import { Menu as VMenu } from 'floating-vue'
import { computed } from 'vue'
import { isDark } from '@/composables/useDark'

type SelectItem = string | { label: string; value: string }

const props = withDefaults(
  defineProps<{
    items?: SelectItem[]
  }>(),
  {
    items: () => [],
  },
)
const modelValue = defineModel<string>()

const formatedItems = computed(() =>
  props.items.map(item =>
    typeof item === 'string'
      ? {
          label: item,
          value: item,
        }
      : item,
  ),
)
const showValue = computed(() => {
  const item = formatedItems.value.find(item => item.value === modelValue.value)
  return item ? item.label : modelValue.value
})

function handleSelect(value: string) {
  modelValue.value = value
}
</script>

<template>
  <VMenu
    :class="{ dark: isDark }"
    class="flex"
    popper-class="v-select-popper-container"
  >
    <button
      role="button"
      class="min-w-120px flex items-center justify-between gap-1 border border-base rounded-md py-2 pl-2"
    >
      <span class="max-w-160px whitespace-normal">{{ showValue }}</span>
      <div class="i-ri-arrow-drop-down-line text-xl text-zinc-400" />
    </button>
    <template #popper>
      <DropdownItem
        @click="handleSelect(item.value)"
        v-for="item in formatedItems"
        :key="item.value"
        :text="item.label"
        :checked="item.value === modelValue"
      />
    </template>
  </VMenu>
</template>

<style lang="css">
.v-select-popper-container .v-popper__inner {
  --at-apply: 'max-h-400px of-y-auto';
}
</style>
