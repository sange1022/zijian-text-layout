import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { ExportButton } from './ExportButton'

it('is disabled when there is no content', () => {
  render(<ExportButton isEmpty onExport={vi.fn()} />)
  expect(screen.getByRole('button', { name: '下载 PNG' })).toBeDisabled()
})

it('shows a useful error and restores the button after export fails', async () => {
  const user = userEvent.setup()
  render(
    <ExportButton
      isEmpty={false}
      onExport={vi.fn().mockRejectedValue(new Error('failed'))}
    />,
  )

  await user.click(screen.getByRole('button', { name: '下载 PNG' }))

  expect(screen.getByRole('alert')).toHaveTextContent('生成失败，请重试')
  expect(screen.getByRole('button', { name: '下载 PNG' })).toBeEnabled()
})
