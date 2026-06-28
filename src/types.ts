export type TextStyle = {
  fontId: string
  fontSize: number
  fontWeight: number
  color: string
}

export type EditorState = {
  title: string
  body: string
  signature: string
  titleStyle: TextStyle
  bodyStyle: TextStyle
  backgroundColor: string
  sizeId: string
}

export type SizePreset = {
  id: string
  label: string
  detail: string
  width: number
  height: number
}

export type FontPreset = {
  id: string
  label: string
  family: string
  fallback: string
  usage: string
}
