<script lang="ts" setup>
import { i18n } from '#i18n'
import { useOptionsStore } from '@/stores/options'
import SettingItem from './SettingItem.vue'
import SettingOptionalNumberField from './SettingOptionalNumberField.vue'
import SettingOptionalSelect from './SettingOptionalSelect.vue'
import SettingsSection from './SettingsSection.vue'

const optionsStore = useOptionsStore()
</script>

<template>
  <SettingsSection :title="i18n.t('pluginTOMLOptions')">
    <SettingItem
      :description="i18n.t('optDescTomlVersion')"
      title="TomlVersion"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingOptionalSelect
          v-model="optionsStore.tomlPluginOptions.tomlVersion"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="['v1.0.0', 'v1.1.0', 'v1.1.0-preview']"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescArrayBracketSpaceWidth')"
      title="ArrayBracketSpaceWidth"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingOptionalNumberField
          v-model="optionsStore.tomlPluginOptions.arrayBracketSpaceWidth"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :min="0"
          :max="255"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescArrayCommaSpaceWidth')"
      title="ArrayCommaSpaceWidth"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingOptionalNumberField
          v-model="optionsStore.tomlPluginOptions.arrayCommaSpaceWidth"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :min="0"
          :max="255"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescCommentStyle')"
      title="CommentStyle"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingOptionalSelect
          v-model="optionsStore.tomlPluginOptions.commentStyle"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="['normalize', 'preserve']"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescDateTimeDelimiter')"
      title="DateTimeDelimiter"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingOptionalSelect
          v-model="optionsStore.tomlPluginOptions.dateTimeDelimiter"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="['T', 'space', 'preserve']"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescGroupBlankLinesLimit')"
      title="GroupBlankLinesLimit"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingOptionalNumberField
          v-model="optionsStore.tomlPluginOptions.groupBlankLinesLimit"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :min="1"
          :max="255"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescIndentSubTables')"
      title="IndentSubTables"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingOptionalSelect
          v-model="optionsStore.tomlPluginOptions.indentSubTables"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="[true, false]"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescIndentTableKeyValuePairs')"
      title="IndentTableKeyValuePairs"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingOptionalSelect
          v-model="optionsStore.tomlPluginOptions.indentTableKeyValuePairs"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="[true, false]"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescInlineTableBraceSpaceWidth')"
      title="InlineTableBraceSpaceWidth"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingOptionalNumberField
          v-model="optionsStore.tomlPluginOptions.inlineTableBraceSpaceWidth"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :min="0"
          :max="255"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescInlineTableCommaSpaceWidth')"
      title="InlineTableCommaSpaceWidth"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingOptionalNumberField
          v-model="optionsStore.tomlPluginOptions.inlineTableCommaSpaceWidth"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :min="0"
          :max="255"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescKeyValueEqualsSignAlignment')"
      title="KeyValueEqualsSignAlignment"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingOptionalSelect
          v-model="optionsStore.tomlPluginOptions.keyValueEqualsSignAlignment"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="[true, false]"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescKeyQuoteStyle')"
      title="KeyQuoteStyle"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingOptionalSelect
          v-model="optionsStore.tomlPluginOptions.keyQuoteStyle"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="['double', 'single', 'preserve']"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescStringQuoteStyle')"
      title="StringQuoteStyle"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingOptionalSelect
          v-model="optionsStore.tomlPluginOptions.stringQuoteStyle"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="['double', 'single', 'preserve']"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescTrailingCommentAlignment')"
      title="TrailingCommentAlignment"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingOptionalSelect
          v-model="optionsStore.tomlPluginOptions.trailingCommentAlignment"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :items="[true, false]"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescKeyValueEqualsSignSpaceWidth')"
      title="KeyValueEqualsSignSpaceWidth"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingOptionalNumberField
          v-model="optionsStore.tomlPluginOptions.keyValueEqualsSignSpaceWidth"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :min="0"
          :max="255"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescTableBlankLines')"
      title="TableBlankLines"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingOptionalNumberField
          v-model="optionsStore.tomlPluginOptions.tableBlankLines"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :min="0"
          :max="255"
        />
      </template>
    </SettingItem>

    <SettingItem
      :description="i18n.t('optDescTrailingCommentSpaceWidth')"
      title="TrailingCommentSpaceWidth"
    >
      <template #action="{ descriptionId, titleId }">
        <SettingOptionalNumberField
          v-model="optionsStore.tomlPluginOptions.trailingCommentSpaceWidth"
          :aria-describedby="descriptionId"
          :aria-labelledby="titleId"
          :min="0"
          :max="255"
        />
      </template>
    </SettingItem>
  </SettingsSection>
</template>
