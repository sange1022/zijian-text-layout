type FontSizeSliderProps = {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}

export function FontSizeSlider({ label, value, min, max, onChange }: FontSizeSliderProps) {
  const progress = ((value - min) / (max - min)) * 100

  return (
    <label className="font-size-slider">
      <span>{label}</span>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        value={value}
        style={{ '--range-progress': `${progress}%` } as React.CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <output>{value} px</output>
    </label>
  )
}
