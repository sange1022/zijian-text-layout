import type { EditorState } from '../types'
import { ColorField } from './ColorField'
import { SignaturePositionPicker } from './SignaturePositionPicker'
import { SizePresets } from './SizePresets'
import { TextStyleControls } from './TextStyleControls'

type EditorPanelProps = {
  state: EditorState
  onChange: (patch: Partial<EditorState>) => void
}

export function EditorPanel({ state, onChange }: EditorPanelProps) {
  return (
    <aside className="editor-panel" aria-label="排版设置">
      <fieldset className="settings-section content-fields">
        <legend>文字内容</legend>
        <label className="field-control">
          <span>标题</span>
          <textarea
            aria-label="标题内容"
            rows={2}
            value={state.title}
            onChange={(event) => onChange({ title: event.target.value })}
          />
        </label>
        <label className="field-control">
          <span>正文</span>
          <textarea
            aria-label="正文内容"
            rows={3}
            value={state.body}
            onChange={(event) => onChange({ body: event.target.value })}
          />
        </label>
        <div className="signature-row">
          <label className="field-control signature-field">
            <span>署名</span>
            <input
              aria-label="署名文字"
              type="text"
              placeholder="例如：摄影 / 林野"
              value={state.signature}
              onChange={(event) => onChange({ signature: event.target.value })}
            />
          </label>
          <SignaturePositionPicker
            value={state.signaturePosition}
            onChange={(signaturePosition) => onChange({ signaturePosition })}
          />
        </div>
      </fieldset>

      <TextStyleControls
        name="标题"
        value={state.titleStyle}
        onChange={(titleStyle) => onChange({ titleStyle })}
      />
      <TextStyleControls
        name="正文"
        value={state.bodyStyle}
        onChange={(bodyStyle) => onChange({ bodyStyle })}
      />
      <SizePresets value={state.sizeId} onChange={(sizeId) => onChange({ sizeId })} />
      <fieldset className="settings-section background-section">
        <legend>画布背景</legend>
        <ColorField
          label="背景颜色"
          value={state.backgroundColor}
          onChange={(backgroundColor) => onChange({ backgroundColor })}
        />
      </fieldset>
    </aside>
  )
}
