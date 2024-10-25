<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { waitFor } from '@/utils'

const props = withDefaults(
  defineProps<{
    direction?: 'top' | 'bottom' | 'left' | 'right'
    mask?: boolean
    dialogClass?: string
    closable?: boolean
    useVIf?: boolean
  }>(),
  {
    direction: 'bottom',
    mask: true,
    closable: true,
    useVIf: false,
  },
)
const emits = defineEmits<{
  clickOutside: []
}>()
const visible = defineModel<boolean>('visible')

const positionClass = computed<string>(() => {
  switch (props.direction) {
    case 'bottom':
      return 'bottom-0 left-0 right-0 border-t'
    case 'top':
      return 'top-0 left-0 right-0 border-b'
    case 'left':
      return 'top-0 bottom-0 left-0 border-r w-max'
    case 'right':
      return 'top-0 bottom-0 right-0 border-l w-max'
    default:
      return ''
  }
})
const containerPositionClass = computed<string>(() => {
  if (props.mask) {
    return 'top-0 bottom-0 left-0 right-0'
  }
  switch (props.direction) {
    case 'bottom':
      return 'bottom-0 left-0 right-0'
    case 'top':
      return 'top-0 left-0 right-0'
    case 'left':
      return 'top-0 bottom-0 left-0'
    case 'right':
      return 'top-0 bottom-0 right-0'
    default:
      return ''
  }
})
const transform = computed<string>(() => {
  switch (props.direction) {
    case 'bottom':
      return 'translateY(100%)'
    case 'top':
      return 'translateY(-100%)'
    case 'left':
      return 'translateX(-100%)'
    case 'right':
      return 'translateX(100%)'
    default:
      return ''
  }
})

function onClickEmptySpace() {
  if (props.closable) {
    visible.value = false
  }
  emits('clickOutside')
}

const enable = ref(false)

watch(
  () => visible.value,
  async value => {
    if (!value) {
      await waitFor(500)
    }
    enable.value = !!value
  },
)

const show = ref(false)

watch(
  () => visible.value,
  async value => {
    if (value) {
      await waitFor(0)
    }
    show.value = !!value
  },
)
</script>

<template>
  <div
    v-if="!useVIf || enable"
    :class="[
      containerPositionClass,
      show ? '' : 'pointer-events-none',
      show ? 'opacity-100' : 'opacity-0',
    ]"
    class="fixed z-dialog transition-opacity duration-100 ease-out"
  >
    <div
      @click="onClickEmptySpace"
      v-if="mask"
      :class="show ? 'opacity-50' : 'opacity-0'"
      class="absolute bottom-0 left-0 right-0 top-0 bg-base transition-opacity duration-500 ease-out"
    />

    <div
      :class="[positionClass, dialogClass]"
      :style="show ? {} : { transform }"
      class="scrolls absolute max-h-screen max-w-screen overflow-auto border-base bg-base transition-all duration-200 ease-out"
    >
      <slot />
    </div>
  </div>
</template>
