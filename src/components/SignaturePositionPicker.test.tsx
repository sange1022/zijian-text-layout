import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { SignaturePositionPicker } from './SignaturePositionPicker'

it('renders six positions and reports the selected position', async () => {
  const user = userEvent.setup()
  const onChange = vi.fn()

  render(<SignaturePositionPicker value="bottom-left" onChange={onChange} />)

  expect(screen.getAllByRole('button')).toHaveLength(6)
  expect(screen.getByRole('button', { name: '左下' })).toHaveAttribute('aria-pressed', 'true')

  await user.click(screen.getByRole('button', { name: '上中' }))
  expect(onChange).toHaveBeenCalledWith('top-center')
})
