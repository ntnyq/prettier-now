<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useThemeColor } from '@/composables/themeColor'

useThemeColor()
</script>

<template>
  <TooltipProvider>
    <main class="h-screen min-w-180 flex flex-col">
      <Navbar class="h-(--h-header)" />
      <StorageStatus />
      <RouterView class="min-h-0 flex-1" />
    </main>
    <Toaster class="pointer-events-auto" />
  </TooltipProvider>
</template>
