import { useEffect, useState } from 'react'
import { PosterColorPalette } from './PosterColorPalette'

type ColorFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  const [draft, setDraft] = useState(value.toUpperCase())

  useEffect(() => {
    setDraft(value.toUpperCase())
  }, [value])

  const applyColor = (next: string) => {
    setDraft(next)
    onChange(next)
  }

  return (
    <div className="color-control">
      <div className="color-field">
        <label className="control-label">
          {label}
          <input
            aria-label={label}
            className="color-picker"
            type="color"
            value={value}
            onChange={(event) => applyColor(event.target.value.toUpperCase())}
          />
        </label>
        <input
          aria-label={`${label} HEX`}
          className="hex-input"
          value={draft}
          maxLength={7}
          onChange={(event) => {
            const next = event.target.value.toUpperCase()
            setDraft(next)
            if (HEX_COLOR.test(next)) onChange(next)
          }}
          onBlur={() => {
            if (!HEX_COLOR.test(draft)) setDraft(value.toUpperCase())
          }}
        />
      </div>
      <PosterColorPalette onSelect={applyColor} />
    </div>
  )
}
