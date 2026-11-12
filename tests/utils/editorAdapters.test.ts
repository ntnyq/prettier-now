import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { afterEach, describe, expect, it } from 'vitest'
import { CodeMirrorEditor } from '@/utils/editors/codeMirror'
import { ContentEditableEditor } from '@/utils/editors/contentEditable'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('editor adapters', () => {
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
