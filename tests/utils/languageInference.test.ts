import { describe, expect, it } from 'vitest'
import { LANGUAGE_ID } from '@/constants/language'
import {
  inferLanguageFromEditorContext,
  resolveLanguageParser,
} from '@/utils/languageInference'

describe('editor language inference', () => {
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
