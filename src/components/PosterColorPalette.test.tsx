import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { PosterColorPalette } from './PosterColorPalette'

it('shows five categories and applies a selected color', async () => {
  const user = userEvent.setup()
  const onSelect = vi.fn()
  render(<PosterColorPalette onSelect={onSelect} />)

  await user.click(screen.getByRole('button', { name: '海报常用色' }))
  expect(screen.getAllByRole('tab')).toHaveLength(5)

  await user.click(screen.getByRole('tab', { name: '米色大地' }))
  await user.click(screen.getByRole('button', { name: '选择颜色 #F3E9D2' }))

  expect(onSelect).toHaveBeenCalledWith('#F3E9D2')
})
