<script lang="ts" setup>
import { computed } from 'vue'
import { i18n } from '#i18n'
import { Button } from '@/components/ui/button'
import SettingNumberField from './SettingNumberField.vue'

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
   * Smallest supported explicit value.
   */
  min: number
  /**
   * Largest supported explicit value.
   */
  max: number
}

const props = defineProps<Props>()
const model = defineModel<number | null>({ required: true })

const explicitValue = computed({
  get: () => model.value ?? props.min,
  set(value: number) {
    model.value = value
  },
})
</script>

<template>
  <div class="flex items-center gap-2">
    <Button
      @click="model = min"
      v-if="model === null"
      :aria-describedby
      :aria-labelledby="`${ariaLabelledby} ${ariaLabelledby}-default`"
      variant="outline"
    >
      <span :id="`${ariaLabelledby}-default`">
        {{ i18n.t('optionDefault') }}
      </span>
    </Button>
    <template v-else>
      <SettingNumberField
        v-model="explicitValue"
        :aria-describedby
        :aria-labelledby
        :min
        :max
      />
      <Button
        @click="model = null"
        :aria-describedby
        :aria-labelledby="`${ariaLabelledby} ${ariaLabelledby}-reset`"
        variant="ghost"
      >
        <span :id="`${ariaLabelledby}-reset`">
          {{ i18n.t('optionDefault') }}
        </span>
      </Button>
    </template>
  </div>
</template>
