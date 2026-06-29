import { expect, it, vi } from 'vitest'
import { exportPng } from './exportPng'

it('renders and downloads a PNG at the exact requested size', async () => {
  const node = document.createElement('div')
  const render = vi.fn().mockResolvedValue('data:image/png;base64,abc')
  const download = vi.fn()

  await exportPng(
    node,
    { width: 1080, height: 1080, name: '方图' },
    { render, download, fontsReady: Promise.resolve() },
  )

  expect(render).toHaveBeenCalledWith(
    node,
    expect.objectContaining({
      width: 1080,
      height: 1080,
      pixelRatio: 1,
      cacheBust: false,
    }),
  )
  expect(download).toHaveBeenCalledWith(
    'data:image/png;base64,abc',
    expect.stringMatching(/^字间-方图-\d{8}-\d{6}\.png$/),
  )
})
