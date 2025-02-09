<script lang="ts" setup>
const isChecked = defineModel<boolean>({ default: false })
</script>

<template>
  <button
    @click="isChecked = !isChecked"
    :class="[
      isChecked ?
        'bg-zinc-800 dark:bg-zinc-200'
      : 'bg-zinc-200 dark:bg-zinc-600',
    ]"
    type="button"
    role="switch"
    class="focus-visible:ring-ring focus-visible:ring-offset-background h-5 w-9 inline-flex shrink-0 cursor-pointer items-center border-2 border-transparent rounded-full shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
  >
    <span
      :class="[isChecked ? 'translate-x-4' : 'translate-x-0']"
      class="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform dark:bg-zinc-800"
    />
  </button>
</template>
