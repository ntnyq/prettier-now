<script lang="ts" setup>
import { useFileDialog } from '@vueuse/core'
import { computed, shallowRef } from 'vue'
import { i18n } from '#i18n'
import { useOptionsStore } from '@/stores/options'
import {
  parseOptionsSnapshot,
  stringifyOptionsSnapshot,
} from '@/utils/optionsPreset'
import { Toast } from '@/utils/toast'
import { downloadTextFile } from '@/utils/workspace'

const optionsStore = useOptionsStore()
const presetName = shallowRef('')
const selectedPresetId = shallowRef('')
const presetItems = computed(() =>
  optionsStore.presets.map(preset => ({
    label: preset.name,
    value: preset.id,
  })),
)
const hasPresets = computed(() => presetItems.value.length > 0)

const {
  open: openImportDialog,
  reset: resetImportDialog,
  onChange: handleImportChange,
} = useFileDialog({
  accept: 'application/json,.json',
  multiple: false,
})

handleImportChange(async files => {
  const file = files?.[0]

  if (!file) {
    return
  }

  try {
    const snapshot = parseOptionsSnapshot(await file.text())
    optionsStore.applySnapshot(snapshot)
    Toast.info(i18n.t('importOptionsSuccess'))
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : i18n.t('importOptionsFailed')
    Toast.error(message)
  } finally {
    resetImportDialog()
  }
})

function savePreset() {
  const name = presetName.value.trim()

  if (!name) {
    Toast.info(i18n.t('presetNameRequired'))
    return
  }

  optionsStore.savePreset(name)
  presetName.value = ''
  Toast.info(i18n.t('savePresetSuccess'))
}

function applySelectedPreset() {
  if (!selectedPresetId.value) {
    Toast.info(i18n.t('selectPresetFirst'))
    return
  }

  if (optionsStore.applyPreset(selectedPresetId.value)) {
    Toast.info(i18n.t('applyPresetSuccess'))
  }
}

function deleteSelectedPreset() {
  if (!selectedPresetId.value) {
    Toast.info(i18n.t('selectPresetFirst'))
    return
  }

  optionsStore.deletePreset(selectedPresetId.value)
  selectedPresetId.value = ''
  Toast.info(i18n.t('deletePresetSuccess'))
}

function exportOptions() {
  downloadTextFile(
    'prettier-now-options.json',
    stringifyOptionsSnapshot(optionsStore.createSnapshot()),
  )
}

function resetOptions() {
  optionsStore.resetOptions()
  Toast.info(i18n.t('resetOptionsSuccess'))
}
</script>

<template>
  <OptionsBlock :title="i18n.t('optionsPresets')">
    <OptionItem
      :description="i18n.t('optDescSavePreset')"
      :title="i18n.t('savePreset')"
    >
      <template #action>
        <div class="flex items-center gap-2">
          <input
            v-model.trim="presetName"
            :placeholder="i18n.t('presetName')"
            type="text"
            class="h-10 min-w-0 w-38 border border-base rounded-md px-2"
          />
          <IconButton
            @click="savePreset"
            :tooltip="i18n.t('savePreset')"
            icon="i-ri:save-line"
          />
        </div>
      </template>
    </OptionItem>

    <OptionItem
      v-if="hasPresets"
      :description="i18n.t('optDescManagePresets')"
      :title="i18n.t('managePresets')"
    >
      <template #action>
        <div class="flex items-center gap-2">
          <Select
            v-model="selectedPresetId"
            :items="presetItems"
          />
          <IconButton
            @click="applySelectedPreset"
            :tooltip="i18n.t('applyPreset')"
            icon="i-ri:check-line"
          />
          <IconButton
            @click="deleteSelectedPreset"
            :tooltip="i18n.t('deletePreset')"
            icon="i-ri:delete-bin-line"
          />
        </div>
      </template>
    </OptionItem>

    <OptionItem
      :description="i18n.t('optDescImportExportOptions')"
      :title="i18n.t('importExportOptions')"
    >
      <template #action>
        <div class="flex items-center gap-2">
          <IconButton
            @click="openImportDialog()"
            :tooltip="i18n.t('importOptions')"
            icon="i-ri:upload-line"
          />
          <IconButton
            @click="exportOptions"
            :tooltip="i18n.t('exportOptions')"
            icon="i-ri:download-line"
          />
          <IconButton
            @click="resetOptions"
            :tooltip="i18n.t('resetOptions')"
            icon="i-ri:reset-left-line"
          />
        </div>
      </template>
    </OptionItem>
  </OptionsBlock>
</template>
