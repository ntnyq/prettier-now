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
  <SettingsSection :title="i18n.t('pluginXMLOptions')">
    <SettingItem
      :description="i18n.t('optDescXmlSelfClosingSpace')"
      title="XMLSelfClosingSpace"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSwitch
          v-model="optionsStore.xmlSelfClosingSpace"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
        />
      </template>
    </SettingItem>
    <SettingItem
      :description="i18n.t('optDescXmlSortAttributesByKey')"
      title="XMLSortAttributesByKey"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSwitch
          v-model="optionsStore.xmlSortAttributesByKey"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
        />
      </template>
    </SettingItem>
    <SettingItem
      :description="i18n.t('optDescXmlQuoteAttributes')"
      title="XMLQuoteAttributes"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSelect
          v-model="optionsStore.xmlQuoteAttributes"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="['preserve', 'double', 'single']"
        />
      </template>
    </SettingItem>
    <SettingItem
      :description="i18n.t('optDescXmlWhitespaceSensitivity')"
      title="XMLWhitespaceSensitivity"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSelect
          v-model="optionsStore.xmlWhitespaceSensitivity"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="['strict', 'ignore', 'preserve']"
        />
      </template>
    </SettingItem>
  </SettingsSection>
</template>
