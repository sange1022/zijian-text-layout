import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import App from './App'

it('renders the editor shell', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: '字间' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '下载 PNG' })).toBeInTheDocument()
})
