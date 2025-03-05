/**
 * @file Prettier Options
 */

import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage } from '@/composables/storage'
import {
  DEFAULT_JAVA_OPTIONS,
  DEFAULT_OPTIONS,
  DEFAULT_PHP_OPTIONS,
  DEFAULT_SVELTE_OPTIONS,
  DEFAULT_TOML_OPTIONS,
  DEFAULT_XML_OPTIONS,
} from '@/constants/options'
import type {
  PluginJavaOptions,
  PluginPHPOptions,
  PluginSvelteOptions,
  PluginTOMLOptions,
  PluginXMLOptions,
  PrettierOptions,
} from '@/types/options'

export const useOptionsStore = defineStore('options', () => {
  const useTabs = useStorage<boolean>('useTabs', DEFAULT_OPTIONS.useTabs)
  const semi = useStorage<boolean>('semi', DEFAULT_OPTIONS.semi)
  const singleQuote = useStorage<boolean>(
    'singleQuote',
    DEFAULT_OPTIONS.singleQuote,
  )
  const bracketSpacing = useStorage<boolean>(
    'bracketSpacing',
    DEFAULT_OPTIONS.bracketSpacing,
  )
  const bracketSameLine = useStorage<boolean>(
    'bracketSameLine',
    DEFAULT_OPTIONS.bracketSameLine,
  )
  const jsxSingleQuote = useStorage<boolean>(
    'jsxSingleQuote',
    DEFAULT_OPTIONS.jsxSingleQuote,
  )
  const singleAttributePerLine = useStorage<boolean>(
    'singleAttributePerLine',
    DEFAULT_OPTIONS.singleAttributePerLine,
  )
  const vueIndentScriptAndStyle = useStorage<boolean>(
    'vueIndentScriptAndStyle',
    DEFAULT_OPTIONS.vueIndentScriptAndStyle,
  )
  const experimentalTernaries = useStorage<boolean>(
    'experimentalTernaries',
    DEFAULT_OPTIONS.experimentalTernaries,
  )

  const quoteProps = useStorage<PrettierOptions['quoteProps']>(
    'quoteProps',
    DEFAULT_OPTIONS.quoteProps,
  )
  const trailingComma = useStorage<PrettierOptions['trailingComma']>(
    'trailingComma',
    DEFAULT_OPTIONS.trailingComma,
  )
  const arrowParens = useStorage<PrettierOptions['arrowParens']>(
    'arrowParens',
    DEFAULT_OPTIONS.arrowParens,
  )
  const proseWrap = useStorage<PrettierOptions['proseWrap']>(
    'proseWrap',
    DEFAULT_OPTIONS.proseWrap,
  )
  const objectWrap = useStorage<PrettierOptions['objectWrap']>(
    'objectWrap',
    DEFAULT_OPTIONS.objectWrap,
  )
  const experimentalOperatorPosition = useStorage<
    PrettierOptions['experimentalOperatorPosition']
  >(
    'experimentalOperatorPosition',
    DEFAULT_OPTIONS.experimentalOperatorPosition,
  )
  const htmlWhitespaceSensitivity = useStorage<
    PrettierOptions['htmlWhitespaceSensitivity']
  >('htmlWhitespaceSensitivity', DEFAULT_OPTIONS.htmlWhitespaceSensitivity)
  const endOfLine = useStorage<PrettierOptions['endOfLine']>(
    'endOfLine',
    DEFAULT_OPTIONS.endOfLine,
  )
  const embeddedLanguageFormatting = useStorage<
    PrettierOptions['embeddedLanguageFormatting']
  >('embeddedLanguageFormatting', DEFAULT_OPTIONS.embeddedLanguageFormatting)

  const printWidth = useStorage<number>(
    'printWidth',
    DEFAULT_OPTIONS.printWidth,
  )
  const tabWidth = useStorage<number>('tabWidth', DEFAULT_OPTIONS.tabWidth)

  const options = computed<PrettierOptions>(() => ({
    useTabs: useTabs.value,
    semi: semi.value,
    singleQuote: singleQuote.value,
    bracketSpacing: bracketSpacing.value,
    bracketSameLine: bracketSameLine.value,
    jsxSingleQuote: jsxSingleQuote.value,
    singleAttributePerLine: singleAttributePerLine.value,
    vueIndentScriptAndStyle: vueIndentScriptAndStyle.value,
    experimentalTernaries: experimentalTernaries.value,
    experimentalOperatorPosition: experimentalOperatorPosition.value,
    quoteProps: quoteProps.value,
    trailingComma: trailingComma.value,
    arrowParens: arrowParens.value,
    proseWrap: proseWrap.value,
    objectWrap: objectWrap.value,
    htmlWhitespaceSensitivity: htmlWhitespaceSensitivity.value,
    endOfLine: endOfLine.value,
    embeddedLanguageFormatting: embeddedLanguageFormatting.value,
    printWidth: printWidth.value,
    tabWidth: tabWidth.value,
  }))

  const xmlSelfClosingSpace = useStorage<boolean>(
    'xmlSelfClosingSpace',
    DEFAULT_XML_OPTIONS.xmlSelfClosingSpace,
  )
  const xmlSortAttributesByKey = useStorage<boolean>(
    'xmlSortAttributesByKey',
    DEFAULT_XML_OPTIONS.xmlSortAttributesByKey,
  )
  const xmlQuoteAttributes = useStorage<PluginXMLOptions['xmlQuoteAttributes']>(
    'xmlQuoteAttributes',
    DEFAULT_XML_OPTIONS.xmlQuoteAttributes,
  )
  const xmlWhitespaceSensitivity = useStorage<
    PluginXMLOptions['xmlWhitespaceSensitivity']
  >('xmlWhitespaceSensitivity', DEFAULT_XML_OPTIONS.xmlWhitespaceSensitivity)
  const xmlPluginOptions = computed<PluginXMLOptions>(() => ({
    xmlSelfClosingSpace: xmlSelfClosingSpace.value,
    xmlSortAttributesByKey: xmlSortAttributesByKey.value,
    xmlQuoteAttributes: xmlQuoteAttributes.value,
    xmlWhitespaceSensitivity: xmlWhitespaceSensitivity.value,
  }))

  const phpVersion = useStorage<PluginPHPOptions['phpVersion']>(
    'phpVersion',
    DEFAULT_PHP_OPTIONS.phpVersion,
  )
  const trailingCommaPHP = useStorage<boolean>(
    'trailingCommaPHP',
    DEFAULT_PHP_OPTIONS.trailingCommaPHP,
  )
  const braceStyle = useStorage<PluginPHPOptions['braceStyle']>(
    'braceStyle',
    DEFAULT_PHP_OPTIONS.braceStyle,
  )
  const phpPluginOptions = computed<PluginPHPOptions>(() => ({
    phpVersion: phpVersion.value,
    trailingCommaPHP: trailingCommaPHP.value,
    braceStyle: braceStyle.value,
  }))

  const entrypoint = useStorage<string>(
    'entrypoint',
    DEFAULT_JAVA_OPTIONS.entrypoint,
  )
  const javaPluginOptions = computed<PluginJavaOptions>(() => ({
    entrypoint: entrypoint.value,
  }))

  const svelteSortOrder = useStorage<PluginSvelteOptions['svelteSortOrder']>(
    'svelteSortOrder',
    DEFAULT_SVELTE_OPTIONS.svelteSortOrder,
  )
  const svelteAllowShorthand = useStorage<boolean>(
    'svelteAllowShorthand',
    DEFAULT_SVELTE_OPTIONS.svelteAllowShorthand,
  )
  const svelteIndentScriptAndStyle = useStorage<boolean>(
    'svelteIndentScriptAndStyle',
    DEFAULT_SVELTE_OPTIONS.svelteIndentScriptAndStyle,
  )
  const sveltePluginOptions = computed<PluginSvelteOptions>(() => ({
    svelteSortOrder: svelteSortOrder.value,
    svelteAllowShorthand: svelteAllowShorthand.value,
    svelteIndentScriptAndStyle: svelteIndentScriptAndStyle.value,
  }))

  const alignComments = useStorage<boolean>(
    'alignComments',
    DEFAULT_TOML_OPTIONS.alignComments,
  )
  const alignEntries = useStorage<boolean>(
    'alignEntries',
    DEFAULT_TOML_OPTIONS.alignEntries,
  )
  const allowedBlankLines = useStorage<number>(
    'allowedBlankLines',
    DEFAULT_TOML_OPTIONS.allowedBlankLines,
  )
  const arrayAutoCollapse = useStorage<boolean>(
    'arrayAutoCollapse',
    DEFAULT_TOML_OPTIONS.arrayAutoCollapse,
  )
  const arrayAutoExpand = useStorage<boolean>(
    'arrayAutoExpand',
    DEFAULT_TOML_OPTIONS.arrayAutoExpand,
  )
  const compactArrays = useStorage<boolean>(
    'compactArrays',
    DEFAULT_TOML_OPTIONS.compactArrays,
  )
  const compactEntries = useStorage<boolean>(
    'compactEntries',
    DEFAULT_TOML_OPTIONS.compactEntries,
  )
  const compactInlineTables = useStorage<boolean>(
    'compactInlineTables',
    DEFAULT_TOML_OPTIONS.compactInlineTables,
  )
  const indentEntries = useStorage<boolean>(
    'indentEntries',
    DEFAULT_TOML_OPTIONS.indentEntries,
  )
  const indentTables = useStorage<boolean>(
    'indentTables',
    DEFAULT_TOML_OPTIONS.indentTables,
  )
  const reorderKeys = useStorage<boolean>(
    'reorderKeys',
    DEFAULT_TOML_OPTIONS.reorderKeys,
  )
  const tomlPluginOptions = computed<PluginTOMLOptions>(() => ({
    alignComments: alignComments.value,
    alignEntries: alignEntries.value,
    allowedBlankLines: allowedBlankLines.value,
    arrayAutoCollapse: arrayAutoCollapse.value,
    arrayAutoExpand: arrayAutoExpand.value,
    compactArrays: compactArrays.value,
    compactEntries: compactEntries.value,
    compactInlineTables: compactInlineTables.value,
    indentEntries: indentEntries.value,
    indentTables: indentTables.value,
    reorderKeys: reorderKeys.value,
  }))

  return {
    options,

    // Boolean
    useTabs,
    semi,
    singleQuote,
    bracketSpacing,
    bracketSameLine,
    jsxSingleQuote,
    singleAttributePerLine,
    vueIndentScriptAndStyle,
    experimentalTernaries,

    // String
    quoteProps,
    trailingComma,
    arrowParens,
    proseWrap,
    objectWrap,
    experimentalOperatorPosition,
    htmlWhitespaceSensitivity,
    endOfLine,
    embeddedLanguageFormatting,

    // Number
    printWidth,
    tabWidth,

    /**
     * XML
     */
    xmlSelfClosingSpace,
    xmlSortAttributesByKey,
    xmlQuoteAttributes,
    xmlWhitespaceSensitivity,
    xmlPluginOptions,

    /**
     * PHP
     */
    phpVersion,
    trailingCommaPHP,
    braceStyle,
    phpPluginOptions,

    /**
     * Java
     */
    entrypoint,
    javaPluginOptions,

    /**
     * Svelte
     */
    svelteSortOrder,
    svelteAllowShorthand,
    svelteIndentScriptAndStyle,
    sveltePluginOptions,

    /**
     * TOML
     */
    alignComments,
    alignEntries,
    allowedBlankLines,
    arrayAutoCollapse,
    arrayAutoExpand,
    compactArrays,
    compactEntries,
    compactInlineTables,
    indentEntries,
    indentTables,
    reorderKeys,
    tomlPluginOptions,
  }
})
