<script lang="ts" setup>
import { i18n } from '#i18n'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import SettingsContent from './SettingsContent.vue'

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent class="w-[min(720px,92vw)] max-w-none p-0">
      <SheetHeader class="border-b px-6 py-4">
        <SheetTitle>{{ i18n.t('settings') }}</SheetTitle>
        <SheetDescription>{{ i18n.t('prettierOptions') }}</SheetDescription>
      </SheetHeader>

      <div class="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        <SettingsContent />
      </div>
    </SheetContent>
  </Sheet>
</template>
