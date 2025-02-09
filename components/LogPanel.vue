<script lang="ts" setup>
import { useLogStore } from '@/stores/log'
import { i18n } from '#i18n'

const logStore = useLogStore()
</script>

<template>
  <Modal
    v-model:visible="logStore.isLogPanelVisible"
    direction="right"
  >
    <div class="relative h-full w-120">
      <div class="flex items-center justify-between px-4 py-2">
        <h2 class="text-lg font-semibold">{{ i18n.t('log') }}</h2>
      </div>
    </div>
  </Modal>
</template>
