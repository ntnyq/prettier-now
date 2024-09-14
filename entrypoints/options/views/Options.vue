<script lang="ts" setup>
import { useI18n } from 'petite-vue-i18n'
import { useConfigStore } from '@/stores/config'
import { useOptionsStore } from '@/stores/options'

const { t } = useI18n()
const optionsStore = useOptionsStore()
const configStore = useConfigStore()
</script>

<template>
  <div class="relative overflow-y-auto">
    <div class="mx-auto max-w-[720px] p-8">
      <div class="relative py-6">
        <h3 class="mb-5 text-3xl font-semibold">{{ t('prettierOptions') }}</h3>
        <div class="flex flex-col gap-4">
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
        </div>
      </div>

      <div class="relative py-6">
        <h3 class="mb-5 text-3xl font-semibold">{{ t('userConfigs') }}</h3>
        <div class="flex flex-col gap-4">
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
            title="locale"
            description="Custom i18n locale."
          >
            <template #action>
              <Select
                v-model="configStore.locale"
                :items="[
                  {
                    label: t('en'),
                    value: 'en',
                  },
                  {
                    label: t('zhCN'),
                    value: 'zh-CN',
                  },
                ]"
              />
            </template>
          </OptionItem>
        </div>
      </div>
    </div>
  </div>
</template>
