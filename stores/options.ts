/**
 * @file Prettier Options
 */

import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@/hooks/useStorage'
import { DEFAULT_OPTIONS } from '@/constants/options'
import type { PrettierOptions } from '@/types/options'

export const useOptionsStore = defineStore('options', () => {
  const useTabs = useStorage<boolean>('useTabs', DEFAULT_OPTIONS.useTabs)
  const semi = useStorage<boolean>('semi', DEFAULT_OPTIONS.semi)
  const singleQuote = useStorage<boolean>('singleQuote', DEFAULT_OPTIONS.singleQuote)
  const bracketSpacing = useStorage<boolean>('bracketSpacing', DEFAULT_OPTIONS.bracketSpacing)
  const bracketSameLine = useStorage<boolean>('bracketSameLine', DEFAULT_OPTIONS.bracketSameLine)
  const jsxSingleQuote = useStorage<boolean>('jsxSingleQuote', DEFAULT_OPTIONS.jsxSingleQuote)
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

  const quoteProps = useStorage<string>('quoteProps', DEFAULT_OPTIONS.quoteProps)
  const trailingComma = useStorage<string>('trailingComma', DEFAULT_OPTIONS.trailingComma)
  const arrowParens = useStorage<string>('arrowParens', DEFAULT_OPTIONS.arrowParens)
  const proseWrap = useStorage<string>('proseWrap', DEFAULT_OPTIONS.proseWrap)
  const htmlWhitespaceSensitivity = useStorage<string>(
    'htmlWhitespaceSensitivity',
    DEFAULT_OPTIONS.htmlWhitespaceSensitivity,
  )
  const endOfLine = useStorage<string>('endOfLine', DEFAULT_OPTIONS.endOfLine)
  const embeddedLanguageFormatting = useStorage<string>(
    'embeddedLanguageFormatting',
    DEFAULT_OPTIONS.embeddedLanguageFormatting,
  )

  const printWidth = useStorage<number>('printWidth', DEFAULT_OPTIONS.printWidth)
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
    quoteProps: quoteProps.value,
    trailingComma: trailingComma.value,
    arrowParens: arrowParens.value,
    proseWrap: proseWrap.value,
    htmlWhitespaceSensitivity: htmlWhitespaceSensitivity.value,
    endOfLine: endOfLine.value,
    embeddedLanguageFormatting: embeddedLanguageFormatting.value,
    printWidth: printWidth.value,
    tabWidth: tabWidth.value,
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
    htmlWhitespaceSensitivity,
    endOfLine,
    embeddedLanguageFormatting,

    // Number
    printWidth,
    tabWidth,
  }
})
