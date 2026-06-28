import { useState } from 'react'
import { prepareBackgroundImage } from '../background/prepareBackgroundImage'
import type { BackgroundImageValue } from '../types'

type BackgroundImageFieldProps = {
  value: BackgroundImageValue | null
  onChange: (value: BackgroundImageValue | null) => void
  prepare?: (file: File) => Promise<BackgroundImageValue>
}

export function BackgroundImageField({
  value,
  onChange,
  prepare = prepareBackgroundImage,
}: BackgroundImageFieldProps) {
  const [error, setError] = useState('')
  const [isPreparing, setIsPreparing] = useState(false)
  const uploadLabel = value ? '更换背景图' : '上传背景图'

  return (
    <div className="background-image-field">
      <label className="background-image-upload">
        <span>{isPreparing ? '读取中…' : uploadLabel}</span>
        <input
          aria-label={uploadLabel}
          type="file"
          accept="image/*"
          disabled={isPreparing}
          onChange={async (event) => {
            const input = event.currentTarget
            const file = input.files?.[0]
            if (!file) return
            setError('')
            setIsPreparing(true)
            try {
              onChange(await prepare(file))
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : '图片无法读取，请更换文件')
            } finally {
              setIsPreparing(false)
              input.value = ''
            }
          }}
        />
      </label>
      {value ? (
        <>
          <span className="background-image-name" title={value.name}>
            {value.name}
          </span>
          <button
            type="button"
            className="background-image-remove"
            aria-label="移除背景图"
            onClick={() => {
              setError('')
              onChange(null)
            }}
          >
            ×
          </button>
        </>
      ) : null}
      {error ? (
        <span className="background-image-error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  )
}
