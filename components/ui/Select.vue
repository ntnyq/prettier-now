<script lang="ts" setup>
import { Menu as VMenu } from 'floating-vue'
import { computed, ref, useTemplateRef } from 'vue'
import { isDark } from '@/composables/dark'
import { waitFor } from '@/utils'

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

const keyword = ref('')
const menuRef = useTemplateRef('menuRef')
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
const filteredFormatedItems = computed(() => {
  if (!keyword.value) {
    return formatedItems.value
  }
  return formatedItems.value.filter(item =>
    item.label.toLowerCase().includes(keyword.value.toLowerCase()),
  )
})

async function handleMenuHide() {
  // Hack to ensure menu popper is hide
  await waitFor(200)
  keyword.value = ''
}
function handleSelect(value: string) {
  menuRef.value?.hide()
  modelValue.value = value
}
</script>

<template>
  <VMenu
    @hide="handleMenuHide"
    ref="menuRef"
    :delay="{
      show: 100,
      hide: 100,
    }"
    :class="{ dark: isDark }"
    class="flex"
  >
    <button
      role="button"
      type="button"
      class="h-10 min-w-120px flex items-center justify-between gap-1 border border-base rounded-md pl-2"
    >
      <span class="block h-9 max-w-280px of-x-auto whitespace-nowrap lh-9">{{ showValue }}</span>
      <div class="i-ri:arrow-drop-down-line text-xl text-zinc-400" />
    </button>
    <template #popper>
      <input
        v-model.trim="keyword"
        v-if="formatedItems.length > 10"
        type="text"
        placeholder="Search items..."
        class="h-10 w-full border border-base rounded-t-md px-2"
      />
      <div class="v-select-item-wrapper">
        <DropdownItem
          @click="handleSelect(item.value)"
          v-for="item in filteredFormatedItems"
          :key="item.value"
          :text="item.label"
          :checked="item.value === modelValue"
        />
      </div>
    </template>
  </VMenu>
</template>

<style lang="css">
.v-select-item-wrapper {
  --at-apply: 'max-h-400px of-y-scroll';
}
</style>
