<script lang="ts" setup>
import { JAVA_ENTRYPOINTS } from '@/constants/options'
import { useConfigStore } from '@/stores/config'
import { useOptionsStore } from '@/stores/options'
import { i18n } from '#i18n'

const optionsStore = useOptionsStore()
const configStore = useConfigStore()
</script>

<template>
  <div class="relative overflow-y-auto">
    <div class="mx-auto max-w-720px p-8">
      <!-- Prettier Core Options -->
      <OptionsBlock :title="i18n.t('prettierOptions')">
        <OptionItem
          title="printWidth"
          description="Specify the line length that the printer will wrap on."
        >
          <template #action>
            <InputNumber v-model="optionsStore.printWidth" />
          </template>
        </OptionItem>

        <OptionItem
          title="tabWidth"
          description="Specify the number of spaces per indentation-level."
        >
          <template #action>
            <InputNumber v-model="optionsStore.tabWidth" />
          </template>
        </OptionItem>

        <OptionItem
          title="useTabs"
          description="Indent lines with tabs instead of spaces."
        >
          <template #action>
            <Switch v-model="optionsStore.useTabs" />
          </template>
        </OptionItem>

        <OptionItem
          title="semi"
          description="Print semicolons at the ends of statements."
        >
          <template #action>
            <Switch v-model="optionsStore.semi" />
          </template>
        </OptionItem>

        <OptionItem
          title="singleQuote"
          description="Use single quotes instead of double quotes."
        >
          <template #action>
            <Switch v-model="optionsStore.singleQuote" />
          </template>
        </OptionItem>

        <OptionItem
          title="quoteProps"
          description="Change when properties in objects are quoted."
        >
          <template #action>
            <Select
              v-model="optionsStore.quoteProps"
              :items="['as-needed', 'consistent', 'preserve']"
            />
          </template>
        </OptionItem>

        <OptionItem
          title="objectWrap"
          description="How to wrap object literals."
        >
          <template #action>
            <Select
              v-model="optionsStore.objectWrap"
              :items="['preserve', 'collapse']"
            />
          </template>
        </OptionItem>

        <OptionItem
          title="experimentalOperatorPosition"
          description="Where to print operators when binary expressions wrap lines."
        >
          <template #action>
            <Select
              v-model="optionsStore.experimentalOperatorPosition"
              :items="['start', 'end']"
            />
          </template>
        </OptionItem>

        <OptionItem
          title="jsxSingleQuote"
          description="Use single quotes instead of double quotes in JSX."
        >
          <template #action>
            <Switch v-model="optionsStore.jsxSingleQuote" />
          </template>
        </OptionItem>

        <OptionItem
          title="trailingComma"
          description="Print trailing commas wherever possible in multi-line comma-separated syntactic structures."
        >
          <template #action>
            <Select
              v-model="optionsStore.trailingComma"
              :items="['all', 'es5', 'none']"
            />
          </template>
        </OptionItem>

        <OptionItem
          title="bracketSpacing"
          description="Print spaces between brackets in object literals."
        >
          <template #action>
            <Switch v-model="optionsStore.bracketSpacing" />
          </template>
        </OptionItem>

        <OptionItem
          title="bracketSameLine"
          description="Put the > of a multi-line HTML (HTML, JSX, Vue, Angular) element at the end of the last line instead of being alone on the next line (does not apply to self closing elements)."
        >
          <template #action>
            <Switch v-model="optionsStore.bracketSameLine" />
          </template>
        </OptionItem>

        <OptionItem
          title="arrowParens"
          description="Include parentheses around a sole arrow function parameter."
        >
          <template #action>
            <Select
              v-model="optionsStore.arrowParens"
              :items="['always', 'avoid']"
            />
          </template>
        </OptionItem>

        <OptionItem
          title="htmlWhitespaceSensitivity"
          description="Specify the global whitespace sensitivity for HTML, Vue, Angular, and Handlebars."
        >
          <template #action>
            <Select
              v-model="optionsStore.htmlWhitespaceSensitivity"
              :items="['css', 'strict', 'ignore']"
            />
          </template>
        </OptionItem>

        <OptionItem
          title="vueIndentScriptAndStyle"
          description="Whether or not to indent the code inside <script> and <style> tags in Vue files."
        >
          <template #action>
            <Switch v-model="optionsStore.vueIndentScriptAndStyle" />
          </template>
        </OptionItem>

        <OptionItem
          title="endOfLine"
          description="Specify the end of line style."
        >
          <template #action>
            <Select
              v-model="optionsStore.endOfLine"
              :items="['lf', 'crlf', 'cr', 'auto']"
            />
          </template>
        </OptionItem>

        <OptionItem
          title="singleAttributePerLine"
          description="Enforce single attribute per line in HTML, Vue and JSX."
        >
          <template #action>
            <Switch v-model="optionsStore.singleAttributePerLine" />
          </template>
        </OptionItem>

        <OptionItem
          title="experimentalTernaries"
          description="Specify the ternaries style."
        >
          <template #action>
            <Switch v-model="optionsStore.experimentalTernaries" />
          </template>
        </OptionItem>
      </OptionsBlock>

      <!-- Plugin XML Options -->
      <OptionsBlock :title="i18n.t('pluginXMLOptions')">
        <OptionItem
          title="xmlSelfClosingSpace"
          description="Adds a space before self-closing tags."
        >
          <template #action>
            <Switch v-model="optionsStore.xmlSelfClosingSpace" />
          </template>
        </OptionItem>
        <OptionItem
          title="xmlSortAttributesByKey"
          description="Orders XML attributes by key alphabetically while prioritizing xmlns attributes."
        >
          <template #action>
            <Switch v-model="optionsStore.xmlSortAttributesByKey" />
          </template>
        </OptionItem>
        <OptionItem
          title="xmlQuoteAttributes"
          description="How to quoted attributes in XML."
        >
          <template #action>
            <Select
              v-model="optionsStore.xmlQuoteAttributes"
              :items="['preserve', 'double', 'single']"
            />
          </template>
        </OptionItem>
        <OptionItem
          title="xmlWhitespaceSensitivity"
          description="How to handle whitespaces in XML."
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
          title="phpVersion"
          description="Specifying the minimum target PHP version."
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
          title="trailingCommaPHP"
          description="Print trailing commas wherever possible when multi-line."
        >
          <template #action>
            <Switch v-model="optionsStore.trailingCommaPHP" />
          </template>
        </OptionItem>
        <OptionItem
          title="braceStyle"
          description="Print one space or newline for code blocks (classes and functions)."
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
          title="entrypoint"
          description="Prettify from the entrypoint, allowing to use prettier on snippet."
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
          title="svelteSortOrder"
          description="Sort order for scripts, markup, and styles."
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
          title="svelteAllowShorthand"
          description="Enable/disable component attribute shorthand if attribute name and expressions are same."
        >
          <template #action>
            <Switch v-model="optionsStore.svelteAllowShorthand" />
          </template>
        </OptionItem>
        <OptionItem
          title="svelteIndentScriptAndStyle"
          description="Whether or not to indent the code inside <script> and <style> tags in Svelte files."
        >
          <template #action>
            <Switch v-model="optionsStore.svelteIndentScriptAndStyle" />
          </template>
        </OptionItem>
      </OptionsBlock>

      <!-- Plugin TOML Options -->
      <OptionsBlock :title="i18n.t('pluginTOMLOptions')">
        <OptionItem
          title="alignComments"
          description="Align consecutive comments after entries and items vertically. This applies to comments that are after entries or array items."
        >
          <template #action>
            <Switch v-model="optionsStore.alignComments" />
          </template>
        </OptionItem>
        <OptionItem
          title="alignEntries"
          description="Align consecutive entries vertically."
        >
          <template #action>
            <Switch v-model="optionsStore.alignEntries" />
          </template>
        </OptionItem>
        <OptionItem
          title="allowedBlankLines"
          description="The maximum number of allowed blank lines between entries and tables."
        >
          <template #action>
            <InputNumber v-model="optionsStore.allowedBlankLines" />
          </template>
        </OptionItem>
        <OptionItem
          title="arrayAutoCollapse"
          description="Collapse arrays that don't exceed the maximum column width and don't contain comments."
        >
          <template #action>
            <Switch v-model="optionsStore.arrayAutoCollapse" />
          </template>
        </OptionItem>
        <OptionItem
          title="arrayAutoExpand"
          description="Expand arrays to multiple lines that exceed the maximum column width."
        >
          <template #action>
            <Switch v-model="optionsStore.arrayAutoExpand" />
          </template>
        </OptionItem>
        <OptionItem
          title="compactArrays"
          description="Omit white space padding from single-line arrays."
        >
          <template #action>
            <Switch v-model="optionsStore.compactArrays" />
          </template>
        </OptionItem>
        <OptionItem
          title="compactEntries"
          description="Omit white space around `=`."
        >
          <template #action>
            <Switch v-model="optionsStore.compactEntries" />
          </template>
        </OptionItem>
        <OptionItem
          title="compactInlineTables"
          description="Omit white space padding from the start and end of inline tables."
        >
          <template #action>
            <Switch v-model="optionsStore.compactInlineTables" />
          </template>
        </OptionItem>
        <OptionItem
          title="indentEntries"
          description="Indent entries under tables."
        >
          <template #action>
            <Switch v-model="optionsStore.indentEntries" />
          </template>
        </OptionItem>
        <OptionItem
          title="indentTables"
          description="Indent based on tables and arrays of tables and their subtables, subtables out of order are not indented."
        >
          <template #action>
            <Switch v-model="optionsStore.indentTables" />
          </template>
        </OptionItem>
        <OptionItem
          title="reorderKeys"
          description="Alphabetically reorder keys that are not separated by empty lines."
        >
          <template #action>
            <Switch v-model="optionsStore.reorderKeys" />
          </template>
        </OptionItem>
      </OptionsBlock>

      <!-- User Configs -->

      <OptionsBlock :title="i18n.t('userConfigs')">
        <OptionItem
          title="silent"
          description="Whether toast message after user action."
        >
          <template #action>
            <Switch v-model="configStore.silent" />
          </template>
        </OptionItem>

        <OptionItem
          title="debug"
          description="Whether log runtime information in console."
        >
          <template #action>
            <Switch v-model="configStore.debug" />
          </template>
        </OptionItem>

        <OptionItem
          title="autoFormat"
          description="Auto format source code after pasting."
        >
          <template #action>
            <Switch v-model="configStore.autoFormat" />
          </template>
        </OptionItem>
      </OptionsBlock>
    </div>
  </div>
</template>
