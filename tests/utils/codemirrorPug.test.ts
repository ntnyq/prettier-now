import { syntaxTree } from '@codemirror/language'
import { EditorState } from '@codemirror/state'
import { classHighlighter, highlightTree } from '@lezer/highlight'
import { describe, expect, it } from 'vitest'
import { loadCodemirrorLanguage } from '@/utils/codemirrorLanguages'

describe('codemirror pug language', () => {
  it('highlights legacy Pug tokens with supported tags', async () => {
    const language = await loadCodemirrorLanguage('pug')
    const state = EditorState.create({
      doc: 'main.app: p Hello\n  .child\n',
      extensions: language ? [language] : [],
    })
    const classes: string[] = []
    highlightTree(syntaxTree(state), classHighlighter, (_from, _to, tokens) => {
      classes.push(tokens)
    })
    expect(classes).toContain('tok-punctuation')
    expect(classes).toContain('tok-meta')
  })
})
