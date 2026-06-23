<script lang="ts" setup>
import { Palette } from '@lucide/vue'
import { computed, shallowRef, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  hexToRgb,
  isHexColor,
  normalizeHexColor,
  rgbToHex,
} from '@/utils/themeColor'
import type { RgbColor } from '@/utils/themeColor'

const props = defineProps<{
  ariaDescribedby?: string
  ariaLabelledby?: string
}>()

const model = defineModel<string>({ required: true })

const presetColors = [
  '#242424',
  '#0f75bc',
  '#16a34a',
  '#dc2626',
  '#9333ea',
  '#ea580c',
]

const textValue = shallowRef('')
const colorValue = computed(() => normalizeHexColor(model.value))
const rgbValue = computed(() => hexToRgb(colorValue.value))

watch(
  colorValue,
  value => {
    textValue.value = value
  },
  { immediate: true },
)

function setColor(value: string) {
  model.value = normalizeHexColor(value, model.value)
}

function handleTextInput(value: string | number) {
  textValue.value = String(value)

  if (isHexColor(textValue.value)) {
    setColor(textValue.value)
  }
}

function handleTextChange() {
  setColor(textValue.value)
  textValue.value = colorValue.value
}

function handleColorInput(event: Event) {
  setColor((event.target as HTMLInputElement).value)
}

function updateRgbChannel(channel: keyof RgbColor, event: Event) {
  const value = Number((event.target as HTMLInputElement).value)

  if (!Number.isFinite(value)) {
    return
  }

  model.value = rgbToHex({
    ...rgbValue.value,
    [channel]: value,
  })
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        :aria-describedby="props.ariaDescribedby"
        :aria-labelledby="props.ariaLabelledby"
        class="w-40 justify-start gap-2"
        type="button"
        variant="outline"
      >
        <span
          :style="{ backgroundColor: colorValue }"
          class="size-4 shrink-0 rounded-sm border"
        />
        <span class="font-mono text-xs uppercase">{{ colorValue }}</span>
        <Palette class="ml-auto size-4 opacity-60" />
      </Button>
    </PopoverTrigger>

    <PopoverContent
      align="end"
      class="w-64 space-y-4"
    >
      <div class="flex items-center gap-3">
        <input
          @input="handleColorInput"
          :aria-labelledby="props.ariaLabelledby"
          :value="colorValue"
          class="h-10 w-12 cursor-pointer rounded-md border bg-transparent p-1"
          type="color"
        />
        <Input
          @change="handleTextChange"
          @update:model-value="handleTextInput"
          :aria-labelledby="props.ariaLabelledby"
          :model-value="textValue"
          class="font-mono uppercase"
          inputmode="text"
          maxlength="7"
        />
      </div>

      <div class="grid grid-cols-3 gap-2">
        <label class="space-y-1 text-xs font-medium text-muted-foreground">
          <span>R</span>
          <Input
            @input="updateRgbChannel('red', $event)"
            :model-value="rgbValue.red"
            max="255"
            min="0"
            type="number"
          />
        </label>
        <label class="space-y-1 text-xs font-medium text-muted-foreground">
          <span>G</span>
          <Input
            @input="updateRgbChannel('green', $event)"
            :model-value="rgbValue.green"
            max="255"
            min="0"
            type="number"
          />
        </label>
        <label class="space-y-1 text-xs font-medium text-muted-foreground">
          <span>B</span>
          <Input
            @input="updateRgbChannel('blue', $event)"
            :model-value="rgbValue.blue"
            max="255"
            min="0"
            type="number"
          />
        </label>
      </div>

      <div class="grid grid-cols-6 gap-2">
        <button
          @click="setColor(color)"
          v-for="color in presetColors"
          :key="color"
          :aria-label="color"
          :style="{ backgroundColor: color }"
          class="size-7 rounded-md border ring-offset-background transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          type="button"
        />
      </div>
    </PopoverContent>
  </Popover>
</template>
