import { useState } from 'react'

type ExportButtonProps = {
  isEmpty: boolean
  onExport: () => Promise<void>
}

export function ExportButton({ isEmpty, onExport }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState('')

  const handleExport = async () => {
    setIsExporting(true)
    setError('')
    try {
      await onExport()
    } catch {
      setError('生成失败，请重试')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="export-area">
      {isEmpty ? <span className="empty-hint">请输入文字内容</span> : null}
      {error ? <span className="export-error" role="alert">{error}</span> : null}
      <button
        type="button"
        className="export-button"
        disabled={isEmpty || isExporting}
        onClick={handleExport}
      >
        {isExporting ? '正在生成…' : '下载 PNG'}
      </button>
    </div>
  )
}
