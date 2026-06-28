import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import App from './App'

it('renders the simple editor workspace', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: '字间' })).toBeInTheDocument()
  expect(screen.getByRole('main')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '下载 PNG' })).toBeInTheDocument()
  expect(screen.getAllByRole('option', { name: /思源|得意/ })).toHaveLength(6)
})

it('updates the preview text and size immediately', async () => {
  const user = userEvent.setup()
  render(<App />)

  const title = screen.getByLabelText('标题内容')
  await user.clear(title)
  await user.type(title, '夏日来信')

  expect(screen.getByTestId('preview-title')).toHaveTextContent('夏日来信')

  await user.click(screen.getByRole('button', { name: /方图 1:1/ }))
  expect(screen.getByTestId('preview-canvas')).toHaveAttribute('data-size', '1080x1080')
})

it('updates title typography independently', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.selectOptions(screen.getByLabelText('标题字体'), 'smiley')
  fireEvent.change(screen.getByRole('slider', { name: '标题字号' }), { target: { value: '80' } })
  fireEvent.change(screen.getByLabelText('标题颜色'), { target: { value: '#ff0000' } })

  expect(screen.getByTestId('preview-title')).toHaveStyle({
    color: '#ff0000',
    fontSize: '80px',
  })
  expect(screen.getByTestId('preview-title').getAttribute('style')).toContain('Smiley Sans')
  expect(screen.getByTestId('preview-body').getAttribute('style')).not.toContain('Smiley Sans')
})

it('disables export when both text fields are empty', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.clear(screen.getByLabelText('标题内容'))
  await user.clear(screen.getByLabelText('正文内容'))

  expect(screen.getByRole('button', { name: '下载 PNG' })).toBeDisabled()
  expect(screen.getByText('请输入标题或正文')).toBeInTheDocument()
})
