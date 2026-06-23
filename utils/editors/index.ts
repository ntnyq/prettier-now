/**
 * @file Editor adapters
 */

import { AceEditor } from '@/utils/editors/ace'
import { CodeMirrorEditor } from '@/utils/editors/codeMirror'
import { ContentEditableEditor } from '@/utils/editors/contentEditable'
import { TextareaEditor } from '@/utils/editors/textarea'

/**
 * Create a markdown editor adapter for a supported editor element.
 *
 * @param element - Element to inspect.
 * @returns Editor adapter when the element is supported.
 */
export function createMarkdownEditor(element: HTMLElement) {
  if (CodeMirrorEditor.validate(element)) {
    return new CodeMirrorEditor(element)
  }

  if (AceEditor.validate(element)) {
    return new AceEditor(element)
  }

  if (TextareaEditor.validate(element)) {
    return new TextareaEditor(element as HTMLTextAreaElement)
  }

  if (ContentEditableEditor.validate(element)) {
    return new ContentEditableEditor(element)
  }

  return null
}

export { AceEditor } from './ace'
export { TextareaEditor } from './textarea'
export { CodeMirrorEditor } from './codeMirror'
export { ContentEditableEditor } from './contentEditable'
