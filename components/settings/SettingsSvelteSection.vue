<script lang="ts" setup>
import { i18n } from '#i18n'
import { SVELTE_SORT_ORDERS } from '@/constants/optionValues'
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
      title="SvelteSortOrder"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSelect
          v-model="optionsStore.svelteSortOrder"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="SVELTE_SORT_ORDERS"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescSvelteAllowShorthand')"
      title="SvelteAllowShorthand"
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
      title="SvelteIndentScriptAndStyle"
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
