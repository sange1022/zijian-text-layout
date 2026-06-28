import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { expect, it } from 'vitest'
import { ColorField } from './ColorField'

function Harness() {
  const [color, setColor] = useState('#111111')
  return <ColorField label="标题颜色" value={color} onChange={setColor} />
}

it('allows a hex color to be replaced by typing', async () => {
  const user = userEvent.setup()
  render(<Harness />)
  const hexInput = screen.getByLabelText('标题颜色 HEX')

  await user.clear(hexInput)
  await user.type(hexInput, '#ff0000')

  expect(hexInput).toHaveValue('#FF0000')
  expect(screen.getByLabelText('标题颜色')).toHaveValue('#ff0000')
})
