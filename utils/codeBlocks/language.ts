import { languageExtensions, languages } from '@/constants/language'
import type { ExtractedLanguage } from '@/types/codeBlocks'

/**
 * Resolve exact labels without the focused-editor fallback or semantic aliases.
 */
function resolveLabel(label: string) {
  const token = label.toLowerCase().trim()
  const alias =
    token === 'babel' || token === 'javascriptreact'
      ? 'javascript'
      : token === 'typescriptreact'
        ? 'typescript'
        : token
  return (
    languages.find(language => language.id === alias)?.id
    ?? Object.entries(languageExtensions).find(
      ([extension]) => extension === alias,
    )?.[1]
  )
}

/**
 * Infer from explicit DOM evidence; conflicts always require confirmation.
 * Page URLs never participate in snippet language inference.
 */
export function inferExtractedCodeLanguage(
  element: Element,
): ExtractedLanguage {
  const hints: {
    /**
     * Exact label supplied by the code block.
     */
    label: string
    /**
     * Metadata channel providing this label.
     */
    evidence: ExtractedLanguage['evidence']
  }[] = []
  const pre = element.closest('pre')
  const wrapper = pre?.parentElement
  const elements = [element, pre]
  if (
    wrapper
    && wrapper.querySelectorAll('pre').length === 1
    && wrapper.matches(
      '[class*="language-"], [data-language], [data-lang], .code-block, .highlight',
    )
  ) {
    elements.push(wrapper)
  }
  for (const node of new Set(elements)) {
    if (!node) {
      continue
    }
    for (const attribute of ['data-language', 'data-lang']) {
      const label = node.getAttribute(attribute)
      if (label) {
        hints.push({ label: label.slice(0, 80), evidence: 'attribute' })
      }
    }
    for (const className of node.classList) {
      const match = /^(?:language|lang)-(.+)$/.exec(className)
      if (match?.[1]) {
        hints.push({ label: match[1].slice(0, 80), evidence: 'class' })
      }
    }

    const filenameAttribute = 'data-filename'
    const filename = node.getAttribute(filenameAttribute)
    if (filename) {
      hints.push({
        label: filename.split('.').pop()!.slice(0, 80),
        evidence: 'filename',
      })
    }
  }
  const first = hints[0]
  if (!first) {
    return { status: 'unknown', evidence: 'none', requiresConfirmation: true }
  }
  const resolved = hints.map(
    hint => resolveLabel(hint.label) ?? hint.label.toLowerCase().trim(),
  )
  if (new Set(resolved).size > 1) {
    return {
      status: 'unknown',
      evidence: first.evidence,
      rawLabel: hints
        .map(hint => hint.label)
        .join(' / ')
        .slice(0, 80),
      requiresConfirmation: true,
    }
  }
  const languageId = resolveLabel(first.label)
  if (languageId) {
    return {
      status: 'supported',
      languageId,
      rawLabel: first.label,
      evidence: first.evidence,
      requiresConfirmation: false,
    }
  }
  return {
    status: /^(?:text|plaintext|plain|none|sass|mdx|jsonc)$/i.test(first.label)
      ? 'unknown'
      : 'unsupported',
    rawLabel: first.label,
    evidence: first.evidence,
    requiresConfirmation: true,
  }
}
