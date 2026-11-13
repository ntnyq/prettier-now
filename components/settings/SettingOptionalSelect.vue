<script lang="ts" setup generic="T extends string | boolean">
import { computed } from 'vue'
import { i18n } from '#i18n'
import SettingSelect from './SettingSelect.vue'

interface Props {
  /**
   * Description of the formatting option.
   */
  ariaDescribedby?: string
  /**
   * Label of the formatting option.
   */
  ariaLabelledby?: string
  /**
   * Explicit supported values, in display order.
   */
  items: readonly T[]
}

const props = defineProps<Props>()
const model = defineModel<T | null>({ required: true })

const selectedValue = computed({
  get: () => (model.value === null ? 'default' : String(model.value)),
  set(value: string) {
    model.value = props.items.find(item => String(item) === value) ?? null
  },
})
const selectItems = computed(() => [
  { label: i18n.t('optionDefault'), value: 'default' },
  ...props.items.map(item => ({
    label:
      typeof item === 'boolean'
        ? i18n.t(item ? 'optionEnabled' : 'optionDisabled')
        : String(item),
    value: String(item),
  })),
])
</script>

<template>
  <SettingSelect
    v-model="selectedValue"
    :aria-describedby
    :aria-labelledby
    :items="selectItems"
  />
</template>
