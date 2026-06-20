<script lang="ts" setup>
import { i18n } from '#i18n'
import { JAVA_ENTRYPOINTS } from '@/constants/options'
import { useConfigStore } from '@/stores/config'
import { useOptionsStore } from '@/stores/options'
import OptionsPresetPanel from '../OptionsPresetPanel.vue'
import SettingItem from './SettingItem.vue'
import SettingNumberField from './SettingNumberField.vue'
import SettingSelect from './SettingSelect.vue'
import SettingsSection from './SettingsSection.vue'
import SettingSwitch from './SettingSwitch.vue'

const optionsStore = useOptionsStore()
const configStore = useConfigStore()
</script>

<template>
  <div class="space-y-6">
    <OptionsPresetPanel />

    <!-- Prettier Core Options -->
    <SettingsSection :title="i18n.t('prettierOptions')">
      <SettingItem
        :description="i18n.t('optDescPrintWidth')"
        title="printWidth"
      >
        <template #action="{ descriptionId, titleId }">
          <SettingNumberField
            v-model="optionsStore.printWidth"
            :aria-describedby="descriptionId"
            :aria-labelledby="titleId"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescTabWidth')"
        title="tabWidth"
      >
        <template #action="{ descriptionId, titleId }">
          <SettingNumberField
            v-model="optionsStore.tabWidth"
            :aria-describedby="descriptionId"
            :aria-labelledby="titleId"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescUseTabs')"
        title="useTabs"
      >
        <template #action="{ descriptionId, titleId }">
          <SettingSwitch
            v-model="optionsStore.useTabs"
            :aria-describedby="descriptionId"
            :aria-labelledby="titleId"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescSemi')"
        title="semi"
      >
        <template #action="{ descriptionId, titleId }">
          <SettingSwitch
            v-model="optionsStore.semi"
            :aria-describedby="descriptionId"
            :aria-labelledby="titleId"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescSingleQuote')"
        title="singleQuote"
      >
        <template #action="{ descriptionId, titleId }">
          <SettingSwitch
            v-model="optionsStore.singleQuote"
            :aria-describedby="descriptionId"
            :aria-labelledby="titleId"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescQuoteProps')"
        title="quoteProps"
      >
        <template #action="{ descriptionId, titleId }">
          <SettingSelect
            v-model="optionsStore.quoteProps"
            :aria-describedby="descriptionId"
            :aria-labelledby="titleId"
            :items="['as-needed', 'consistent', 'preserve']"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescObjectWrap')"
        title="objectWrap"
      >
        <template #action="{ descriptionId, titleId }">
          <SettingSelect
            v-model="optionsStore.objectWrap"
            :aria-describedby="descriptionId"
            :aria-labelledby="titleId"
            :items="['preserve', 'collapse']"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescExperimentalOperatorPosition')"
        title="experimentalOperatorPosition"
      >
        <template #action="{ descriptionId, titleId }">
          <SettingSelect
            v-model="optionsStore.experimentalOperatorPosition"
            :aria-describedby="descriptionId"
            :aria-labelledby="titleId"
            :items="['start', 'end']"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescJsxSingleQuote')"
        title="jsxSingleQuote"
      >
        <template #action="{ descriptionId, titleId }">
          <SettingSwitch
            v-model="optionsStore.jsxSingleQuote"
            :aria-describedby="descriptionId"
            :aria-labelledby="titleId"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescTrailingComma')"
        title="trailingComma"
      >
        <template #action="{ descriptionId, titleId }">
          <SettingSelect
            v-model="optionsStore.trailingComma"
            :aria-describedby="descriptionId"
            :aria-labelledby="titleId"
            :items="['all', 'es5', 'none']"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescBracketSpacing')"
        title="bracketSpacing"
      >
        <template #action="{ descriptionId, titleId }">
          <SettingSwitch
            v-model="optionsStore.bracketSpacing"
            :aria-describedby="descriptionId"
            :aria-labelledby="titleId"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescBracketSameLine')"
        title="bracketSameLine"
      >
        <template #action="{ descriptionId, titleId }">
          <SettingSwitch
            v-model="optionsStore.bracketSameLine"
            :aria-describedby="descriptionId"
            :aria-labelledby="titleId"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescArrowParens')"
        title="arrowParens"
      >
        <template #action="{ descriptionId, titleId }">
          <SettingSelect
            v-model="optionsStore.arrowParens"
            :aria-describedby="descriptionId"
            :aria-labelledby="titleId"
            :items="['always', 'avoid']"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescHtmlWhitespaceSensitivity')"
        title="htmlWhitespaceSensitivity"
      >
        <template #action="{ descriptionId, titleId }">
          <SettingSelect
            v-model="optionsStore.htmlWhitespaceSensitivity"
            :aria-describedby="descriptionId"
            :aria-labelledby="titleId"
            :items="['css', 'strict', 'ignore']"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescVueIndentScriptAndStyle')"
        title="vueIndentScriptAndStyle"
      >
        <template #action="{ descriptionId, titleId }">
          <SettingSwitch
            v-model="optionsStore.vueIndentScriptAndStyle"
            :aria-describedby="descriptionId"
            :aria-labelledby="titleId"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescEndOfLine')"
        title="endOfLine"
      >
        <template #action="{ descriptionId, titleId }">
          <SettingSelect
            v-model="optionsStore.endOfLine"
            :aria-describedby="descriptionId"
            :aria-labelledby="titleId"
            :items="['lf', 'crlf', 'cr', 'auto']"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescSingleAttributePerLine')"
        title="singleAttributePerLine"
      >
        <template #action="{ descriptionId, titleId }">
          <SettingSwitch
            v-model="optionsStore.singleAttributePerLine"
            :aria-describedby="descriptionId"
            :aria-labelledby="titleId"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescExperimentalTernaries')"
        title="experimentalTernaries"
      >
        <template #action="{ descriptionId, titleId }">
          <SettingSwitch
            v-model="optionsStore.experimentalTernaries"
            :aria-describedby="descriptionId"
            :aria-labelledby="titleId"
          />
        </template>
      </SettingItem>
    </SettingsSection>

    <!-- Plugin XML Options -->
    <SettingsSection :title="i18n.t('pluginXMLOptions')">
      <SettingItem
        :description="i18n.t('optDescXmlSelfClosingSpace')"
        title="xmlSelfClosingSpace"
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
        title="xmlSortAttributesByKey"
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
        title="xmlQuoteAttributes"
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
        title="xmlWhitespaceSensitivity"
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

    <!-- Plugin PHP Options -->
    <SettingsSection :title="i18n.t('pluginPHPOptions')">
      <SettingItem
        :description="i18n.t('optDescPhpVersion')"
        title="phpVersion"
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
        title="trailingCommaPHP"
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
        title="braceStyle"
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

    <!-- Plugin Java Options -->
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

    <!-- Plugin Svelte Options -->
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

    <!-- Plugin TOML Options -->
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

    <!-- User Configs -->
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
  </div>
</template>
