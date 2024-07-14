<script lang="ts" setup>
import { computed } from 'vue'
import { isDark } from '@/hooks/useDark'

type SelectItem = string | { label: string; value: string }

const props = withDefaults(
  defineProps<{
    items?: SelectItem[]
    modelValue?: string
  }>(),
  {
    items: () => [],
  },
)
const emits = defineEmits<{
  'update:modelValue': [value: string]
}>()

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
  const item = formatedItems.value.find(item => item.value === props.modelValue)
  return item ? item.label : props.modelValue
})
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
      <span>{{ showValue }}</span>
      <div class="i-ri-arrow-drop-down-line text-lg text-zinc-400" />
    </button>
    <template #popper>
      <DropdownItem
        @click="emits('update:modelValue', item.value)"
        v-for="item in formatedItems"
        :key="item.value"
        :text="item.label"
        :checked="item.value === modelValue"
      />
    </template>
  </VMenu>
</template>
