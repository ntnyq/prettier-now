<script setup lang="ts">
import { computed } from 'vue'
import { i18n } from '#i18n'
import { Button } from '@/components/ui/button'
import { useCodeBlockPicker } from '@/composables/codeBlockPicker'
import { useCodeBlockSettings } from '@/composables/codeBlockSettings'

const {
  scanResult,
  selectedIds,
  isBusy,
  hasRetry,
  error,
  resultCounts,
  itemErrors,
  hostname,
  scan,
  submit,
} = useCodeBlockPicker()
const { settings, hasError, isSaving, save, refresh } = useCodeBlockSettings()
const isHidden = computed(() =>
  settings.value?.codeBlockHiddenHosts.includes(hostname.value),
)

function toggleHost() {
  if (!settings.value || !hostname.value) {
    return
  }
  save({
    ...settings.value,
    codeBlockHiddenHosts: isHidden.value
      ? settings.value.codeBlockHiddenHosts.filter(
          host => host !== hostname.value,
        )
      : [...settings.value.codeBlockHiddenHosts, hostname.value],
  })
}
</script>

<template>
  <section class="w-full space-y-3 border-t border-border p-4">
    <Button
      @click="scan"
      :disabled="isBusy"
      class="w-full"
      variant="outline"
    >
      {{ i18n.t(isBusy ? 'codeBlocksScanning' : 'codeBlocksScan') }}
    </Button>
    <p
      v-if="error"
      role="alert"
      class="text-sm text-destructive"
    >
      {{ i18n.t(`codeBlocksErrors.${error}`) }}
    </p>
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
    <template v-if="scanResult">
      <p
        v-if="!scanResult.summaries.length"
        class="text-sm text-muted-foreground"
      >
        {{ i18n.t('codeBlocksErrors.NO_CODE_BLOCKS') }}
      </p>
      <p
        v-if="scanResult.limited"
        class="text-sm"
      >
        {{ i18n.t('codeBlocksLimit') }}
      </p>
      <fieldset
        :disabled="isBusy || hasRetry"
        class="max-h-72 space-y-2 overflow-y-auto"
      >
        <legend class="sr-only">{{ i18n.t('codeBlocksSelect') }}</legend>
        <label
          v-for="item in scanResult.summaries"
          :key="item.blockId"
          class="flex gap-2 rounded-md border border-border p-2 text-sm focus-within:ring-2 focus-within:ring-ring"
        >
          <input
            v-model="selectedIds"
            :value="item.blockId"
            :disabled="
              !!item.error
              || (selectedIds.length >= 8
                && !selectedIds.includes(item.blockId))
            "
            type="checkbox"
          />
          <span class="min-w-0 flex-1">
            <span class="font-medium"
              >{{ item.blockIndex }}.
              {{ item.language.rawLabel ?? i18n.t('codeBlocksUnknown') }}</span
            >
            <pre class="overflow-hidden text-xs">{{ item.preview }}</pre>
            <span class="text-xs text-muted-foreground">{{
              i18n.t('codeBlocksSize', [item.lineCount, item.byteLength])
            }}</span>
            <span
              v-if="item.error"
              class="block text-destructive"
              >{{ i18n.t(`codeBlocksErrors.${item.error}`) }}</span
            >
          </span>
        </label>
      </fieldset>
      <p class="text-xs text-muted-foreground">
        {{ i18n.t('codeBlocksSelected', [selectedIds.length]) }}
      </p>
      <Button
        @click="submit"
        :disabled="!selectedIds.length || isBusy"
        class="w-full"
        >{{ i18n.t('codeBlocksSendSelected') }}</Button
      >
    </template>
    <p
      v-if="resultCounts"
      role="status"
      class="text-sm"
    >
      {{
        i18n.t('codeBlocksSendResult', [resultCounts.sent, resultCounts.failed])
      }}
    </p>
    <p
      v-for="item in itemErrors"
      :key="item.blockId"
      class="text-sm text-destructive"
    >
      {{ i18n.t(`codeBlocksErrors.${item.error}`) }}
    </p>
    <button
      @click="toggleHost"
      v-if="hostname && settings"
      :disabled="isSaving"
      type="button"
      class="text-sm underline"
    >
      {{ i18n.t(isHidden ? 'codeBlocksRestoreHost' : 'codeBlocksHideHost') }}
    </button>
  </section>
</template>
