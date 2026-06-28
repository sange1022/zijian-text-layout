import { SIZE_PRESETS } from '../data/presets'

type SizePresetsProps = {
  value: string
  onChange: (value: string) => void
}

export function SizePresets({ value, onChange }: SizePresetsProps) {
  return (
    <fieldset className="settings-section">
      <legend>常用尺寸</legend>
      <div className="size-grid">
        {SIZE_PRESETS.map((size) => (
          <button
            type="button"
            className="size-option"
            aria-pressed={value === size.id}
            key={size.id}
            onClick={() => onChange(size.id)}
          >
            <strong>{size.label}</strong>
            <span>{size.detail}</span>
          </button>
        ))}
      </div>
    </fieldset>
  )
}
