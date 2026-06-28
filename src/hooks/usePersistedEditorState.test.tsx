import { act, renderHook } from '@testing-library/react'
import { expect, it } from 'vitest'
import { STORAGE_KEY } from '../state/editorState'
import { usePersistedEditorState } from './usePersistedEditorState'

it('persists updates to local storage', () => {
  const { result } = renderHook(() => usePersistedEditorState())

  act(() => result.current.update({ title: '新的标题' }))

  expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toMatchObject({
    title: '新的标题',
  })
})
