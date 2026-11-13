<script lang="ts" setup>
import { Check, Download, RotateCcw, Save, Trash2, Upload } from '@lucide/vue'
import { useFileDialog } from '@vueuse/core'
import { computed, shallowRef } from 'vue'
import { i18n } from '#i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useOptionsStore } from '@/stores/options'
import { downloadTextFile } from '@/utils/download'
import {
  parseOptionsSnapshot,
  stringifyOptionsSnapshot,
} from '@/utils/optionsPreset'
import { Toast } from '@/utils/toast'
import SettingItem from './SettingItem.vue'
import SettingSelect from './SettingSelect.vue'
import SettingsSection from './SettingsSection.vue'

const optionsStore = useOptionsStore()
const {
  open: openImportDialog,
  reset: resetImportDialog,
  onChange: handleImportChange,
} = useFileDialog({
  accept: 'application/json,.json',
  multiple: false,
})

const presetName = shallowRef('')
const selectedPresetId = shallowRef('')
const isPersisting = shallowRef(false)
const presetItems = computed(() =>
  optionsStore.presets.map(preset => ({
    label: preset.name,
    value: preset.id,
  })),
)
const hasPresets = computed(() => presetItems.value.length > 0)

handleImportChange(async files => {
  const file = files?.[0]

  if (!file) {
    return
  }

  try {
    const snapshot = parseOptionsSnapshot(await file.text())
    await optionsStore.applySnapshot(snapshot)
    Toast.info(i18n.t('importOptionsSuccess'))
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : i18n.t('importOptionsFailed')
    Toast.error(message)
  } finally {
    resetImportDialog()
  }
})

/**
 * Acknowledge explicit commands only after their storage writes settle.
 */
async function persistCommand(
  command: () => Promise<unknown>,
  successMessage: string,
) {
  if (isPersisting.value) {
    return
  }
  isPersisting.value = true
  try {
    await command()
    Toast.info(successMessage)
  } catch (error) {
    Toast.error(
      i18n.t('storageSaveFailed', [
        error instanceof Error ? error.message : String(error),
      ]),
    )
  } finally {
    isPersisting.value = false
  }
}

async function savePreset() {
  const name = presetName.value.trim()

  if (!name) {
    Toast.info(i18n.t('presetNameRequired'))
    return
  }

  await persistCommand(async () => {
    await optionsStore.savePreset(name)
    if (presetName.value.trim() === name) {
      presetName.value = ''
    }
  }, i18n.t('savePresetSuccess'))
}

async function applySelectedPreset() {
  if (!selectedPresetId.value) {
    Toast.info(i18n.t('selectPresetFirst'))
    return
  }

  await persistCommand(async () => {
    if (!(await optionsStore.applyPreset(selectedPresetId.value))) {
      throw new Error(i18n.t('selectPresetFirst'))
    }
  }, i18n.t('applyPresetSuccess'))
}

async function deleteSelectedPreset() {
  if (!selectedPresetId.value) {
    Toast.info(i18n.t('selectPresetFirst'))
    return
  }

  const id = selectedPresetId.value
  await persistCommand(async () => {
    await optionsStore.deletePreset(id)
    if (selectedPresetId.value === id) {
      selectedPresetId.value = ''
    }
  }, i18n.t('deletePresetSuccess'))
}

function exportOptions() {
  downloadTextFile(
    'prettier-now-options.json',
    stringifyOptionsSnapshot(optionsStore.createSnapshot()),
  )
}

async function resetOptions() {
  await persistCommand(
    () => optionsStore.resetOptions(),
    i18n.t('resetOptionsSuccess'),
  )
}
</script>

<template>
  <SettingsSection :title="i18n.t('optionsPresets')">
    <SettingItem
      :description="i18n.t('optDescSavePreset')"
      :title="i18n.t('savePreset')"
    >
      <template #action="{ descriptionId, titleId }">
        <div class="flex items-center gap-2">
          <Input
            v-model.trim="presetName"
            :aria-describedby="descriptionId"
            :aria-labelledby="titleId"
            :placeholder="i18n.t('presetName')"
            class="w-40"
            type="text"
          />
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                @click="savePreset"
                :disabled="isPersisting"
                :aria-label="i18n.t('savePreset')"
                size="icon"
                variant="outline"
              >
                <Save class="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{{ i18n.t('savePreset') }}</TooltipContent>
          </Tooltip>
        </div>
      </template>
    </SettingItem>

    <SettingItem
      v-if="hasPresets"
      :description="i18n.t('optDescManagePresets')"
      :title="i18n.t('managePresets')"
    >
      <template #action="{ descriptionId, titleId }">
        <div class="flex items-center gap-2">
          <SettingSelect
            v-model="selectedPresetId"
            :aria-describedby="descriptionId"
            :aria-labelledby="titleId"
            :items="presetItems"
          />
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                @click="applySelectedPreset"
                :disabled="isPersisting"
                :aria-label="i18n.t('applyPreset')"
                size="icon"
                variant="outline"
              >
                <Check class="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{{ i18n.t('applyPreset') }}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                @click="deleteSelectedPreset"
                :disabled="isPersisting"
                :aria-label="i18n.t('deletePreset')"
                size="icon"
                variant="outline"
              >
                <Trash2 class="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{{ i18n.t('deletePreset') }}</TooltipContent>
          </Tooltip>
        </div>
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescImportExportOptions')"
      :title="i18n.t('importExportOptions')"
    >
      <template #action>
        <div class="flex items-center gap-2">
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
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                @click="resetOptions"
                :disabled="isPersisting"
                :aria-label="i18n.t('resetOptions')"
                size="icon"
                variant="outline"
              >
                <RotateCcw class="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{{ i18n.t('resetOptions') }}</TooltipContent>
          </Tooltip>
        </div>
      </template>
    </SettingItem>
  </SettingsSection>
</template>
