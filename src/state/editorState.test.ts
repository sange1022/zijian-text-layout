import { describe, expect, it } from 'vitest'
import { FONT_PRESETS, SIZE_PRESETS } from '../data/presets'
import { DEFAULT_EDITOR_STATE, parseStoredState } from './editorState'

describe('editor presets', () => {
  it('contains exactly the approved fonts', () => {
    expect(FONT_PRESETS.map((font) => font.label)).toEqual([
      '思源宋体',
      '思源黑体',
      '得意黑',
    ])
  })

  it('contains the five approved canvas sizes', () => {
    expect(SIZE_PRESETS.map(({ width, height }) => [width, height])).toEqual([
      [1242, 1656],
      [1080, 1080],
      [900, 383],
      [1080, 1920],
      [1920, 1080],
    ])
  })
})

describe('parseStoredState', () => {
  it('returns the default state for malformed JSON', () => {
    expect(parseStoredState('{broken')).toEqual(DEFAULT_EDITOR_STATE)
  })

  it('returns the default state for invalid saved values', () => {
    expect(parseStoredState('{"title":12}')).toEqual(DEFAULT_EDITOR_STATE)
  })

  it('restores a valid saved state', () => {
    const saved = { ...DEFAULT_EDITOR_STATE, title: '新的标题', sizeId: 'square' }
    expect(parseStoredState(JSON.stringify(saved))).toEqual(saved)
  })
})
