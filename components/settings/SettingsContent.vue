<script lang="ts" setup>
import OptionsPresetPanel from '../OptionsPresetPanel.vue'
import SettingsCodeBlocksSection from './SettingsCodeBlocksSection.vue'
import SettingsJavaSection from './SettingsJavaSection.vue'
import SettingsPhpSection from './SettingsPhpSection.vue'
import SettingsPrettierSection from './SettingsPrettierSection.vue'
import SettingsSvelteSection from './SettingsSvelteSection.vue'
import SettingsTomlSection from './SettingsTomlSection.vue'
import SettingsUserConfigSection from './SettingsUserConfigSection.vue'
import SettingsXmlSection from './SettingsXmlSection.vue'
</script>

<template>
  <div class="space-y-6">
    <OptionsPresetPanel />
    <SettingsPrettierSection />
    <SettingsXmlSection />
    <SettingsPhpSection />
    <SettingsJavaSection />
    <SettingsSvelteSection />
    <SettingsTomlSection />
    <SettingsUserConfigSection />
    <SettingsCodeBlocksSection />
  </div>
</template>
