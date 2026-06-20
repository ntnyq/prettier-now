<script lang="ts" setup>
import { Check, Download, RotateCcw, Save, Trash2, Upload } from '@lucide/vue'
import { useFileDialog } from '@vueuse/core'
import { computed, shallowRef } from 'vue'
import { i18n } from '#i18n'
import SettingItem from '@/components/settings/SettingItem.vue'
import SettingSelect from '@/components/settings/SettingSelect.vue'
import SettingsSection from '@/components/settings/SettingsSection.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
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
  <SettingsSection :title="i18n.t('optionsPresets')">
    <SettingItem
      :description="i18n.t('optDescSavePreset')"
      :title="i18n.t('savePreset')"
    >
      <template #action>
        <div class="flex items-center gap-2">
          <Input
            v-model.trim="presetName"
            :placeholder="i18n.t('presetName')"
            class="w-40"
            type="text"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  @click="savePreset"
                  :aria-label="i18n.t('savePreset')"
                  size="icon"
                  variant="outline"
                >
                  <Save class="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{{ i18n.t('savePreset') }}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </template>
    </SettingItem>

    <SettingItem
      v-if="hasPresets"
      :description="i18n.t('optDescManagePresets')"
      :title="i18n.t('managePresets')"
    >
      <template #action>
        <div class="flex items-center gap-2">
          <SettingSelect
            v-model="selectedPresetId"
            :items="presetItems"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  @click="applySelectedPreset"
                  :aria-label="i18n.t('applyPreset')"
                  size="icon"
                  variant="outline"
                >
                  <Check class="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{{ i18n.t('applyPreset') }}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  @click="deleteSelectedPreset"
                  :aria-label="i18n.t('deletePreset')"
                  size="icon"
                  variant="outline"
                >
                  <Trash2 class="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{{ i18n.t('deletePreset') }}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescImportExportOptions')"
      :title="i18n.t('importExportOptions')"
    >
      <template #action>
        <div class="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  @click="openImportDialog()"
                  :aria-label="i18n.t('importOptions')"
                  size="icon"
                  variant="outline"
                >
                  <Upload class="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{{ i18n.t('importOptions') }}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  @click="exportOptions"
                  :aria-label="i18n.t('exportOptions')"
                  size="icon"
                  variant="outline"
                >
                  <Download class="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{{ i18n.t('exportOptions') }}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  @click="resetOptions"
                  :aria-label="i18n.t('resetOptions')"
                  size="icon"
                  variant="outline"
                >
                  <RotateCcw class="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{{ i18n.t('resetOptions') }}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </template>
    </SettingItem>
  </SettingsSection>
</template>
