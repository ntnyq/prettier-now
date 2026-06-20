<script lang="ts" setup>
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'

withDefaults(
  defineProps<{
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
    :max
    :min
    :step
    class="w-28"
  >
    <NumberFieldContent>
      <NumberFieldDecrement />
      <NumberFieldInput />
      <NumberFieldIncrement />
    </NumberFieldContent>
  </NumberField>
</template>
