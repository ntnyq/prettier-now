<script lang="ts" setup>
import { i18n } from '#i18n'
import { useConfigStore } from '@/stores/config'
import SettingItem from './SettingItem.vue'
import SettingsSection from './SettingsSection.vue'
import SettingSwitch from './SettingSwitch.vue'

const configStore = useConfigStore()
</script>

<template>
  <SettingsSection :title="i18n.t('userConfigs')">
    <SettingItem
      :description="i18n.t('optDescSilent')"
      title="silent"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSwitch
          v-model="configStore.silent"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescDebug')"
      title="debug"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSwitch
          v-model="configStore.debug"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescAutoFormat')"
      title="autoFormat"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSwitch
          v-model="configStore.autoFormat"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
        />
      </template>
    </SettingItem>
  </SettingsSection>
</template>
