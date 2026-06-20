<script lang="ts" setup>
import { i18n } from '#i18n'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import SettingsContent from './SettingsContent.vue'

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent
      class="max-h-[min(860px,92vh)] !w-[min(960px,96vw)] !max-w-[min(960px,96vw)] grid-rows-[auto_minmax(0,1fr)] p-0"
    >
      <DialogHeader class="border-b px-6 py-4">
        <DialogTitle>{{ i18n.t('settings') }}</DialogTitle>
        <DialogDescription>{{ i18n.t('prettierOptions') }}</DialogDescription>
      </DialogHeader>

      <div class="min-h-0 overflow-y-auto px-6 py-6">
        <SettingsContent />
      </div>
    </DialogContent>
  </Dialog>
</template>
