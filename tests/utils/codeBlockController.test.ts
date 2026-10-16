import { afterEach, describe, expect, it, vi } from 'vitest'
import { createCodeBlockController } from '@/utils/codeBlocks/controller'

const controllers: ReturnType<typeof createCodeBlockController>[] = []
function controller() {
  const instance = createCodeBlockController()
  controllers.push(instance)
  return instance
}
afterEach(() => {
  controllers.splice(0).forEach(instance => instance.dispose())
  document.body.innerHTML = ''
})

describe('code block discovery', () => {
  it('retains identical blocks separately and excludes hidden/editable/inline code', async () => {
    document.body.innerHTML =
      '<pre>a</pre><pre>a</pre><pre hidden>b</pre><code>inline</code><div class="cm-editor"><pre>editor</pre></div>'
    const result = await controller().scan()
    expect(result.summaries).toHaveLength(2)
    expect(result.summaries[0]?.blockId).not.toBe(result.summaries[1]?.blockId)
    expect(JSON.stringify(result)).not.toContain('sourceCode')
  })
  it('keeps ids stable while reading a fresh text snapshot and invalidates replaced nodes', async () => {
    document.body.innerHTML = '<pre>before</pre>'
    const instance = controller()
    const scan = await instance.scan()
    const id = scan.summaries[0]!.blockId
    document.querySelector('pre')!.textContent = 'after'
    expect(instance.extract(id, scan.documentRevision)).toMatchObject({
      ok: true,
      item: { sourceCode: 'after' },
    })
    expect((await instance.scan()).summaries[0]?.blockId).toBe(id)
    document.body.innerHTML = '<pre>replacement</pre>'
    expect(instance.extract(id, scan.documentRevision)).toEqual({
      ok: false,
      error: 'BLOCK_STALE',
    })
  })
  it('invalidates popup results on navigation and disposal', async () => {
    document.body.innerHTML = '<pre>a</pre>'
    const instance = controller()
    const scan = await instance.scan()
    instance.navigate()
    expect(
      instance.extract(scan.summaries[0]!.blockId, scan.documentRevision),
    ).toMatchObject({ ok: false })
    const next = await instance.scan()
    expect(next.documentRevision).not.toBe(scan.documentRevision)
    instance.dispose()
    expect(instance.candidates.size).toBe(0)
    await expect(instance.scan()).rejects.toThrow('BLOCK_STALE')
  })
  it('caps candidate registration and reports the limit', async () => {
    document.body.innerHTML = '<pre>x</pre>'.repeat(201)
    const result = await controller().scan()
    expect(result.summaries).toHaveLength(200)
    expect(result.limited).toBe(true)
  })

  it('observes appended and hidden blocks, then stops observation when disabled', async () => {
    document.body.innerHTML = '<section><pre>first</pre></section>'
    const instance = controller()
    instance.start()
    await vi.waitFor(() => expect(instance.candidates.size).toBe(1))
    const firstId = [...instance.candidates.keys()][0]
    document
      .querySelector('section')!
      .insertAdjacentHTML('beforeend', '<pre>second</pre>')
    await vi.waitFor(() => expect(instance.candidates.size).toBe(2))
    expect([...instance.candidates.keys()][0]).toBe(firstId)
    document.querySelector('pre')!.hidden = true
    await vi.waitFor(() => expect(instance.candidates.size).toBe(1))
    expect(instance.candidates.has(firstId!)).toBe(false)
    instance.stop()
    document.body.insertAdjacentHTML('beforeend', '<pre>third</pre>')
    await new Promise(resolve => setTimeout(resolve, 200))
    expect(instance.candidates.size).toBe(0)
    expect((await instance.scan()).summaries).toHaveLength(2)
  })
})
