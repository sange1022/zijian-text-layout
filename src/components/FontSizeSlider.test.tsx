import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { FontSizeSlider } from './FontSizeSlider'

it('updates and displays the selected font size', () => {
  const onChange = vi.fn()
  render(
    <FontSizeSlider
      label="标题字号"
      value={64}
      min={24}
      max={160}
      onChange={onChange}
    />,
  )

  fireEvent.change(screen.getByRole('slider', { name: '标题字号' }), {
    target: { value: '88' },
  })

  expect(onChange).toHaveBeenCalledWith(88)
  expect(screen.getByText('64 px')).toBeInTheDocument()
})
