import { act, renderHook } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { useSessionBackgroundImage } from './useSessionBackgroundImage'

it('revokes replaced, removed, and unmounted object URLs', () => {
  const revokeObjectURL = vi.fn()
  const { result, unmount } = renderHook(() => useSessionBackgroundImage(revokeObjectURL))

  act(() => result.current.setBackgroundImage({ url: 'blob:first', name: 'first.jpg' }))
  act(() => result.current.setBackgroundImage({ url: 'blob:second', name: 'second.jpg' }))
  expect(revokeObjectURL).toHaveBeenCalledWith('blob:first')

  act(() => result.current.setBackgroundImage(null))
  expect(revokeObjectURL).toHaveBeenCalledWith('blob:second')

  act(() => result.current.setBackgroundImage({ url: 'blob:third', name: 'third.jpg' }))
  unmount()
  expect(revokeObjectURL).toHaveBeenCalledWith('blob:third')
})
