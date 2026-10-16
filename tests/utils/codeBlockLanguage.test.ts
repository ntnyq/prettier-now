import { describe, expect, it } from 'vitest'
import { inferExtractedCodeLanguage } from '@/utils/codeBlocks/language'

function infer(html: string) {
  document.body.innerHTML = html
  return inferExtractedCodeLanguage(document.querySelector('code')!)
}

describe('extraction language evidence', () => {
  it.each([
    ['js', 'javascript'],
    ['jsx', 'javascript'],
    ['tsx', 'typescript'],
    ['ts', 'typescript'],
    ['yml', 'yaml'],
    ['vue', 'vue'],
  ])('maps exact %s evidence', (label, languageId) => {
    expect(
      infer(`<pre><code class="language-${label}">x</code></pre>`),
    ).toMatchObject({
      status: 'supported',
      languageId,
      rawLabel: label,
      requiresConfirmation: false,
    })
  })
  it.each(['bash', 'sh', 'python', 'sql'])(
    'never falls back from %s to content inference',
    label => {
      expect(
        infer(`<pre><code data-language="${label}">{"a":1}</code></pre>`),
      ).toEqual({
        status: 'unsupported',
        evidence: 'attribute',
        rawLabel: label,
        requiresConfirmation: true,
      })
    },
  )
  it.each(['text', 'plaintext', 'sass', 'mdx', 'jsonc'])(
    'requires confirmation for %s',
    label => {
      expect(
        infer(`<pre><code class="language-${label}">x</code></pre>`),
      ).toMatchObject({ status: 'unknown', requiresConfirmation: true })
    },
  )
  it('does not use the document URL or unrelated wrappers', () => {
    expect(
      infer(
        '<article class="language-html"><pre><code>const a=1</code></pre><pre>x</pre></article>',
      ),
    ).toEqual({
      status: 'unknown',
      evidence: 'none',
      requiresConfirmation: true,
    })
  })
  it('requires confirmation for conflicting explicit metadata', () => {
    expect(
      infer(
        '<pre class="language-js"><code data-language="python">const a=1</code></pre>',
      ),
    ).toMatchObject({ status: 'unknown', requiresConfirmation: true })
  })
})
