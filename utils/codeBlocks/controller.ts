import { CODE_BLOCK_MAX_CANDIDATES } from '@/constants/codeBlocks'
import { extractCodeBlock, isCodeBlockVisible } from './extract'
import type { CodeBlockSummary } from './protocol'

/**
 * Own page-local identities and cancellable, time-sliced scans.
 * No observers are installed until automatic buttons are enabled.
 */
export function createCodeBlockController(onChange: () => void = () => {}) {
  let revision = crypto.randomUUID() as string
  let identities = new WeakMap<Element, string>()
  const candidates = new Map<string, Element>()
  let generation = 0
  let disposed = false
  let scanning: Promise<ReturnType<typeof snapshot>> | undefined
  let observer: MutationObserver | undefined
  let scheduled: ReturnType<typeof setTimeout> | undefined
  let limited = false
  const summaries = new Map<string, CodeBlockSummary>()
  const dirtyRoots = new Set<Element>()

  /**
   * Return summaries only; selected nodes are re-read at submit time.
   */
  function snapshot() {
    return {
      documentRevision: revision,
      summaries: [] as CodeBlockSummary[],
      limited,
    }
  }

  /**
   * Scan using a DOM walker, yielding instead of allocating a full-page NodeList.
   */
  async function scan(roots?: Element[]) {
    if (scanning) {
      await scanning.catch(() => {})
      return scan(roots)
    }
    const currentGeneration = generation
    scanning = (async () => {
      const result = snapshot()
      const nextCandidates = new Map<string, Element>()
      const nextSummaries = new Map<string, CodeBlockSummary>()
      if (roots) {
        for (const [id, element] of candidates) {
          if (
            isCodeBlockVisible(element)
            && !roots.some(root => root.contains(element))
          ) {
            nextCandidates.set(id, element)
            const summary = summaries.get(id)
            if (summary) {
              nextSummaries.set(id, summary)
            }
          }
        }
      }
      let started = performance.now()
      if (!roots) {
        limited = false
      }
      for (const root of roots ?? [document.body ?? document.documentElement]) {
        if (!root.isConnected) {
          continue
        }
        const walker = document.createTreeWalker(
          root,
          NodeFilter.SHOW_ELEMENT,
          {
            /**
             * Skip editors and extension UI without visiting their descendants.
             */
            acceptNode(node) {
              if (!(node instanceof Element)) {
                return NodeFilter.FILTER_SKIP
              }
              return node.matches(
                'prettier-now-code-blocks, .cm-editor, .CodeMirror, .ace_editor, .monaco-editor, [contenteditable]:not([contenteditable="false"])',
              )
                ? NodeFilter.FILTER_REJECT
                : NodeFilter.FILTER_ACCEPT
            },
          },
        )
        let node: Node | null = root
        while (node) {
          if (disposed || generation !== currentGeneration) {
            break
          }
          if (
            node instanceof Element
            && node.matches('pre')
            && !node.parentElement?.closest('pre')
            && isCodeBlockVisible(node)
          ) {
            const extracted = extractCodeBlock(node, nextCandidates.size + 1)
            if (extracted.ok || extracted.error !== 'EMPTY_BLOCK') {
              if (nextCandidates.size === CODE_BLOCK_MAX_CANDIDATES) {
                limited = true
                break
              }
              const id = identities.get(node) ?? crypto.randomUUID()
              identities.set(node, id)
              nextCandidates.set(id, node)
              nextSummaries.set(id, {
                blockId: id,
                blockIndex: nextCandidates.size,
                language: extracted.ok
                  ? extracted.item.language
                  : {
                      status: 'unknown',
                      evidence: 'none',
                      requiresConfirmation: true,
                    },
                preview: extracted.ok
                  ? extracted.item.sourceCode
                      .split('\n', 2)
                      .join('\n')
                      .slice(0, 160)
                  : '',
                lineCount: extracted.ok
                  ? extracted.item.sourceCode.split('\n').length
                  : 0,
                byteLength: extracted.ok
                  ? new TextEncoder().encode(extracted.item.sourceCode)
                      .byteLength
                  : 0,
                ...(extracted.ok ? {} : { error: extracted.error }),
              })
            }
          }
          if (node instanceof Element && node.matches('pre')) {
            // No need to traverse highlighted tokens after reading this block once.
            let next = walker.nextSibling()
            while (
              !next
              && walker.parentNode()
              && walker.currentNode !== root
            ) {
              next = walker.nextSibling()
            }
            node = next
          } else {
            node = walker.nextNode()
          }
          if (performance.now() - started > 6) {
            await new Promise(resolve => setTimeout(resolve, 0))
            started = performance.now()
          }
        }
      }
      if (disposed || generation !== currentGeneration) {
        throw new Error('BLOCK_STALE')
      }
      candidates.clear()
      summaries.clear()
      const ordered = [...nextCandidates].sort(([, left], [, right]) =>
        left.compareDocumentPosition(right) & Node.DOCUMENT_POSITION_FOLLOWING
          ? -1
          : 1,
      )
      for (const [id, element] of ordered) {
        candidates.set(id, element)
        const summary = nextSummaries.get(id)
        if (summary) {
          summary.blockIndex = candidates.size
          summaries.set(id, summary)
          result.summaries.push(summary)
        }
      }
      result.limited = limited
      onChange()
      return result
    })().finally(() => {
      scanning = undefined
    })
    return scanning
  }

  /**
   * Capture the chosen live node only when the document identity still matches.
   */
  function extract(blockId: string, documentRevision: string) {
    const element = candidates.get(blockId)
    if (disposed || documentRevision !== revision || !element?.isConnected) {
      return { ok: false as const, error: 'BLOCK_STALE' as const }
    }
    return extractCodeBlock(
      element,
      [...candidates.keys()].indexOf(blockId) + 1,
    )
  }

  /**
   * Coalesce structural mutations; text updates are captured on demand.
   */
  function scheduleScan() {
    if (scheduled || disposed) {
      return
    }
    scheduled = setTimeout(() => {
      scheduled = undefined
      const roots = [...dirtyRoots]
      dirtyRoots.clear()
      scan(roots).catch(() => {
        /* Navigation invalidates a scheduled scan. */
      })
    }, 100)
  }

  /**
   * Stop automatic observation and release page references.
   */
  function stop() {
    observer?.disconnect()
    observer = undefined
    clearTimeout(scheduled)
    scheduled = undefined
    generation += 1
    candidates.clear()
    summaries.clear()
    dirtyRoots.clear()
  }

  /**
   * Enable automatic structural discovery, excluding the extension host.
   */
  function start() {
    if (observer || disposed) {
      return
    }
    observer = new MutationObserver(records => {
      for (const record of records) {
        let target =
          record.target instanceof Element
            ? record.target
            : record.target.parentElement
        if (!target || target.closest('prettier-now-code-blocks')) {
          continue
        }
        if (record.type === 'childList') {
          const changed = [...record.addedNodes, ...record.removedNodes].filter(
            (node): node is Element =>
              node instanceof Element
              && !node.matches('prettier-now-code-blocks'),
          )
          if (!changed.length) {
            continue
          }
          if (
            target.closest('pre')
            && !changed.some(
              node => node.matches('pre') || node.querySelector('pre'),
            )
          ) {
            continue
          }
        }
        target = target.closest('pre') ?? target
        if (![...dirtyRoots].some(root => root.contains(target))) {
          for (const root of dirtyRoots) {
            if (target.contains(root)) {
              dirtyRoots.delete(root)
            }
          }
          dirtyRoots.add(target)
        }
      }
      if (dirtyRoots.size) {
        scheduleScan()
      }
    })
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        'hidden',
        'class',
        'style',
        'data-lang',
        'data-language',
      ],
    })
    dirtyRoots.add(document.body ?? document.documentElement)
    scheduleScan()
  }

  /**
   * Invalidate old popup scans and node references on SPA navigation.
   */
  function navigate() {
    revision = crypto.randomUUID()
    generation += 1
    identities = new WeakMap()
    candidates.clear()
    summaries.clear()
    dirtyRoots.clear()
    onChange()
    if (observer) {
      dirtyRoots.add(document.body ?? document.documentElement)
      scheduleScan()
    }
  }

  /**
   * Permanently release observers and reject late scan results.
   */
  function dispose() {
    disposed = true
    stop()
  }

  return {
    scan,
    extract,
    candidates,
    start,
    stop,
    navigate,
    dispose,
    /**
     * Current page revision used to reject stale popup selections.
     */
    get revision() {
      return revision
    },
  }
}
