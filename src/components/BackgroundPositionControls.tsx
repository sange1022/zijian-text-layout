import type { CSSProperties } from 'react'

type BackgroundPositionControlsProps = {
  positionX: number
  positionY: number
  onChange: (positionX: number, positionY: number) => void
}

type PositionSliderProps = {
  axisLabel: string
  label: string
  value: number
  onChange: (value: number) => void
}

function PositionSlider({ axisLabel, label, value, onChange }: PositionSliderProps) {
  return (
    <label className="background-position-slider">
      <span>{axisLabel}</span>
      <input
        aria-label={label}
        type="range"
        min={0}
        max={100}
        value={value}
        style={{ '--range-progress': `${value}%` } as CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <output>{value}%</output>
    </label>
  )
}

export function BackgroundPositionControls({
  positionX,
  positionY,
  onChange,
}: BackgroundPositionControlsProps) {
  return (
    <div className="background-position-controls" role="group" aria-label="图片位置">
      <PositionSlider
        axisLabel="左右"
        label="背景图左右位置"
        value={positionX}
        onChange={(value) => onChange(value, positionY)}
      />
      <PositionSlider
        axisLabel="上下"
        label="背景图上下位置"
        value={positionY}
        onChange={(value) => onChange(positionX, value)}
      />
    </div>
  )
}
