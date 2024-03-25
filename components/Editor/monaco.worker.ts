import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import HTMLWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import CSSWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'

self.MonacoEnvironment = {
  getWorker(workerId, label) {
    switch (label) {
      case 'javascript':
      case 'typescript':
        return new TsWorker()
      case 'json':
        return new JsonWorker()
      case 'html':
        return new HTMLWorker()
      case 'css':
        return new CSSWorker()
      default:
        return new EditorWorker()
    }
  },
}

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
