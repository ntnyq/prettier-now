import { readFileSync } from 'node:fs'
import process from 'node:process'
import { beforeEach, describe, expect, it } from 'vitest'
import { CODE_BLOCK_MAX_BYTES } from '@/constants/codeBlocks'
import { extractCodeBlock } from '@/utils/codeBlocks/extract'

const fixture = readFileSync(
  `${process.cwd()}/tests/fixtures/codeBlocks/standard.html`,
  'utf8',
)

describe('code block text fidelity', () => {
  beforeEach(() => {
    document.body.innerHTML = fixture
  })

  it.each([
    ['plain', '\tconst text = "&lt;";  \n\nconst nbsp = "a\u{A0}b";\n'],
    ['prism', 'const answer=42;\n+1'],
    ['shiki', 'const a=1\n\nconst b=2'],
    ['shiki-newlines', 'a\n\nb\n'],
    ['highlight', '{"a":1}'],
    ['shell', '$ echo 1\n> output\n-real\n+real'],
    ['unknown', 'unlabeled text'],
  ])('preserves every character in %s', (id, expected) => {
    const element = document.querySelector(`#${id}`)!
    const before = element.innerHTML
    const result = extractCodeBlock(element)
    expect(result.ok && result.item.sourceCode).toBe(expected)
    expect(element.innerHTML).toBe(before)
  })

  it('rejects oversize Unicode text without a partial snapshot', () => {
    const pre = document.createElement('pre')
    document.body.append(pre)
    pre.textContent = '你'.repeat(Math.ceil(CODE_BLOCK_MAX_BYTES / 3))
    expect(extractCodeBlock(pre)).toEqual({
      ok: false,
      error: 'BLOCK_TOO_LARGE',
    })
    pre.textContent = 'a'.repeat(CODE_BLOCK_MAX_BYTES)
    expect(extractCodeBlock(pre).ok).toBe(true)
  })

  it('rejects empty, editor, hidden and unverified line layouts', () => {
    for (const html of [
      '<pre> \n\t</pre>',
      '<div contenteditable><pre>code</pre></div>',
      '<div style="display:none"><pre>code</pre></div>',
      '<pre><div>a</div><div>b</div></pre>',
    ]) {
      document.body.innerHTML = html
      expect(extractCodeBlock(document.querySelector('pre')!).ok).toBe(false)
    }
  })
})
