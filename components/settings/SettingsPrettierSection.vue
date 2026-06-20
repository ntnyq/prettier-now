<script lang="ts" setup>
import { i18n } from '#i18n'
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
</template>
