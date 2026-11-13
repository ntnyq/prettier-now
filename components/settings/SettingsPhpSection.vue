<script lang="ts" setup>
import { i18n } from '#i18n'
import { PHP_BRACE_STYLES, PHP_VERSIONS } from '@/constants/optionValues'
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
          :items="PHP_VERSIONS"
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
          :items="PHP_BRACE_STYLES"
        />
      </template>
    </SettingItem>
  </SettingsSection>
</template>
