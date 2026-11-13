/**
 * @file Hidden extension page used to run Prettier outside content scripts
 */

import * as v from 'valibot'
import { FOCUSED_EDITOR_MESSAGE } from '@/constants/focusedEditor'
import { LANGUAGE_ID } from '@/constants/language'
import { FocusedEditorFormatterRequestSchema } from '@/utils/focusedEditorProtocol'
import { formatViaPrettier } from '@/utils/format'
import { readStoredFormatOptions } from '@/utils/formatOptions'
import { inferLanguageFromEditorContext } from '@/utils/languageInference'
import type { FocusedEditorFormatterResponse } from '@/types/focusedEditor'

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
  const parsed = v.safeParse(FocusedEditorFormatterRequestSchema, evt.data)
  if (!parsed.success) {
    return
  }

  const request = parsed.output

  try {
    const languageId = inferLanguageFromEditorContext({
      fallbackLanguageId: request.fallbackLanguageId || LANGUAGE_ID.markdown,
      hints: request.hints,
      source: request.source,
      url: request.url,
    })
    const options = await readStoredFormatOptions(languageId)
    const formatted = await formatViaPrettier(request.source, options)

    postFormatterResponse(evt.source, evt.origin, {
      formatted,
      languageId,
      ok: true,
      requestId: request.requestId,
      type: FOCUSED_EDITOR_MESSAGE.formatterFormatResponse,
    })
  } catch (error: unknown) {
    postFormatterResponse(evt.source, evt.origin, {
      errorMessage:
        error instanceof Error ? error.message : 'Failed to format editor',
      ok: false,
      requestId: request.requestId,
      type: FOCUSED_EDITOR_MESSAGE.formatterFormatResponse,
    })
  }
})
