<script lang="ts" setup>
import { useConfigStore } from '@/stores/config'

// Init config store
// Maybe there is a better way to do this
useConfigStore()
</script>

<template>
  <main class="h-screen flex flex-col">
    <Navbar class="mb-1" />
    <RouterView />
  </main>
</template>
