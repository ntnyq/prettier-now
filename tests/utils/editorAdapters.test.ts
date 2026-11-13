import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AceEditor } from '@/utils/editors/ace'
import { CodeMirrorEditor } from '@/utils/editors/codeMirror'
import { ContentEditableEditor } from '@/utils/editors/contentEditable'
import { TextareaEditor } from '@/utils/editors/textarea'

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('editor adapters', () => {
  it('uses the native textarea setter when insertText is unavailable', () => {
    const textarea = document.createElement('textarea')
    textarea.value = 'original'
    const native = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      'value',
    )!
    const trackedSetter = vi.fn((value: string) =>
      native.set!.call(textarea, value),
    )
    Object.defineProperty(textarea, 'value', {
      get: () => native.get!.call(textarea),
      set: trackedSetter,
    })
    document.body.append(textarea)
    document.execCommand = vi.fn(() => false)
    new TextareaEditor(textarea).setValue('updated')
    expect(textarea.value).toBe('updated')
    expect(trackedSetter).not.toHaveBeenCalled()
  })

  it.each(['disabled', 'readOnly'] as const)(
    'preserves %s textareas',
    property => {
      const textarea = document.createElement('textarea')
      textarea.value = 'original'
      textarea[property] = true
      expect(() =>
        new TextareaEditor(textarea).setValue('replacement'),
      ).toThrow('read-only')
      expect(textarea.value).toBe('original')
    },
  )

  it('preserves read-only CodeMirror 6 documents', () => {
    const view = new EditorView({
      state: EditorState.create({
        doc: 'original',
        extensions: [EditorState.readOnly.of(true)],
      }),
      parent: document.body,
    })
    try {
      expect(() =>
        new CodeMirrorEditor(view.contentDOM).setValue('replacement'),
      ).toThrow('read-only')
      expect(view.state.doc.toString()).toBe('original')
    } finally {
      view.destroy()
    }
  })

  it('preserves read-only Ace documents', () => {
    const wrapper = Object.assign(document.createElement('div'), {
      env: {
        editor: {
          getReadOnly: () => true,
          setValue() {
            throw new Error('Unexpected write')
          },
        },
      },
    })
    wrapper.className = 'ace_editor'
    expect(() => new AceEditor(wrapper).setValue('replacement')).toThrow(
      'read-only',
    )
  })

  it('reads and writes a CodeMirror 5 instance', () => {
    let source = 'const a=1'
    const wrapper = Object.assign(document.createElement('div'), {
      CodeMirror: {
        getValue: () => source,
        setValue(value: string) {
          source = value
        },
      },
    })
    wrapper.className = 'CodeMirror'
    document.body.append(wrapper)
    const adapter = new CodeMirrorEditor(wrapper)
    expect(adapter.getValue()).toBe(source)
    adapter.setValue('const a = 1;\n')
    expect(source).toBe('const a = 1;\n')
  })

  it('reads and updates a real CodeMirror 6 view', () => {
    const view = new EditorView({
      state: EditorState.create({ doc: 'const a=1' }),
      parent: document.body,
    })
    try {
      const adapter = new CodeMirrorEditor(view.contentDOM)
      expect(adapter.getValue()).toBe('const a=1')
      adapter.setValue('const a = 1;\n')
      expect(view.state.doc.toString()).toBe('const a = 1;\n')
    } finally {
      view.destroy()
    }
  })

  it('preserves visible line breaks in contenteditable source and output', () => {
    const element = document.createElement('div')
    element.contentEditable = 'true'
    element.innerHTML =
      '<div>const a=1 // comment</div><div>const b=2<br>const c=3</div>'
    document.body.append(element)
    const adapter = new ContentEditableEditor(element)
    expect(adapter.getValue()).toBe(
      'const a=1 // comment\nconst b=2\nconst c=3',
    )
    adapter.setValue('const a = 1;\nconst b = 2;\n')
    expect(adapter.getValue()).toBe('const a = 1;\nconst b = 2;\n')
  })
})
