import { useCallback, useState } from 'react'
import { DEFAULT_EDITOR_STATE, parseStoredState, STORAGE_KEY } from '../state/editorState'
import type { EditorState } from '../types'

export function usePersistedEditorState() {
  const [state, setState] = useState<EditorState>(() =>
    parseStoredState(localStorage.getItem(STORAGE_KEY)),
  )

  const update = useCallback((patch: Partial<EditorState>) => {
    setState((current) => {
      const next = { ...current, ...patch }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const reset = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EDITOR_STATE))
    setState(DEFAULT_EDITOR_STATE)
  }, [])

  return { state, update, reset }
}
