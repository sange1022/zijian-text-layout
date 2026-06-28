import { useRef } from 'react'
import { EditorPanel } from './components/EditorPanel'
import { ExportButton } from './components/ExportButton'
import { PreviewCanvas } from './components/PreviewCanvas'
import { SIZE_BY_ID } from './data/presets'
import { exportPng } from './export/exportPng'
import { usePersistedEditorState } from './hooks/usePersistedEditorState'

export default function App() {
  const { state, update } = usePersistedEditorState()
  const previewRef = useRef<HTMLDivElement>(null)
  const isEmpty = !state.title.trim() && !state.body.trim() && !state.signature.trim()
  const size = SIZE_BY_ID.get(state.sizeId)!

  const handleExport = async () => {
    if (!previewRef.current) throw new Error('Preview canvas is unavailable')
    await exportPng(previewRef.current, {
      width: size.width,
      height: size.height,
      name: size.label.replace(/\s+/g, '-'),
    })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1 aria-label="字间">字间 <span>· 排版工具</span></h1>
        <ExportButton isEmpty={isEmpty} onExport={handleExport} />
      </header>
      <main className="workspace">
        <EditorPanel state={state} onChange={update} />
        <PreviewCanvas ref={previewRef} state={state} />
      </main>
    </div>
  )
}
