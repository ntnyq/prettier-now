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
import {
  createDefaultOptionsSnapshot,
  createOptionsPreset,
  removeOptionsPreset,
  upsertOptionsPreset,
} from '@/utils/optionsPreset'
import type {
  PluginJavaOptions,
  PluginPHPOptions,
  PluginSvelteOptions,
  PluginTOMLOptions,
  PluginXMLOptions,
  PrettierOptions,
} from '@/types/options'
import type { OptionsPreset, OptionsSnapshot } from '@/types/optionsPreset'

export const useOptionsStore = defineStore('options', () => {
  const presets = useStorage<OptionsPreset[]>('optionsPresets', [])

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

  function createSnapshot() {
    return {
      version: 1,
      options: { ...options.value },
      xmlPluginOptions: { ...xmlPluginOptions.value },
      phpPluginOptions: { ...phpPluginOptions.value },
      javaPluginOptions: { ...javaPluginOptions.value },
      sveltePluginOptions: { ...sveltePluginOptions.value },
      tomlPluginOptions: { ...tomlPluginOptions.value },
    } satisfies OptionsSnapshot
  }

  function applySnapshot(snapshot: OptionsSnapshot) {
    useTabs.value = snapshot.options.useTabs
    semi.value = snapshot.options.semi
    singleQuote.value = snapshot.options.singleQuote
    bracketSpacing.value = snapshot.options.bracketSpacing
    bracketSameLine.value = snapshot.options.bracketSameLine
    jsxSingleQuote.value = snapshot.options.jsxSingleQuote
    singleAttributePerLine.value = snapshot.options.singleAttributePerLine
    vueIndentScriptAndStyle.value = snapshot.options.vueIndentScriptAndStyle
    experimentalTernaries.value = snapshot.options.experimentalTernaries
    quoteProps.value = snapshot.options.quoteProps
    trailingComma.value = snapshot.options.trailingComma
    arrowParens.value = snapshot.options.arrowParens
    proseWrap.value = snapshot.options.proseWrap
    objectWrap.value = snapshot.options.objectWrap
    experimentalOperatorPosition.value =
      snapshot.options.experimentalOperatorPosition
    htmlWhitespaceSensitivity.value = snapshot.options.htmlWhitespaceSensitivity
    endOfLine.value = snapshot.options.endOfLine
    embeddedLanguageFormatting.value =
      snapshot.options.embeddedLanguageFormatting
    printWidth.value = snapshot.options.printWidth
    tabWidth.value = snapshot.options.tabWidth

    xmlSelfClosingSpace.value = snapshot.xmlPluginOptions.xmlSelfClosingSpace
    xmlSortAttributesByKey.value =
      snapshot.xmlPluginOptions.xmlSortAttributesByKey
    xmlQuoteAttributes.value = snapshot.xmlPluginOptions.xmlQuoteAttributes
    xmlWhitespaceSensitivity.value =
      snapshot.xmlPluginOptions.xmlWhitespaceSensitivity

    phpVersion.value = snapshot.phpPluginOptions.phpVersion
    trailingCommaPHP.value = snapshot.phpPluginOptions.trailingCommaPHP
    braceStyle.value = snapshot.phpPluginOptions.braceStyle

    entrypoint.value = snapshot.javaPluginOptions.entrypoint

    svelteSortOrder.value = snapshot.sveltePluginOptions.svelteSortOrder
    svelteAllowShorthand.value =
      snapshot.sveltePluginOptions.svelteAllowShorthand
    svelteIndentScriptAndStyle.value =
      snapshot.sveltePluginOptions.svelteIndentScriptAndStyle

    alignComments.value = snapshot.tomlPluginOptions.alignComments
    alignEntries.value = snapshot.tomlPluginOptions.alignEntries
    allowedBlankLines.value = snapshot.tomlPluginOptions.allowedBlankLines
    arrayAutoCollapse.value = snapshot.tomlPluginOptions.arrayAutoCollapse
    arrayAutoExpand.value = snapshot.tomlPluginOptions.arrayAutoExpand
    compactArrays.value = snapshot.tomlPluginOptions.compactArrays
    compactEntries.value = snapshot.tomlPluginOptions.compactEntries
    compactInlineTables.value = snapshot.tomlPluginOptions.compactInlineTables
    indentEntries.value = snapshot.tomlPluginOptions.indentEntries
    indentTables.value = snapshot.tomlPluginOptions.indentTables
    reorderKeys.value = snapshot.tomlPluginOptions.reorderKeys
  }

  function resetOptions() {
    applySnapshot(createDefaultOptionsSnapshot())
  }

  function savePreset(name: string) {
    const preset = createOptionsPreset({
      name,
      snapshot: createSnapshot(),
    })

    presets.value = upsertOptionsPreset(presets.value, preset)
  }

  function applyPreset(id: string) {
    const preset = presets.value.find(item => item.id === id)

    if (!preset) {
      return false
    }

    applySnapshot(preset.snapshot)
    return true
  }

  function deletePreset(id: string) {
    presets.value = removeOptionsPreset(presets.value, id)
  }

  return {
    presets,
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

    createSnapshot,
    applySnapshot,
    resetOptions,
    savePreset,
    applyPreset,
    deletePreset,
  }
})
