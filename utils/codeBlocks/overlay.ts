import { i18n } from '#i18n'
import { CODE_BLOCK_MAX_BUTTONS } from '@/constants/codeBlocks'
import { isCodeBlockVisible } from './extract'
import type { createCodeBlockController } from './controller'

/**
 * Mount bounded native controls inside one WXT shadow root, without changing code DOM.
 */
export function mountCodeBlockOverlay(
  container: HTMLElement,
  controller: ReturnType<typeof createCodeBlockController>,
  submit: (blockId: string) => Promise<string>,
) {
  container.style.pointerEvents = 'none'
  const buttons = new Map<string, HTMLButtonElement>()
  const visible = new Set<Element>()
  const observed = new Set<Element>()
  let frame = 0
  const live = document.createElement('p')
  live.className = 'pn-status'
  live.setAttribute('aria-live', 'polite')
  container.append(live)

  /**
   * Merge layout reads and writes into a single animation frame.
   */
  function schedule() {
    if (!frame) {
      frame = requestAnimationFrame(render)
    }
  }

  const resize = new ResizeObserver(schedule)
  const intersection = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        visible.add(entry.target)
      } else {
        visible.delete(entry.target)
      }
    }
    schedule()
  })

  /**
   * Position controls above the block's left edge, away from common copy controls.
   */
  function render() {
    frame = 0
    const active = new Set<string>()
    for (const [id, element] of controller.candidates) {
      if (active.size >= CODE_BLOCK_MAX_BUTTONS) {
        break
      }
      if (!visible.has(element) || !isCodeBlockVisible(element)) {
        continue
      }
      const rect = element.getBoundingClientRect()
      if (
        rect.bottom <= 0
        || rect.top >= innerHeight
        || rect.right <= 0
        || rect.left >= innerWidth
      ) {
        continue
      }
      active.add(id)
      let button = buttons.get(id)
      if (!button) {
        button = document.createElement('button')
        button.type = 'button'
        button.className = 'pn-send'
        button.textContent = 'Prettier Now'
        button.setAttribute('aria-label', i18n.t('codeBlocksSend'))
        button.title = i18n.t('codeBlocksSend')
        for (const event of ['mouseenter', 'focus']) {
          button.addEventListener(event, () => {
            if (button && !button.disabled) {
              button.textContent = i18n.t('codeBlocksSend')
            }
          })
        }
        for (const event of ['mouseleave', 'blur']) {
          button.addEventListener(event, () => {
            if (button && !button.disabled) {
              button.textContent = 'Prettier Now'
            }
          })
        }
        button.addEventListener('click', async event => {
          if (!event.isTrusted || !button) {
            return
          }
          button.disabled = true
          button.textContent = i18n.t('codeBlocksSending')
          const message = await submit(id)
          live.textContent = message
          live.style.left = `${Math.max(8, Math.min(rect.left, innerWidth - 320))}px`
          live.style.top = `${Math.min(innerHeight - 80, Math.max(8, rect.top))}px`
          button.textContent = 'Prettier Now'
          button.disabled = false
        })
        buttons.set(id, button)
        resize.observe(element)
        container.append(button)
      }
      button.style.left = `${Math.max(4, Math.min(rect.left + 4, innerWidth - 140))}px`
      button.style.top = `${Math.max(0, rect.top - 28)}px`
    }
    for (const [id, button] of buttons) {
      if (!active.has(id)) {
        button.remove()
        buttons.delete(id)
        const element = controller.candidates.get(id)
        if (element) {
          resize.unobserve(element)
        }
      }
    }
  }

  /**
   * Observe new candidates and release detached nodes after each discovery pass.
   */
  function sync() {
    const current = new Set(controller.candidates.values())
    for (const element of observed) {
      if (!current.has(element)) {
        intersection.unobserve(element)
        resize.unobserve(element)
        observed.delete(element)
        visible.delete(element)
      }
    }
    for (const element of current) {
      if (!observed.has(element)) {
        observed.add(element)
        intersection.observe(element)
      }
    }
    schedule()
  }

  window.addEventListener('scroll', schedule, true)
  window.addEventListener('resize', schedule)
  sync()

  /**
   * Release all observers, handlers, elements, and scheduled layout work.
   */
  function dispose() {
    intersection.disconnect()
    resize.disconnect()
    window.removeEventListener('scroll', schedule, true)
    window.removeEventListener('resize', schedule)
    cancelAnimationFrame(frame)
    buttons.clear()
    visible.clear()
    observed.clear()
    container.replaceChildren()
  }

  return { sync, dispose }
}
