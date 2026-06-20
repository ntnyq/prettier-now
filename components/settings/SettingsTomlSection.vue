<script lang="ts" setup>
import { i18n } from '#i18n'
import { useOptionsStore } from '@/stores/options'
import SettingItem from './SettingItem.vue'
import SettingNumberField from './SettingNumberField.vue'
import SettingsSection from './SettingsSection.vue'
import SettingSwitch from './SettingSwitch.vue'

const optionsStore = useOptionsStore()
</script>

<template>
  <SettingsSection :title="i18n.t('pluginTOMLOptions')">
    <SettingItem
      :description="i18n.t('optDescAlignComments')"
      title="alignComments"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSwitch
          v-model="optionsStore.alignComments"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
        />
      </template>
    </SettingItem>
    <SettingItem
      :description="i18n.t('optDescAlignEntries')"
      title="alignEntries"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSwitch
          v-model="optionsStore.alignEntries"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
        />
      </template>
    </SettingItem>
    <SettingItem
      :description="i18n.t('optDescAllowedBlankLines')"
      title="allowedBlankLines"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingNumberField
          v-model="optionsStore.allowedBlankLines"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
        />
      </template>
    </SettingItem>
    <SettingItem
      :description="i18n.t('optDescArrayAutoCollapse')"
      title="arrayAutoCollapse"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSwitch
          v-model="optionsStore.arrayAutoCollapse"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
        />
      </template>
    </SettingItem>
    <SettingItem
      :description="i18n.t('optDescArrayAutoExpand')"
      title="arrayAutoExpand"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSwitch
          v-model="optionsStore.arrayAutoExpand"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
        />
      </template>
    </SettingItem>
    <SettingItem
      :description="i18n.t('optDescCompactArrays')"
      title="compactArrays"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSwitch
          v-model="optionsStore.compactArrays"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
        />
      </template>
    </SettingItem>
    <SettingItem
      :description="i18n.t('optDescCompactEntries')"
      title="compactEntries"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSwitch
          v-model="optionsStore.compactEntries"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
        />
      </template>
    </SettingItem>
    <SettingItem
      :description="i18n.t('optDescCompactInlineTables')"
      title="compactInlineTables"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSwitch
          v-model="optionsStore.compactInlineTables"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
        />
      </template>
    </SettingItem>
    <SettingItem
      :description="i18n.t('optDescIndentEntries')"
      title="indentEntries"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSwitch
          v-model="optionsStore.indentEntries"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
        />
      </template>
    </SettingItem>
    <SettingItem
      :description="i18n.t('optDescIndentTables')"
      title="indentTables"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSwitch
          v-model="optionsStore.indentTables"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
        />
      </template>
    </SettingItem>
    <SettingItem
      :description="i18n.t('optDescReorderKeys')"
      title="reorderKeys"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSwitch
          v-model="optionsStore.reorderKeys"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
        />
      </template>
    </SettingItem>
  </SettingsSection>
</template>
