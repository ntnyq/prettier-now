/**
 * @file Hidden extension page used to run Prettier outside content scripts
 */

import { FOCUSED_EDITOR_MESSAGE } from '@/constants/focusedEditor'
import { LANGUAGE_ID } from '@/constants/language'
import { formatViaPrettier } from '@/utils/format'
import { readStoredFormatOptions } from '@/utils/formatOptions'
import {
  inferLanguageFromEditorContext,
  resolveLanguageParser,
} from '@/utils/languageInference'
import type {
  FocusedEditorFormatterRequest,
  FocusedEditorFormatterResponse,
} from '@/types/focusedEditor'

function isFormatterRequest(
  value: unknown,
): value is FocusedEditorFormatterRequest {
  return (
    typeof value === 'object'
    && value !== null
    && (value as FocusedEditorFormatterRequest).type
      === FOCUSED_EDITOR_MESSAGE.formatterFormatRequest
    && typeof (value as FocusedEditorFormatterRequest).requestId === 'string'
    && typeof (value as FocusedEditorFormatterRequest).source === 'string'
  )
}

function postFormatterResponse(
  source: MessageEventSource | null,
  targetOrigin: string,
  response: FocusedEditorFormatterResponse,
) {
  if (!source || !('postMessage' in source) || source instanceof MessagePort) {
    return
  }

  source.postMessage(response, {
    targetOrigin: targetOrigin === 'null' ? '*' : targetOrigin,
  })
}

window.addEventListener('message', async evt => {
  if (!isFormatterRequest(evt.data)) {
    return
  }

  const request = evt.data

  try {
    const languageId = inferLanguageFromEditorContext({
      fallbackLanguageId: request.fallbackLanguageId || LANGUAGE_ID.markdown,
      hints: request.hints,
      source: request.source,
      url: request.url,
    })
    const parser = resolveLanguageParser(languageId)
    const options = await readStoredFormatOptions(languageId, parser)
    const formatted = await formatViaPrettier(request.source, options)

    postFormatterResponse(evt.source, evt.origin, {
      formatted,
      languageId,
      ok: true,
      requestId: request.requestId,
      type: FOCUSED_EDITOR_MESSAGE.formatterFormatResponse,
    })
  } catch (err: unknown) {
    postFormatterResponse(evt.source, evt.origin, {
      errorMessage: (err as Error)?.message || 'Failed to format editor',
      ok: false,
      requestId: request.requestId,
      type: FOCUSED_EDITOR_MESSAGE.formatterFormatResponse,
    })
  }
})
