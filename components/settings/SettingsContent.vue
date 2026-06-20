<script lang="ts" setup>
import { i18n } from '#i18n'
import { Switch } from '@/components/ui/switch'
import { JAVA_ENTRYPOINTS } from '@/constants/options'
import { useConfigStore } from '@/stores/config'
import { useOptionsStore } from '@/stores/options'
import OptionsPresetPanel from '../OptionsPresetPanel.vue'
import SettingItem from './SettingItem.vue'
import SettingNumberField from './SettingNumberField.vue'
import SettingSelect from './SettingSelect.vue'
import SettingsSection from './SettingsSection.vue'

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
        <template #action>
          <SettingNumberField v-model="optionsStore.printWidth" />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescTabWidth')"
        title="tabWidth"
      >
        <template #action>
          <SettingNumberField v-model="optionsStore.tabWidth" />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescUseTabs')"
        title="useTabs"
      >
        <template #action>
          <Switch v-model="optionsStore.useTabs" />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescSemi')"
        title="semi"
      >
        <template #action>
          <Switch v-model="optionsStore.semi" />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescSingleQuote')"
        title="singleQuote"
      >
        <template #action>
          <Switch v-model="optionsStore.singleQuote" />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescQuoteProps')"
        title="quoteProps"
      >
        <template #action>
          <SettingSelect
            v-model="optionsStore.quoteProps"
            :items="['as-needed', 'consistent', 'preserve']"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescObjectWrap')"
        title="objectWrap"
      >
        <template #action>
          <SettingSelect
            v-model="optionsStore.objectWrap"
            :items="['preserve', 'collapse']"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescExperimentalOperatorPosition')"
        title="experimentalOperatorPosition"
      >
        <template #action>
          <SettingSelect
            v-model="optionsStore.experimentalOperatorPosition"
            :items="['start', 'end']"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescJsxSingleQuote')"
        title="jsxSingleQuote"
      >
        <template #action>
          <Switch v-model="optionsStore.jsxSingleQuote" />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescTrailingComma')"
        title="trailingComma"
      >
        <template #action>
          <SettingSelect
            v-model="optionsStore.trailingComma"
            :items="['all', 'es5', 'none']"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescBracketSpacing')"
        title="bracketSpacing"
      >
        <template #action>
          <Switch v-model="optionsStore.bracketSpacing" />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescBracketSameLine')"
        title="bracketSameLine"
      >
        <template #action>
          <Switch v-model="optionsStore.bracketSameLine" />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescArrowParens')"
        title="arrowParens"
      >
        <template #action>
          <SettingSelect
            v-model="optionsStore.arrowParens"
            :items="['always', 'avoid']"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescHtmlWhitespaceSensitivity')"
        title="htmlWhitespaceSensitivity"
      >
        <template #action>
          <SettingSelect
            v-model="optionsStore.htmlWhitespaceSensitivity"
            :items="['css', 'strict', 'ignore']"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescVueIndentScriptAndStyle')"
        title="vueIndentScriptAndStyle"
      >
        <template #action>
          <Switch v-model="optionsStore.vueIndentScriptAndStyle" />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescEndOfLine')"
        title="endOfLine"
      >
        <template #action>
          <SettingSelect
            v-model="optionsStore.endOfLine"
            :items="['lf', 'crlf', 'cr', 'auto']"
          />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescSingleAttributePerLine')"
        title="singleAttributePerLine"
      >
        <template #action>
          <Switch v-model="optionsStore.singleAttributePerLine" />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescExperimentalTernaries')"
        title="experimentalTernaries"
      >
        <template #action>
          <Switch v-model="optionsStore.experimentalTernaries" />
        </template>
      </SettingItem>
    </SettingsSection>

    <!-- Plugin XML Options -->
    <SettingsSection :title="i18n.t('pluginXMLOptions')">
      <SettingItem
        :description="i18n.t('optDescXmlSelfClosingSpace')"
        title="xmlSelfClosingSpace"
      >
        <template #action>
          <Switch v-model="optionsStore.xmlSelfClosingSpace" />
        </template>
      </SettingItem>
      <SettingItem
        :description="i18n.t('optDescXmlSortAttributesByKey')"
        title="xmlSortAttributesByKey"
      >
        <template #action>
          <Switch v-model="optionsStore.xmlSortAttributesByKey" />
        </template>
      </SettingItem>
      <SettingItem
        :description="i18n.t('optDescXmlQuoteAttributes')"
        title="xmlQuoteAttributes"
      >
        <template #action>
          <SettingSelect
            v-model="optionsStore.xmlQuoteAttributes"
            :items="['preserve', 'double', 'single']"
          />
        </template>
      </SettingItem>
      <SettingItem
        :description="i18n.t('optDescXmlWhitespaceSensitivity')"
        title="xmlWhitespaceSensitivity"
      >
        <template #action>
          <SettingSelect
            v-model="optionsStore.xmlWhitespaceSensitivity"
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
        <template #action>
          <SettingSelect
            v-model="optionsStore.phpVersion"
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
        <template #action>
          <Switch v-model="optionsStore.trailingCommaPHP" />
        </template>
      </SettingItem>
      <SettingItem
        :description="i18n.t('optDescBraceStyle')"
        title="braceStyle"
      >
        <template #action>
          <SettingSelect
            v-model="optionsStore.braceStyle"
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
        <template #action>
          <SettingSelect
            v-model="optionsStore.entrypoint"
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
        <template #action>
          <SettingSelect
            v-model="optionsStore.svelteSortOrder"
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
        <template #action>
          <Switch v-model="optionsStore.svelteAllowShorthand" />
        </template>
      </SettingItem>
      <SettingItem
        :description="i18n.t('optDescSvelteIndentScriptAndStyle')"
        title="svelteIndentScriptAndStyle"
      >
        <template #action>
          <Switch v-model="optionsStore.svelteIndentScriptAndStyle" />
        </template>
      </SettingItem>
    </SettingsSection>

    <!-- Plugin TOML Options -->
    <SettingsSection :title="i18n.t('pluginTOMLOptions')">
      <SettingItem
        :description="i18n.t('optDescAlignComments')"
        title="alignComments"
      >
        <template #action>
          <Switch v-model="optionsStore.alignComments" />
        </template>
      </SettingItem>
      <SettingItem
        :description="i18n.t('optDescAlignEntries')"
        title="alignEntries"
      >
        <template #action>
          <Switch v-model="optionsStore.alignEntries" />
        </template>
      </SettingItem>
      <SettingItem
        :description="i18n.t('optDescAllowedBlankLines')"
        title="allowedBlankLines"
      >
        <template #action>
          <SettingNumberField v-model="optionsStore.allowedBlankLines" />
        </template>
      </SettingItem>
      <SettingItem
        :description="i18n.t('optDescArrayAutoCollapse')"
        title="arrayAutoCollapse"
      >
        <template #action>
          <Switch v-model="optionsStore.arrayAutoCollapse" />
        </template>
      </SettingItem>
      <SettingItem
        :description="i18n.t('optDescArrayAutoExpand')"
        title="arrayAutoExpand"
      >
        <template #action>
          <Switch v-model="optionsStore.arrayAutoExpand" />
        </template>
      </SettingItem>
      <SettingItem
        :description="i18n.t('optDescCompactArrays')"
        title="compactArrays"
      >
        <template #action>
          <Switch v-model="optionsStore.compactArrays" />
        </template>
      </SettingItem>
      <SettingItem
        :description="i18n.t('optDescCompactEntries')"
        title="compactEntries"
      >
        <template #action>
          <Switch v-model="optionsStore.compactEntries" />
        </template>
      </SettingItem>
      <SettingItem
        :description="i18n.t('optDescCompactInlineTables')"
        title="compactInlineTables"
      >
        <template #action>
          <Switch v-model="optionsStore.compactInlineTables" />
        </template>
      </SettingItem>
      <SettingItem
        :description="i18n.t('optDescIndentEntries')"
        title="indentEntries"
      >
        <template #action>
          <Switch v-model="optionsStore.indentEntries" />
        </template>
      </SettingItem>
      <SettingItem
        :description="i18n.t('optDescIndentTables')"
        title="indentTables"
      >
        <template #action>
          <Switch v-model="optionsStore.indentTables" />
        </template>
      </SettingItem>
      <SettingItem
        :description="i18n.t('optDescReorderKeys')"
        title="reorderKeys"
      >
        <template #action>
          <Switch v-model="optionsStore.reorderKeys" />
        </template>
      </SettingItem>
    </SettingsSection>

    <!-- User Configs -->
    <SettingsSection :title="i18n.t('userConfigs')">
      <SettingItem
        :description="i18n.t('optDescSilent')"
        title="silent"
      >
        <template #action>
          <Switch v-model="configStore.silent" />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescDebug')"
        title="debug"
      >
        <template #action>
          <Switch v-model="configStore.debug" />
        </template>
      </SettingItem>

      <SettingItem
        :description="i18n.t('optDescAutoFormat')"
        title="autoFormat"
      >
        <template #action>
          <Switch v-model="configStore.autoFormat" />
        </template>
      </SettingItem>
    </SettingsSection>
  </div>
</template>
