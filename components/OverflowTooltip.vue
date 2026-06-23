<script lang="ts" setup>
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
  text: string
}>()

const textRef = useTemplateRef<HTMLElement>('text')
const isOverflowing = shallowRef(false)
let resizeObserver: ResizeObserver | undefined

function updateOverflowState() {
  const element = textRef.value

  if (!element) {
    isOverflowing.value = false
    return
  }

  isOverflowing.value = element.scrollWidth > element.clientWidth
}

watch(
  () => props.text,
  async () => {
    await nextTick()
    updateOverflowState()
  },
)

onMounted(() => {
  updateOverflowState()

  resizeObserver = new ResizeObserver(updateOverflowState)

  if (textRef.value) {
    resizeObserver.observe(textRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <Tooltip :disabled="!isOverflowing">
    <TooltipTrigger as-child>
      <span
        ref="text"
        :class="cn('truncate', props.class)"
      >
        {{ text }}
      </span>
    </TooltipTrigger>
    <TooltipContent class="max-w-80 break-all">
      {{ text }}
    </TooltipContent>
  </Tooltip>
</template>
