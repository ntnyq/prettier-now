/**
 * @file Infer formatting language from editor context
 */

import {
  LANGUAGE_ID,
  languageExtensions,
  languages,
} from '@/constants/language'

/**
 * Alternative editor and file tokens mapped to supported language ids.
 */
const LANGUAGE_ALIASES = {
  babel: LANGUAGE_ID.javascript,
  babylon: LANGUAGE_ID.javascript,
  javascriptreact: LANGUAGE_ID.javascript,
  js: LANGUAGE_ID.javascript,
  jsx: LANGUAGE_ID.javascript,
  lang_js: LANGUAGE_ID.javascript,
  md: LANGUAGE_ID.markdown,
  mdx: LANGUAGE_ID.markdown,
  sass: LANGUAGE_ID.scss,
  ts: LANGUAGE_ID.typescript,
  tsx: LANGUAGE_ID.typescript,
  typescriptreact: LANGUAGE_ID.typescript,
  yml: LANGUAGE_ID.yaml,
} as const

/**
 * Supported language ids used for direct token lookup.
 */
const languageIds = new Set(Object.values(LANGUAGE_ID))

/**
 * Context values used to infer the language for focused editor source.
 */
export interface InferLanguageContext {
  /**
   * Language id used when no hints or content rules match.
   */
  fallbackLanguageId?: string

  /**
   * Editor, DOM, or class-name hints that may contain language tokens.
   */
  hints?: string[]

  /**
   * Source text used for content-based language inference.
   */
  source: string

  /**
   * Page URL used as an additional filename-style hint.
   */
  url?: string
}

/**
 * Normalize a language hint for case-insensitive matching.
 *
 * @param value - Raw hint value.
 * @returns Trimmed lowercase hint.
 */
function normalizeHint(value: string) {
  return value.trim().toLowerCase()
}

/**
 * Resolve a language id from a file name or URL-like value.
 *
 * @param value - File name or URL-like hint.
 * @returns Matching language id when the extension is supported.
 */
function getLanguageIdForName(value: string) {
  const normalized = normalizeHint(value)
  const fileName = normalized.split(/[?#]/)[0] ?? normalized
  const fileExt = fileName.split('/').pop()?.split('.').pop()

  if (fileExt && fileExt in languageExtensions) {
    return languageExtensions[fileExt as keyof typeof languageExtensions]
  }

  return undefined
}

/**
 * Resolve a language id from a single normalized token.
 *
 * @param value - Raw token value.
 * @returns Matching language id when supported.
 */
function getLanguageIdForToken(value: string) {
  const token = normalizeHint(value).replace(/^[._-]+|[._-]+$/g, '')

  if (languageIds.has(token)) {
    return token
  }

  if (token in LANGUAGE_ALIASES) {
    return LANGUAGE_ALIASES[token as keyof typeof LANGUAGE_ALIASES]
  }

  return undefined
}

/**
 * Infer a language id from an editor or DOM hint string.
 *
 * @param value - Hint value to inspect.
 * @returns Matching language id when a known token is found.
 */
function inferLanguageFromHint(value: string) {
  const fileLanguageId = getLanguageIdForName(value)

  if (fileLanguageId) {
    return fileLanguageId
  }

  const tokens = normalizeHint(value)
    .replaceAll('\\', '/')
    .split(/[^a-z0-9+#]+/)
    .filter(Boolean)

  for (const token of tokens) {
    const languageId = getLanguageIdForToken(token)

    if (languageId) {
      return languageId
    }
  }

  const languagePattern =
    /(?:ace\/mode|cm-lang|lang|language|mode|source)[_-]([a-z0-9+#-]+)/i
  const languageMatch = value.match(languagePattern)

  return languageMatch?.[1]
    ? getLanguageIdForToken(languageMatch[1])
    : undefined
}

/**
 * Check whether source text resembles a CSS rule block.
 *
 * @param source - Source text to inspect.
 * @returns Whether the source has CSS-like block syntax.
 */
function looksLikeCss(source: string) {
  const blockStartIndex = source.indexOf('{')
  const blockEndIndex = source.lastIndexOf('}')

  if (blockStartIndex < 1 || blockEndIndex <= blockStartIndex) {
    return false
  }

  const blockContent = source.slice(blockStartIndex + 1, blockEndIndex)

  return blockContent.includes(':') && /[;}]/.test(blockContent)
}

/**
 * Infer a language id from source content patterns.
 *
 * @param source - Source text to inspect.
 * @returns Matching language id when content patterns are recognized.
 */
function inferLanguageFromContent(source: string) {
  const value = source.trim()

  if (!value) {
    return
  }

  if (/^<\?php\b/i.test(value)) {
    return LANGUAGE_ID.php
  }

  if (/^[{[]/.test(value)) {
    try {
      JSON.parse(value)
      return LANGUAGE_ID.json
    } catch {}
  }

  if (
    /^\s*<template[\s>]/i.test(value)
    || (/<script[\s>][\s\S]*<\/script>/i.test(value)
      && /<template[\s>]/i.test(value))
  ) {
    return LANGUAGE_ID.vue
  }

  if (
    /^\s*<!doctype html/i.test(value)
    || /<\/?[a-z][\w:-]*(?:\s[^>]*)?>/i.test(value)
  ) {
    return /^<\?xml\b/i.test(value) ? LANGUAGE_ID.xml : LANGUAGE_ID.html
  }

  if (/^\s*(?:query|mutation|subscription|fragment)\b/.test(value)) {
    return LANGUAGE_ID.graphql
  }

  if (looksLikeCss(value)) {
    return LANGUAGE_ID.css
  }

  if (/^\s*(?:import|export|const|let|var|function|class)\b/m.test(value)) {
    return /\b(?:interface|type)\s+\w+\b|:\s*[A-Z_a-z][\w<>[\] |]*(?:[=,);{]|$)/m.test(
      value,
    )
      ? LANGUAGE_ID.typescript
      : LANGUAGE_ID.javascript
  }

  if (
    /^\s*```|\n\s*```|^\s*#{1,6}\s+\S|^\s*[-*+]\s+\S|^\s*\|.+\|\s*$/m.test(
      value,
    )
  ) {
    return LANGUAGE_ID.markdown
  }

  if (/^\s*\[[\w.-]+\]\s*$/m.test(value) && /^\s*[\w.-]+\s*=/.test(value)) {
    return LANGUAGE_ID.toml
  }

  if (/^\s*[\w.-]+:\s+\S/m.test(value)) {
    return LANGUAGE_ID.yaml
  }
}

/**
 * Resolve the Prettier parser for a language id.
 *
 * @param languageId - Language id to resolve.
 * @returns Parser id configured for the language, or the language id itself.
 */
export function resolveLanguageParser(languageId: string) {
  return languages.find(item => item.id === languageId)?.parser || languageId
}

/**
 * Infer the best language id from focused editor context.
 *
 * @param context - Editor source and optional inference hints.
 * @returns Supported language id selected for formatting.
 */
export function inferLanguageFromEditorContext(context: InferLanguageContext) {
  for (const hint of context.hints ?? []) {
    const languageId = inferLanguageFromHint(hint)

    if (languageId) {
      return languageId
    }
  }

  if (context.url) {
    const languageId = inferLanguageFromHint(context.url)

    if (languageId) {
      return languageId
    }
  }

  return (
    inferLanguageFromContent(context.source)
    || context.fallbackLanguageId
    || LANGUAGE_ID.markdown
  )
}
