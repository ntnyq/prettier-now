<script lang="ts" setup>
import { Switch } from '@/components/ui/switch'

const props = defineProps<{
  ariaDescribedby?: string
  ariaLabelledby?: string
}>()

const model = defineModel<boolean>({ required: true })
</script>

<template>
  <Switch
    v-model="model"
    :aria-describedby="props.ariaDescribedby"
    :aria-labelledby="props.ariaLabelledby"
  />
</template>
