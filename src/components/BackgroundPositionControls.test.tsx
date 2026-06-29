import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { BackgroundPositionControls } from './BackgroundPositionControls'

it('updates horizontal and vertical background positions', () => {
  const onChange = vi.fn()
  render(
    <BackgroundPositionControls positionX={50} positionY={50} onChange={onChange} />,
  )

  fireEvent.change(screen.getByRole('slider', { name: '背景图左右位置' }), {
    target: { value: '25' },
  })
  fireEvent.change(screen.getByRole('slider', { name: '背景图上下位置' }), {
    target: { value: '80' },
  })

  expect(onChange).toHaveBeenNthCalledWith(1, 25, 50)
  expect(onChange).toHaveBeenNthCalledWith(2, 50, 80)
})
