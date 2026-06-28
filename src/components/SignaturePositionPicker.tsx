import type { SignaturePosition } from '../types'

type SignaturePositionPickerProps = {
  value: SignaturePosition
  onChange: (value: SignaturePosition) => void
}

const POSITIONS: Array<{ value: SignaturePosition; label: string }> = [
  { value: 'top-left', label: '左上' },
  { value: 'top-center', label: '上中' },
  { value: 'top-right', label: '右上' },
  { value: 'bottom-left', label: '左下' },
  { value: 'bottom-center', label: '下中' },
  { value: 'bottom-right', label: '右下' },
]

export function SignaturePositionPicker({ value, onChange }: SignaturePositionPickerProps) {
  return (
    <div className="signature-position-control">
      <span className="control-label" id="signature-position-label">
        署名位置
      </span>
      <div
        className="signature-position-grid"
        role="group"
        aria-labelledby="signature-position-label"
      >
        {POSITIONS.map((position) => (
          <button
            type="button"
            key={position.value}
            aria-label={position.label}
            aria-pressed={value === position.value}
            onClick={() => onChange(position.value)}
          >
            <span
              className={`position-mark position-mark--${position.value}`}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
