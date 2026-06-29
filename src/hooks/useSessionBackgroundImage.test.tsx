import { act, renderHook } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { useSessionBackgroundImage } from './useSessionBackgroundImage'

it('revokes replaced, removed, and unmounted object URLs', () => {
  const revokeObjectURL = vi.fn()
  const { result, unmount } = renderHook(() => useSessionBackgroundImage(revokeObjectURL))

  act(() =>
    result.current.setBackgroundImage({
      url: 'blob:first',
      name: 'first.jpg',
      positionX: 50,
      positionY: 50,
    }),
  )
  act(() =>
    result.current.setBackgroundImage({
      url: 'blob:second',
      name: 'second.jpg',
      positionX: 50,
      positionY: 50,
    }),
  )
  expect(revokeObjectURL).toHaveBeenCalledWith('blob:first')

  act(() => result.current.setBackgroundImage(null))
  expect(revokeObjectURL).toHaveBeenCalledWith('blob:second')

  act(() =>
    result.current.setBackgroundImage({
      url: 'blob:third',
      name: 'third.jpg',
      positionX: 50,
      positionY: 50,
    }),
  )
  unmount()
  expect(revokeObjectURL).toHaveBeenCalledWith('blob:third')
})
