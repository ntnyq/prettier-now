<script lang="ts" setup>
import { i18n } from '#i18n'
import { JAVA_ENTRYPOINTS } from '@/constants/options'
import { useOptionsStore } from '@/stores/options'
import SettingItem from './SettingItem.vue'
import SettingSelect from './SettingSelect.vue'
import SettingsSection from './SettingsSection.vue'

const optionsStore = useOptionsStore()
</script>

<template>
  <SettingsSection :title="i18n.t('pluginJavaOptions')">
    <SettingItem
      :description="i18n.t('optDescEntrypoint')"
      title="entrypoint"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSelect
          v-model="optionsStore.entrypoint"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="JAVA_ENTRYPOINTS"
        />
      </template>
    </SettingItem>
  </SettingsSection>
</template>
