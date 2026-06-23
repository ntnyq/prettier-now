<script lang="ts" setup>
import { i18n } from '#i18n'
import { useOptionsStore } from '@/stores/options'
import SettingItem from './SettingItem.vue'
import SettingSelect from './SettingSelect.vue'
import SettingsSection from './SettingsSection.vue'
import SettingSwitch from './SettingSwitch.vue'

const optionsStore = useOptionsStore()
</script>

<template>
  <SettingsSection :title="i18n.t('pluginPHPOptions')">
    <SettingItem
      :description="i18n.t('optDescPhpVersion')"
      title="PHPVersion"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSelect
          v-model="optionsStore.phpVersion"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="[
            '5.0',
            '5.1',
            '5.2',
            '5.3',
            '5.4',
            '5.5',
            '5.6',
            '7.0',
            '7.1',
            '7.2',
            '7.3',
            '7.4',
            '8.0',
            '8.1',
            '8.2',
          ]"
        />
      </template>
    </SettingItem>
    <SettingItem
      :description="i18n.t('optDescTrailingCommaPHP')"
      title="TrailingCommaPHP"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSwitch
          v-model="optionsStore.trailingCommaPHP"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
        />
      </template>
    </SettingItem>
    <SettingItem
      :description="i18n.t('optDescBraceStyle')"
      title="BraceStyle"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSelect
          v-model="optionsStore.braceStyle"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="['per-cs', '1tbs']"
        />
      </template>
    </SettingItem>
  </SettingsSection>
</template>
