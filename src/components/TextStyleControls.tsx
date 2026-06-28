import { FONT_PRESETS } from '../data/presets'
import type { TextStyle } from '../types'
import { ColorField } from './ColorField'

type TextStyleControlsProps = {
  name: '标题' | '正文'
  value: TextStyle
  onChange: (value: TextStyle) => void
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function TextStyleControls({ name, value, onChange }: TextStyleControlsProps) {
  const update = (patch: Partial<TextStyle>) => onChange({ ...value, ...patch })

  return (
    <fieldset className="settings-section style-controls">
      <legend>{name}样式</legend>
      <label className="field-control field-control--wide">
        <span>{name}字体</span>
        <select
          aria-label={`${name}字体`}
          value={value.fontId}
          onChange={(event) => update({ fontId: event.target.value })}
        >
          {FONT_PRESETS.map((font) => (
            <option key={font.id} value={font.id}>
              {font.label} · {font.usage}
            </option>
          ))}
        </select>
      </label>
      <div className="control-row">
        <label className="field-control">
          <span>{name}字号</span>
          <input
            aria-label={`${name}字号`}
            type="number"
            min="12"
            max="240"
            value={value.fontSize}
            onChange={(event) => update({ fontSize: clamp(Number(event.target.value), 12, 240) })}
          />
        </label>
        <label className="field-control">
          <span>{name}粗细</span>
          <select
            aria-label={`${name}粗细`}
            value={value.fontWeight}
            onChange={(event) => update({ fontWeight: Number(event.target.value) })}
          >
            <option value="400">常规</option>
            <option value="600">中粗</option>
            <option value="700">粗体</option>
          </select>
        </label>
      </div>
      <ColorField label={`${name}颜色`} value={value.color} onChange={(color) => update({ color })} />
    </fieldset>
  )
}
