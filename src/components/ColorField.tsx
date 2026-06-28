type ColorFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <div className="color-field">
      <label className="control-label">
        {label}
        <input
          aria-label={label}
          className="color-picker"
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
        />
      </label>
      <input
        aria-label={`${label} HEX`}
        className="hex-input"
        value={value.toUpperCase()}
        maxLength={7}
        onChange={(event) => {
          if (HEX_COLOR.test(event.target.value)) onChange(event.target.value.toUpperCase())
        }}
      />
    </div>
  )
}
