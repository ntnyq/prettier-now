<script lang="ts" setup>
import { computed } from 'vue'
import { i18n } from '#i18n'
import { storageErrors } from '@/composables/storageErrors'

const messages = computed(() => [
  ...new Set(Object.values(storageErrors.value)),
])
</script>

<template>
  <div
    v-if="messages.length"
    class="shrink-0 border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive"
    role="alert"
  >
    <p
      v-for="message in messages"
      :key="message"
    >
      {{ i18n.t('storageSaveFailed', [message]) }}
    </p>
  </div>
</template>
