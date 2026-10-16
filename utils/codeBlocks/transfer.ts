import * as v from 'valibot'
import { browser } from '#imports'
import {
  CODE_BLOCK_QUEUE_BYTES,
  CODE_BLOCK_QUEUE_REQUESTS,
  CODE_BLOCK_RECEIPT_TTL,
  CODE_BLOCK_TTL,
} from '@/constants/codeBlocks'
import {
  codeBlockFailure,
  CodeBlockMessageSchema,
  CodeBlockRequestSchema,
} from './protocol'
import { readCodeBlockSettings } from './settings'
import type { Browser } from 'wxt/browser'
import type {
  CodeBlockImportRequest,
  CodeBlockSource,
} from '@/types/codeBlocks'
import type { CodeBlockMessage } from './protocol'

const requestPrefix = 'code-blocks/request/'
const workspacePrefix = 'code-blocks/window/'
/**
 * Background-only workspace binding, reserved before tab creation.
 */
interface WorkspaceBinding {
  /**
   * Opaque workspace routing identity.
   */
  workspaceId: string
  /**
   * Owning source window.
   */
  windowId: number
  /**
   * Last created target tab, absent during creation.
   */
  tabId?: number
}
/**
 * Session record includes sender identity that is never returned to a receiver.
 */
interface StoredRequest extends CodeBlockImportRequest {
  /**
   * Browser-provided document identity, or a redacted fallback for older browsers.
   */
  senderDocument: string
  /**
   * Digest of the original snapshots, retained after ACK without their code bodies.
   */
  snapshotDigest: string
}

/**
 * Compare retries without retaining consumed source code or unredacted URLs.
 */
async function digest(value: string) {
  const bytes = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value),
  )
  return Array.from(new Uint8Array(bytes), byte =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
}

/**
 * Verify an exact own extension page without relying on URL.origin for custom schemes.
 */
export function isCodeBlockExtensionPage(
  value: string | undefined,
  page: 'options.html' | 'popup.html',
  workspaceId?: string,
) {
  if (!value) {
    return false
  }
  try {
    const actual = new URL(value)
    const expected = new URL(browser.runtime.getURL(`/${page}`))
    return (
      actual.protocol === expected.protocol
      && actual.host === expected.host
      && actual.pathname === expected.pathname
      && (workspaceId === undefined
        || actual.search === `?workspace=${workspaceId}`)
    )
  } catch {
    return false
  }
}

/**
 * Redact source URLs before the first storage write; local paths never enter the queue.
 */
function getSource(sender: Browser.runtime.MessageSender): CodeBlockSource {
  if (
    !sender.tab
    || sender.tab.id === undefined
    || sender.frameId !== 0
    || !sender.url
  ) {
    throw new Error('INVALID_MESSAGE')
  }
  const url = new URL(sender.url)
  if (!['http:', 'https:', 'file:'].includes(url.protocol)) {
    throw new Error('INVALID_MESSAGE')
  }
  let pageTitle = (sender.tab.title ?? url.hostname).slice(0, 300)
  let pageUrl = ''
  if (url.protocol === 'file:') {
    pageTitle = url.pathname.split('/').pop()?.slice(0, 300) ?? 'file'
  } else {
    url.username = ''
    url.password = ''
    url.search = ''
    url.hash = ''
    pageUrl = url.href
    if (pageUrl.length > 4096) {
      throw new Error('INVALID_MESSAGE')
    }
  }
  return {
    pageTitle,
    pageUrl,
    tabId: sender.tab.id,
    frameId: 0,
    sourceWindowId: sender.tab.windowId,
  }
}

/**
 * Sole session-inbox writer. Serializes short transactions and survives worker restarts.
 */
export function createCodeBlockTransfer() {
  let transaction = Promise.resolve<unknown>(undefined)

  /**
   * Read and lazily expire session entries on every access.
   */
  async function load() {
    if (!browser.storage.session) {
      throw new Error('STORAGE_UNAVAILABLE')
    }
    const values = await browser.storage.session.get(null)
    const requests: StoredRequest[] = []
    const bindings: WorkspaceBinding[] = []
    const expired: string[] = []
    for (const [key, value] of Object.entries(values)) {
      if (key.startsWith(requestPrefix)) {
        const parsed = v.safeParse(CodeBlockRequestSchema, value)
        if (!parsed.success) {
          expired.push(key)
          continue
        }
        const record = value as StoredRequest
        const deadline = record.items.length
          ? record.expiresAt
          : record.expiresAt + CODE_BLOCK_RECEIPT_TTL
        if (deadline <= Date.now()) {
          expired.push(key)
        } else {
          requests.push(record)
        }
      } else if (key.startsWith(workspacePrefix)) {
        bindings.push(value as WorkspaceBinding)
      }
    }
    if (expired.length) {
      await browser.storage.session.remove(expired)
    }
    return { requests, bindings }
  }

  /**
   * Validate a live binding before activating or accepting reads and ACKs.
   */
  async function getBoundTab(
    binding: WorkspaceBinding,
    verifyReceiver = false,
  ) {
    if (binding.tabId === undefined) {
      return undefined
    }
    try {
      const tab = await browser.tabs.get(binding.tabId)
      if (
        tab.incognito
        || tab.windowId !== binding.windowId
        || (tab.url
          && !isCodeBlockExtensionPage(
            tab.url,
            'options.html',
            binding.workspaceId,
          ))
      ) {
        return undefined
      }
      if (verifyReceiver) {
        const nonce = crypto.randomUUID()
        let cancelTimeout = () => {}
        try {
          const response = await Promise.race([
            browser.runtime.sendMessage({
              type: 'code-blocks/ping',
              version: 1,
              workspaceId: binding.workspaceId,
              tabId: binding.tabId,
              nonce,
            }),
            new Promise<undefined>(resolve => {
              const timeout = setTimeout(() => resolve(undefined), 1500)
              cancelTimeout = () => clearTimeout(timeout)
            }),
          ])
          if (response?.nonce !== nonce) {
            return undefined
          }
        } finally {
          cancelTimeout()
        }
      }
      return tab
    } catch {
      return undefined
    }
  }

  /**
   * Open only a dedicated workspace; never redirect arbitrary existing tabs.
   */
  async function openWorkspace(binding: WorkspaceBinding) {
    const existing = await getBoundTab(binding, true)
    if (existing?.id === undefined) {
      // Recover a tab created immediately before a worker stopped recording its id.
      const tabs = await browser.tabs.query({ windowId: binding.windowId })
      const recovered = tabs.find(
        tab =>
          !tab.incognito
          && isCodeBlockExtensionPage(
            tab.url,
            'options.html',
            binding.workspaceId,
          ),
      )
      const tab =
        recovered
        ?? (await browser.tabs.create({
          windowId: binding.windowId,
          url: browser.runtime.getURL(
            `/options.html?workspace=${binding.workspaceId}#/`,
          ),
          active: true,
        }))
      if (tab.id === undefined) {
        throw new Error('WORKSPACE_OPEN_FAILED')
      }
      binding.tabId = tab.id
      await browser.storage.session.set({
        [`${workspacePrefix}${binding.windowId}`]: binding,
      })
      if (recovered) {
        await browser.tabs.update(tab.id, { active: true })
      }
    } else {
      await browser.tabs.update(existing.id, { active: true })
    }
    await browser.windows.update(binding.windowId, { focused: true })
  }

  /**
   * Validate browser-provided page sender and current top-level document.
   */
  async function validatePage(sender: Browser.runtime.MessageSender) {
    const source = getSource(sender)
    const tab = await browser.tabs.get(source.tabId)
    if (sender.tab?.incognito || tab.incognito) {
      throw new Error('PRIVATE_WINDOW_UNSUPPORTED')
    }
    if (
      tab.windowId !== source.sourceWindowId
      || (tab.url && tab.url !== sender.url)
    ) {
      throw new Error('BLOCK_STALE')
    }
    return source
  }

  /**
   * Dispatch one validated transaction, keeping snapshots until explicit ACK.
   */
  async function dispatch(
    message: CodeBlockMessage,
    sender: Browser.runtime.MessageSender,
  ) {
    if (sender.id !== browser.runtime.id) {
      throw new Error('INVALID_MESSAGE')
    }
    const { requests, bindings } = await load()
    if (
      message.type === 'code-blocks/enqueue'
      || message.type === 'code-blocks/status'
    ) {
      const source = await validatePage(sender)
      const senderDocument =
        sender.documentId ?? `${source.tabId}:${await digest(sender.url!)}`
      let record = requests.find(
        request => request.requestId === message.requestId,
      )
      if (
        record
        && (record.source.tabId !== source.tabId
          || record.senderDocument !== senderDocument)
      ) {
        throw new Error('INVALID_MESSAGE')
      }
      if (message.type === 'code-blocks/status') {
        if (!record) {
          throw new Error('REQUEST_EXPIRED')
        }
        return {
          ok: true,
          queued: !!record.items.length,
          receipts: record.receipts,
        }
      }
      const snapshotDigest = await digest(JSON.stringify(message.items))
      if (record && record.snapshotDigest !== snapshotDigest) {
        throw new Error('INVALID_MESSAGE')
      }
      if (message.mode === 'button') {
        const settings = await readCodeBlockSettings()
        if (
          !settings.codeBlockButtons
          || settings.codeBlockHiddenHosts.includes(
            new URL(sender.url!).hostname,
          )
        ) {
          throw new Error('PAGE_UNAVAILABLE')
        }
      }
      let binding = record
        ? bindings.find(item => item.workspaceId === record?.workspaceId)
        : bindings.find(item => item.windowId === source.sourceWindowId)
      if (!binding) {
        binding = {
          workspaceId: crypto.randomUUID(),
          windowId: source.sourceWindowId,
        }
      }
      if (!record) {
        if (
          message.items.some(
            item =>
              Date.now() - item.capturedAt >= CODE_BLOCK_TTL
              || item.capturedAt > Date.now() + 60000,
          )
        ) {
          throw new Error('REQUEST_EXPIRED')
        }
        if (
          requests.filter(request => request.items.length).length
          >= CODE_BLOCK_QUEUE_REQUESTS
        ) {
          throw new Error('QUEUE_FULL')
        }
        record = {
          version: 1,
          requestId: message.requestId,
          workspaceId: binding.workspaceId,
          source,
          senderDocument,
          snapshotDigest,
          items: message.items,
          createdAt: Date.now(),
          expiresAt: Date.now() + CODE_BLOCK_TTL,
          receipts: {},
        }
        const size = new TextEncoder().encode(
          JSON.stringify([...requests, record]),
        ).byteLength
        if (size > CODE_BLOCK_QUEUE_BYTES) {
          throw new Error('QUEUE_FULL')
        }
        // Persist request and reservation before creating the receiving page.
        await browser.storage.session.set({
          [`${requestPrefix}${record.requestId}`]: record,
          [`${workspacePrefix}${binding.windowId}`]: binding,
        })
      }
      if (!record.items.length) {
        return { ok: true, queued: false, receipts: record.receipts }
      }
      try {
        await openWorkspace(binding)
      } catch {
        return {
          ok: true,
          queued: true,
          error: 'WORKSPACE_OPEN_FAILED' as const,
          receipts: record.receipts,
        }
      }
      browser.runtime
        .sendMessage({
          type: 'code-blocks/available',
          version: 1,
          workspaceId: binding.workspaceId,
          requestId: record.requestId,
        })
        .catch(() => {
          /* Startup pull also discovers the durable inbox. */
        })
      return { ok: true, queued: true, receipts: record.receipts }
    }
    if (
      !('tabId' in message)
      || !isCodeBlockExtensionPage(
        sender.url,
        'options.html',
        message.workspaceId,
      )
    ) {
      throw new Error('INVALID_MESSAGE')
    }
    const binding = bindings.find(
      item => item.workspaceId === message.workspaceId,
    )
    if (
      !binding
      || (sender.tab?.id !== undefined && sender.tab.id !== message.tabId)
    ) {
      throw new Error('INVALID_MESSAGE')
    }
    if (
      message.type === 'code-blocks/register'
      && binding.tabId === undefined
    ) {
      const tab = await browser.tabs.get(message.tabId)
      if (
        tab.windowId !== binding.windowId
        || tab.incognito
        || (tab.url
          && !isCodeBlockExtensionPage(
            tab.url,
            'options.html',
            binding.workspaceId,
          ))
      ) {
        throw new Error('INVALID_MESSAGE')
      }
      binding.tabId = message.tabId
      await browser.storage.session.set({
        [`${workspacePrefix}${binding.windowId}`]: binding,
      })
    }
    if (binding.tabId !== message.tabId || !(await getBoundTab(binding))) {
      throw new Error('INVALID_MESSAGE')
    }
    if (
      message.type === 'code-blocks/register'
      || message.type === 'code-blocks/list'
    ) {
      return {
        ok: true,
        requestIds: requests
          .filter(
            request =>
              request.workspaceId === binding.workspaceId
              && request.items.length,
          )
          .map(request => request.requestId),
      }
    }
    if (!('requestId' in message)) {
      throw new Error('INVALID_MESSAGE')
    }
    const record = requests.find(
      request =>
        request.requestId === message.requestId
        && request.workspaceId === binding.workspaceId,
    )
    if (!record) {
      throw new Error('REQUEST_EXPIRED')
    }
    if (message.type === 'code-blocks/read') {
      return { ok: true, request: v.parse(CodeBlockRequestSchema, record) }
    }
    if (message.type !== 'code-blocks/ack') {
      throw new Error('INVALID_MESSAGE')
    }
    if (
      message.results.some(
        result =>
          !record.items.some(item => item.id === result.itemId)
          && !record.receipts[result.itemId],
      )
    ) {
      throw new Error('INVALID_MESSAGE')
    }
    for (const result of message.results) {
      if (
        record.receipts[result.itemId]
        && record.receipts[result.itemId] !== result.status
      ) {
        throw new Error('INVALID_MESSAGE')
      }
      record.receipts[result.itemId] = result.status
      record.items = record.items.filter(item => item.id !== result.itemId)
    }
    if (!record.items.length) {
      record.expiresAt = Date.now()
    }
    await browser.storage.session.set({
      [`${requestPrefix}${record.requestId}`]: record,
    })
    return { ok: true }
  }

  /**
   * Queue writes even after a previous transaction failed.
   */
  function handle(input: unknown, sender: Browser.runtime.MessageSender) {
    const run = transaction
      .then(async () => {
        const parsed = v.safeParse(CodeBlockMessageSchema, input)
        if (!parsed.success) {
          throw new Error('INVALID_MESSAGE')
        }
        return dispatch(parsed.output, sender)
      })
      .catch(codeBlockFailure)
    transaction = run
    return run
  }

  return { handle }
}

/**
 * Register a callback listener that leaves unrelated messages untouched.
 */
export function registerCodeBlockTransfer() {
  const transfer = createCodeBlockTransfer()
  browser.runtime.onMessage.addListener(
    (message: unknown, sender, sendResponse) => {
      if (
        !message
        || typeof message !== 'object'
        || !('type' in message)
        || typeof message.type !== 'string'
        || !['enqueue', 'register', 'list', 'read', 'ack', 'status'].some(
          action => message.type === `code-blocks/${action}`,
        )
      ) {
        return undefined
      }
      transfer.handle(message, sender).then(sendResponse)
      return true
    },
  )
}
