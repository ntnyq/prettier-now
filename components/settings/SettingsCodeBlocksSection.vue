<script setup lang="ts">
import { ref, watch } from 'vue'
import { i18n } from '#i18n'
import { Button } from '@/components/ui/button'
import { useCodeBlockSettings } from '@/composables/codeBlockSettings'
import { normalizeCodeBlockHostname } from '@/utils/codeBlocks/settings'
import SettingsSection from './SettingsSection.vue'

const { settings, hasError, isSaving, save, refresh } = useCodeBlockSettings()
const hosts = ref('')
const invalidHosts = ref(false)
watch(settings, value => {
  if (value) {
    hosts.value = value.codeBlockHiddenHosts.join('\n')
  }
})

function saveHosts() {
  if (!settings.value) {
    return
  }
  const values = hosts.value
    .split('\n')
    .filter(value => value.trim())
    .map(normalizeCodeBlockHostname)
  invalidHosts.value = values.some(value => !value) || values.length > 200
  if (!invalidHosts.value) {
    save({
      ...settings.value,
      codeBlockHiddenHosts: [
        ...new Set(values.filter((value): value is string => !!value)),
      ],
    })
  }
}
</script>

<template>
  <SettingsSection :title="i18n.t('codeBlocksTitle')">
    <div class="space-y-3">
      <label class="flex items-center gap-2 text-sm">
        <input
          @change="
            settings
            && save({
              ...settings,
              codeBlockButtons: !settings.codeBlockButtons,
            })
          "
          :checked="settings?.codeBlockButtons"
          :disabled="!settings || isSaving"
          type="checkbox"
        />
        {{ i18n.t('codeBlocksEnable') }}
      </label>
      <label class="block space-y-2 text-sm">
        <span>{{ i18n.t('codeBlocksHosts') }}</span>
        <textarea
          v-model="hosts"
          :disabled="!settings || isSaving"
          rows="3"
          class="block w-full rounded-md border border-input bg-background p-2"
          placeholder="docs.example.com"
        />
      </label>
      <p
        v-if="invalidHosts"
        role="alert"
        class="text-sm text-destructive"
      >
        {{ i18n.t('codeBlocksInvalidHosts') }}
      </p>
      <Button
        @click="saveHosts"
        :disabled="!settings || isSaving"
        variant="outline"
        size="sm"
        >{{ i18n.t('codeBlocksSave') }}</Button
      >
      <p
        v-if="hasError"
        role="alert"
        class="text-sm"
      >
        {{ i18n.t('codeBlocksErrors.STORAGE_UNAVAILABLE') }}
        <button
          @click="refresh"
          type="button"
          class="underline"
        >
          {{ i18n.t('codeBlocksRetry') }}
        </button>
      </p>
      <p class="text-xs text-muted-foreground">
        {{ i18n.t('codeBlocksHistoryNotice') }}
      </p>
    </div>
  </SettingsSection>
</template>
