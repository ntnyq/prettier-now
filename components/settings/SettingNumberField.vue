<script lang="ts" setup>
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'

const props = withDefaults(
  defineProps<{
    ariaDescribedby?: string
    ariaLabelledby?: string
    min?: number
    max?: number
    step?: number
  }>(),
  {
    min: 0,
    step: 1,
  },
)

const model = defineModel<number>({ required: true })
</script>

<template>
  <NumberField
    v-model="model"
    :aria-describedby="props.ariaDescribedby"
    :aria-labelledby="props.ariaLabelledby"
    :max="props.max"
    :min="props.min"
    :step="props.step"
    class="w-28"
  >
    <NumberFieldContent>
      <NumberFieldDecrement />
      <NumberFieldInput />
      <NumberFieldIncrement />
    </NumberFieldContent>
  </NumberField>
</template>
