<script lang="ts" setup>
import { i18n } from '#i18n'
import { PRETTIER_OPTION_VALUES } from '@/constants/optionValues'
import { useOptionsStore } from '@/stores/options'
import SettingItem from './SettingItem.vue'
import SettingNumberField from './SettingNumberField.vue'
import SettingSelect from './SettingSelect.vue'
import SettingsSection from './SettingsSection.vue'
import SettingSwitch from './SettingSwitch.vue'

const optionsStore = useOptionsStore()
</script>

<template>
  <SettingsSection :title="i18n.t('prettierOptions')">
    <SettingItem
      :description="i18n.t('optDescPrintWidth')"
      title="PrintWidth"
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
      title="TabWidth"
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
      title="UseTabs"
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
      title="Semi"
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
      title="SingleQuote"
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
      title="QuoteProps"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSelect
          v-model="optionsStore.quoteProps"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="PRETTIER_OPTION_VALUES.quoteProps"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescObjectWrap')"
      title="ObjectWrap"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSelect
          v-model="optionsStore.objectWrap"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="PRETTIER_OPTION_VALUES.objectWrap"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescExperimentalOperatorPosition')"
      title="ExperimentalOperatorPosition"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSelect
          v-model="optionsStore.experimentalOperatorPosition"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="PRETTIER_OPTION_VALUES.experimentalOperatorPosition"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescJsxSingleQuote')"
      title="JsxSingleQuote"
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
      title="TrailingComma"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSelect
          v-model="optionsStore.trailingComma"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="PRETTIER_OPTION_VALUES.trailingComma"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescBracketSpacing')"
      title="BracketSpacing"
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
      title="BracketSameLine"
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
      title="ArrowParens"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSelect
          v-model="optionsStore.arrowParens"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="PRETTIER_OPTION_VALUES.arrowParens"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescHtmlWhitespaceSensitivity')"
      title="HtmlWhitespaceSensitivity"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSelect
          v-model="optionsStore.htmlWhitespaceSensitivity"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="PRETTIER_OPTION_VALUES.htmlWhitespaceSensitivity"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescVueIndentScriptAndStyle')"
      title="VueIndentScriptAndStyle"
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
      title="EndOfLine"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSelect
          v-model="optionsStore.endOfLine"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="PRETTIER_OPTION_VALUES.endOfLine"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescSingleAttributePerLine')"
      title="SingleAttributePerLine"
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
      title="ExperimentalTernaries"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSwitch
          v-model="optionsStore.experimentalTernaries"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescProseWrap')"
      title="ProseWrap"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSelect
          v-model="optionsStore.proseWrap"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="PRETTIER_OPTION_VALUES.proseWrap"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescEmbeddedLanguageFormatting')"
      title="EmbeddedLanguageFormatting"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingSelect
          v-model="optionsStore.embeddedLanguageFormatting"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="PRETTIER_OPTION_VALUES.embeddedLanguageFormatting"
        />
      </template>
    </SettingItem>
  </SettingsSection>
</template>
