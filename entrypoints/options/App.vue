<script lang="ts" setup>
import { useConfigStore } from '@/stores/config'

const { locale } = useI18n()

// Init config store
// Maybe there is a better way to do this
const configStore = useConfigStore()

watch(
  () => configStore.locale,
  () => {
    locale.value = configStore.locale
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <main class="h-screen min-w-[720px] flex flex-col">
    <Navbar class="h-$h-header" />
    <RouterView class="h-[calc(100vh-var(--h-header))]" />
  </main>
</template>
