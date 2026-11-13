import { describe, expect, it } from 'vitest'
import { LANGUAGE_ID } from '@/constants/language'
import {
  inferLanguageFromEditorContext,
  resolveLanguageParser,
} from '@/utils/languageInference'

describe('editor language inference', () => {
  it.each([
    ['language-jsx', LANGUAGE_ID.javascript],
    ['language-tsx', LANGUAGE_ID.typescript],
    ['constructor', LANGUAGE_ID.markdown],
    ['__proto__', LANGUAGE_ID.markdown],
  ])('normalizes %s to a supported language', (hint, expected) => {
    expect(
      inferLanguageFromEditorContext({ source: 'hello', hints: [hint] }),
    ).toBe(expected)
  })

  it.each([
    ['```html\n<div>hello</div>\n```', LANGUAGE_ID.markdown],
    ['~~~css\nbody{color:red;}\n~~~', LANGUAGE_ID.markdown],
    ['const config = { color: "red" };', LANGUAGE_ID.javascript],
    ['const view = <div>Hello</div>', LANGUAGE_ID.javascript],
    ['interface User { name: string }', LANGUAGE_ID.typescript],
    ['[package]\nname = "demo"', LANGUAGE_ID.toml],
    ['[[products]]\nname = "demo"', LANGUAGE_ID.toml],
    [
      '<script setup>\nconst value = 1\n</script>\n<template><div /></template>',
      LANGUAGE_ID.vue,
    ],
  ])('infers source syntax for %s', (source, expected) => {
    expect(inferLanguageFromEditorContext({ source })).toBe(expected)
  })

  it('uses explicit editor metadata before content heuristics', () => {
    expect(
      inferLanguageFromEditorContext({
        source: '{"looks":"json"}',
        hints: ['language-typescript'],
      }),
    ).toBe(LANGUAGE_ID.typescript)
  })

  it('detects language from URL-like file names', () => {
    expect(
      inferLanguageFromEditorContext({
        source: 'body{color:red}',
        url: 'https://github.com/example/repo/blob/main/src/app.scss',
      }),
    ).toBe(LANGUAGE_ID.scss)
  })

  it('uses content heuristics when no metadata is available', () => {
    expect(inferLanguageFromEditorContext({ source: '{"ok":true}' })).toBe(
      LANGUAGE_ID.json,
    )
    expect(
      inferLanguageFromEditorContext({ source: '# Title\n\n- item' }),
    ).toBe(LANGUAGE_ID.markdown)
  })

  it('falls back to the provided language for ambiguous snippets', () => {
    expect(
      inferLanguageFromEditorContext({
        source: 'hello world',
        fallbackLanguageId: LANGUAGE_ID.markdown,
      }),
    ).toBe(LANGUAGE_ID.markdown)
  })

  it('resolves prettier parser names from language metadata', () => {
    expect(resolveLanguageParser(LANGUAGE_ID.javascript)).toBe('babel')
    expect(resolveLanguageParser(LANGUAGE_ID.typescript)).toBe('typescript')
  })
})
