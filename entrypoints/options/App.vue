<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useThemeColor } from '@/composables/themeColor'

useThemeColor()
</script>

<template>
  <TooltipProvider>
    <main class="h-screen min-w-[720px] flex flex-col">
      <Navbar class="h-[var(--h-header)]" />
      <RouterView class="h-[calc(100vh-var(--h-header))]" />
    </main>
    <Toaster class="pointer-events-auto" />
  </TooltipProvider>
</template>
