import { useRef } from 'react'
import { EditorPanel } from './components/EditorPanel'
import { PreviewCanvas } from './components/PreviewCanvas'
import { usePersistedEditorState } from './hooks/usePersistedEditorState'

export default function App() {
  const { state, update } = usePersistedEditorState()
  const previewRef = useRef<HTMLDivElement>(null)
  const isEmpty = !state.title.trim() && !state.body.trim()

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1 aria-label="字间">字间 <span>· 排版工具</span></h1>
        <div className="export-area">
          {isEmpty ? <span className="empty-hint">请输入标题或正文</span> : null}
          <button type="button" className="export-button" disabled={isEmpty}>
            下载 PNG
          </button>
        </div>
      </header>
      <main className="workspace">
        <EditorPanel state={state} onChange={update} />
        <PreviewCanvas ref={previewRef} state={state} />
      </main>
    </div>
  )
}
