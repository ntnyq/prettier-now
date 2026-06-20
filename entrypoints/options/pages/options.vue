<script lang="ts" setup>
import { i18n } from '#i18n'
import { JAVA_ENTRYPOINTS } from '@/constants/options'
import { useConfigStore } from '@/stores/config'
import { useOptionsStore } from '@/stores/options'

const optionsStore = useOptionsStore()
const configStore = useConfigStore()
</script>

<template>
  <div class="relative overflow-y-auto">
    <div class="mx-auto max-w-720px p-8">
      <OptionsPresetPanel />

      <!-- Prettier Core Options -->
      <OptionsBlock :title="i18n.t('prettierOptions')">
        <OptionItem
          :description="i18n.t('optDescPrintWidth')"
          title="printWidth"
        >
          <template #action>
            <InputNumber v-model="optionsStore.printWidth" />
          </template>
        </OptionItem>

        <OptionItem
          :description="i18n.t('optDescTabWidth')"
          title="tabWidth"
        >
          <template #action>
            <InputNumber v-model="optionsStore.tabWidth" />
          </template>
        </OptionItem>

        <OptionItem
          :description="i18n.t('optDescUseTabs')"
          title="useTabs"
        >
          <template #action>
            <Switch v-model="optionsStore.useTabs" />
          </template>
        </OptionItem>

        <OptionItem
          :description="i18n.t('optDescSemi')"
          title="semi"
        >
          <template #action>
            <Switch v-model="optionsStore.semi" />
          </template>
        </OptionItem>

        <OptionItem
          :description="i18n.t('optDescSingleQuote')"
          title="singleQuote"
        >
          <template #action>
            <Switch v-model="optionsStore.singleQuote" />
          </template>
        </OptionItem>

        <OptionItem
          :description="i18n.t('optDescQuoteProps')"
          title="quoteProps"
        >
          <template #action>
            <Select
              v-model="optionsStore.quoteProps"
              :items="['as-needed', 'consistent', 'preserve']"
            />
          </template>
        </OptionItem>

        <OptionItem
          :description="i18n.t('optDescObjectWrap')"
          title="objectWrap"
        >
          <template #action>
            <Select
              v-model="optionsStore.objectWrap"
              :items="['preserve', 'collapse']"
            />
          </template>
        </OptionItem>

        <OptionItem
          :description="i18n.t('optDescExperimentalOperatorPosition')"
          title="experimentalOperatorPosition"
        >
          <template #action>
            <Select
              v-model="optionsStore.experimentalOperatorPosition"
              :items="['start', 'end']"
            />
          </template>
        </OptionItem>

        <OptionItem
          :description="i18n.t('optDescJsxSingleQuote')"
          title="jsxSingleQuote"
        >
          <template #action>
            <Switch v-model="optionsStore.jsxSingleQuote" />
          </template>
        </OptionItem>

        <OptionItem
          :description="i18n.t('optDescTrailingComma')"
          title="trailingComma"
        >
          <template #action>
            <Select
              v-model="optionsStore.trailingComma"
              :items="['all', 'es5', 'none']"
            />
          </template>
        </OptionItem>

        <OptionItem
          :description="i18n.t('optDescBracketSpacing')"
          title="bracketSpacing"
        >
          <template #action>
            <Switch v-model="optionsStore.bracketSpacing" />
          </template>
        </OptionItem>

        <OptionItem
          :description="i18n.t('optDescBracketSameLine')"
          title="bracketSameLine"
        >
          <template #action>
            <Switch v-model="optionsStore.bracketSameLine" />
          </template>
        </OptionItem>

        <OptionItem
          :description="i18n.t('optDescArrowParens')"
          title="arrowParens"
        >
          <template #action>
            <Select
              v-model="optionsStore.arrowParens"
              :items="['always', 'avoid']"
            />
          </template>
        </OptionItem>

        <OptionItem
          :description="i18n.t('optDescHtmlWhitespaceSensitivity')"
          title="htmlWhitespaceSensitivity"
        >
          <template #action>
            <Select
              v-model="optionsStore.htmlWhitespaceSensitivity"
              :items="['css', 'strict', 'ignore']"
            />
          </template>
        </OptionItem>

        <OptionItem
          :description="i18n.t('optDescVueIndentScriptAndStyle')"
          title="vueIndentScriptAndStyle"
        >
          <template #action>
            <Switch v-model="optionsStore.vueIndentScriptAndStyle" />
          </template>
        </OptionItem>

        <OptionItem
          :description="i18n.t('optDescEndOfLine')"
          title="endOfLine"
        >
          <template #action>
            <Select
              v-model="optionsStore.endOfLine"
              :items="['lf', 'crlf', 'cr', 'auto']"
            />
          </template>
        </OptionItem>

        <OptionItem
          :description="i18n.t('optDescSingleAttributePerLine')"
          title="singleAttributePerLine"
        >
          <template #action>
            <Switch v-model="optionsStore.singleAttributePerLine" />
          </template>
        </OptionItem>

        <OptionItem
          :description="i18n.t('optDescExperimentalTernaries')"
          title="experimentalTernaries"
        >
          <template #action>
            <Switch v-model="optionsStore.experimentalTernaries" />
          </template>
        </OptionItem>
      </OptionsBlock>

      <!-- Plugin XML Options -->
      <OptionsBlock :title="i18n.t('pluginXMLOptions')">
        <OptionItem
          :description="i18n.t('optDescXmlSelfClosingSpace')"
          title="xmlSelfClosingSpace"
        >
          <template #action>
            <Switch v-model="optionsStore.xmlSelfClosingSpace" />
          </template>
        </OptionItem>
        <OptionItem
          :description="i18n.t('optDescXmlSortAttributesByKey')"
          title="xmlSortAttributesByKey"
        >
          <template #action>
            <Switch v-model="optionsStore.xmlSortAttributesByKey" />
          </template>
        </OptionItem>
        <OptionItem
          :description="i18n.t('optDescXmlQuoteAttributes')"
          title="xmlQuoteAttributes"
        >
          <template #action>
            <Select
              v-model="optionsStore.xmlQuoteAttributes"
              :items="['preserve', 'double', 'single']"
            />
          </template>
        </OptionItem>
        <OptionItem
          :description="i18n.t('optDescXmlWhitespaceSensitivity')"
          title="xmlWhitespaceSensitivity"
        >
          <template #action>
            <Select
              v-model="optionsStore.xmlWhitespaceSensitivity"
              :items="['strict', 'ignore', 'preserve']"
            />
          </template>
        </OptionItem>
      </OptionsBlock>

      <!-- Plugin PHP Options -->
      <OptionsBlock :title="i18n.t('pluginPHPOptions')">
        <OptionItem
          :description="i18n.t('optDescPhpVersion')"
          title="phpVersion"
        >
          <template #action>
            <Select
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
        </OptionItem>
        <OptionItem
          :description="i18n.t('optDescTrailingCommaPHP')"
          title="trailingCommaPHP"
        >
          <template #action>
            <Switch v-model="optionsStore.trailingCommaPHP" />
          </template>
        </OptionItem>
        <OptionItem
          :description="i18n.t('optDescBraceStyle')"
          title="braceStyle"
        >
          <template #action>
            <Select
              v-model="optionsStore.braceStyle"
              :items="['per-cs', '1tbs']"
            />
          </template>
        </OptionItem>
      </OptionsBlock>

      <!-- Plugin Java Options -->
      <OptionsBlock :title="i18n.t('pluginJavaOptions')">
        <OptionItem
          :description="i18n.t('optDescEntrypoint')"
          title="entrypoint"
        >
          <template #action>
            <Select
              v-model="optionsStore.entrypoint"
              :items="JAVA_ENTRYPOINTS"
            />
          </template>
        </OptionItem>
      </OptionsBlock>

      <!-- Plugin Svelte Options -->
      <OptionsBlock :title="i18n.t('pluginSvelteOptions')">
        <OptionItem
          :description="i18n.t('optDescSvelteSortOrder')"
          title="svelteSortOrder"
        >
          <template #action>
            <Select
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
        </OptionItem>
        <OptionItem
          :description="i18n.t('optDescSvelteAllowShorthand')"
          title="svelteAllowShorthand"
        >
          <template #action>
            <Switch v-model="optionsStore.svelteAllowShorthand" />
          </template>
        </OptionItem>
        <OptionItem
          :description="i18n.t('optDescSvelteIndentScriptAndStyle')"
          title="svelteIndentScriptAndStyle"
        >
          <template #action>
            <Switch v-model="optionsStore.svelteIndentScriptAndStyle" />
          </template>
        </OptionItem>
      </OptionsBlock>

      <!-- Plugin TOML Options -->
      <OptionsBlock :title="i18n.t('pluginTOMLOptions')">
        <OptionItem
          :description="i18n.t('optDescAlignComments')"
          title="alignComments"
        >
          <template #action>
            <Switch v-model="optionsStore.alignComments" />
          </template>
        </OptionItem>
        <OptionItem
          :description="i18n.t('optDescAlignEntries')"
          title="alignEntries"
        >
          <template #action>
            <Switch v-model="optionsStore.alignEntries" />
          </template>
        </OptionItem>
        <OptionItem
          :description="i18n.t('optDescAllowedBlankLines')"
          title="allowedBlankLines"
        >
          <template #action>
            <InputNumber v-model="optionsStore.allowedBlankLines" />
          </template>
        </OptionItem>
        <OptionItem
          :description="i18n.t('optDescArrayAutoCollapse')"
          title="arrayAutoCollapse"
        >
          <template #action>
            <Switch v-model="optionsStore.arrayAutoCollapse" />
          </template>
        </OptionItem>
        <OptionItem
          :description="i18n.t('optDescArrayAutoExpand')"
          title="arrayAutoExpand"
        >
          <template #action>
            <Switch v-model="optionsStore.arrayAutoExpand" />
          </template>
        </OptionItem>
        <OptionItem
          :description="i18n.t('optDescCompactArrays')"
          title="compactArrays"
        >
          <template #action>
            <Switch v-model="optionsStore.compactArrays" />
          </template>
        </OptionItem>
        <OptionItem
          :description="i18n.t('optDescCompactEntries')"
          title="compactEntries"
        >
          <template #action>
            <Switch v-model="optionsStore.compactEntries" />
          </template>
        </OptionItem>
        <OptionItem
          :description="i18n.t('optDescCompactInlineTables')"
          title="compactInlineTables"
        >
          <template #action>
            <Switch v-model="optionsStore.compactInlineTables" />
          </template>
        </OptionItem>
        <OptionItem
          :description="i18n.t('optDescIndentEntries')"
          title="indentEntries"
        >
          <template #action>
            <Switch v-model="optionsStore.indentEntries" />
          </template>
        </OptionItem>
        <OptionItem
          :description="i18n.t('optDescIndentTables')"
          title="indentTables"
        >
          <template #action>
            <Switch v-model="optionsStore.indentTables" />
          </template>
        </OptionItem>
        <OptionItem
          :description="i18n.t('optDescReorderKeys')"
          title="reorderKeys"
        >
          <template #action>
            <Switch v-model="optionsStore.reorderKeys" />
          </template>
        </OptionItem>
      </OptionsBlock>

      <!-- User Configs -->

      <OptionsBlock :title="i18n.t('userConfigs')">
        <OptionItem
          :description="i18n.t('optDescSilent')"
          title="silent"
        >
          <template #action>
            <Switch v-model="configStore.silent" />
          </template>
        </OptionItem>

        <OptionItem
          :description="i18n.t('optDescDebug')"
          title="debug"
        >
          <template #action>
            <Switch v-model="configStore.debug" />
          </template>
        </OptionItem>

        <OptionItem
          :description="i18n.t('optDescAutoFormat')"
          title="autoFormat"
        >
          <template #action>
            <Switch v-model="configStore.autoFormat" />
          </template>
        </OptionItem>
      </OptionsBlock>
    </div>
  </div>
</template>
