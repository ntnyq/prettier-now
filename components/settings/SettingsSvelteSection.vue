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
  <SettingsSection :title="i18n.t('pluginSvelteOptions')">
    <SettingItem
      :description="i18n.t('optDescSvelteSortOrder')"
      title="svelteSortOrder"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSelect
          v-model="optionsStore.svelteSortOrder"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="[
            'options-scripts-markup-styles',
            'options-scripts-styles-markup',
            'options-markup-styles-scripts',
            'options-markup-scripts-styles',
            'options-styles-markup-scripts',
            'options-styles-scripts-markup',
            'scripts-options-markup-styles',
            'scripts-options-styles-markup',
            'markup-options-styles-scripts',
            'markup-options-scripts-styles',
            'styles-options-markup-scripts',
            'styles-options-scripts-markup',
            'scripts-markup-options-styles',
            'scripts-styles-options-markup',
            'markup-styles-options-scripts',
            'markup-scripts-options-styles',
            'styles-markup-options-scripts',
            'styles-scripts-options-markup',
            'scripts-markup-styles-options',
            'scripts-styles-markup-options',
            'markup-styles-scripts-options',
            'markup-scripts-styles-options',
            'styles-markup-scripts-options',
            'styles-scripts-markup-options',
            'none',
          ]"
        />
      </template>
    </SettingItem>
    <SettingItem
      :description="i18n.t('optDescSvelteAllowShorthand')"
      title="svelteAllowShorthand"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSwitch
          v-model="optionsStore.svelteAllowShorthand"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
        />
      </template>
    </SettingItem>
    <SettingItem
      :description="i18n.t('optDescSvelteIndentScriptAndStyle')"
      title="svelteIndentScriptAndStyle"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSwitch
          v-model="optionsStore.svelteIndentScriptAndStyle"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
        />
      </template>
    </SettingItem>
  </SettingsSection>
</template>
