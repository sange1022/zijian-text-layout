# 字号滑块、海报色板与署名 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有文字排版工具中加入字号滑块、分类海报常用色和固定底部署名，同时保持界面简单、状态兼容和 PNG 导出一致。

**Architecture:** 扩展单一 `EditorState` 加入 `signature`，由持久化解析器迁移旧状态。字号滑块作为复用组件接入标题和正文设置；色板作为 `ColorField` 内的可展开子组件。署名由 `PreviewCanvas` 使用与正文共享的样式，在画布底部绝对定位。

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, CSS, html-to-image

---

## File Map

- `src/types.ts`：为 `EditorState` 增加 `signature`。
- `src/state/editorState.ts`：默认署名、旧状态迁移和新状态校验。
- `src/components/FontSizeSlider.tsx`：字号滑块与实时数字。
- `src/data/posterColors.ts`：五类、每类六个海报颜色。
- `src/components/PosterColorPalette.tsx`：分类与色块交互。
- `src/components/ColorField.tsx`：组合自定义颜色与海报常用色。
- `src/components/EditorPanel.tsx`：增加署名输入。
- `src/components/PreviewCanvas.tsx`：渲染固定底部署名。
- `src/App.tsx`：署名参与空内容判断。
- `src/styles.css`：滑块、色板和署名样式。

### Task 1: Signature state and backward-compatible persistence

**Files:**
- Modify: `src/types.ts`
- Modify: `src/state/editorState.ts`
- Modify: `src/state/editorState.test.ts`
- Modify: `src/hooks/usePersistedEditorState.test.tsx`

- [ ] **Step 1: Write failing migration tests**

```ts
it('adds an empty signature to a valid legacy state', () => {
  const { signature: _signature, ...legacy } = DEFAULT_EDITOR_STATE
  expect(parseStoredState(JSON.stringify(legacy))).toEqual({
    ...legacy,
    signature: '',
  })
})

it('restores a signature in the current state', () => {
  const saved = { ...DEFAULT_EDITOR_STATE, signature: '摄影 / 林野' }
  expect(parseStoredState(JSON.stringify(saved))).toEqual(saved)
})
```

- [ ] **Step 2: Verify the tests fail**

Run: `npm test -- --run src/state/editorState.test.ts`
Expected: FAIL because `EditorState` has no signature and legacy migration is missing.

- [ ] **Step 3: Add signature and migration**

```ts
export type EditorState = {
  title: string
  body: string
  signature: string
  titleStyle: TextStyle
  bodyStyle: TextStyle
  backgroundColor: string
  sizeId: string
}
```

Set `DEFAULT_EDITOR_STATE.signature` to `''`. In `parseStoredState`, if the parsed object has valid legacy fields but no `signature`, validate `{ ...value, signature: '' }`; current states require `signature` to be a string.

- [ ] **Step 4: Run state and hook tests**

Run: `npm test -- --run src/state src/hooks`
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/types.ts src/state src/hooks
git commit -m "feat: persist optional poster signatures"
```

### Task 2: Font-size sliders

**Files:**
- Create: `src/components/FontSizeSlider.tsx`
- Create: `src/components/FontSizeSlider.test.tsx`
- Modify: `src/components/TextStyleControls.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write the failing slider test**

```tsx
it('updates and displays the selected font size', async () => {
  const onChange = vi.fn()
  render(<FontSizeSlider label="标题字号" value={64} min={24} max={160} onChange={onChange} />)
  fireEvent.change(screen.getByRole('slider', { name: '标题字号' }), { target: { value: '88' } })
  expect(onChange).toHaveBeenCalledWith(88)
  expect(screen.getByText('64 px')).toBeInTheDocument()
})
```

- [ ] **Step 2: Verify the test fails**

Run: `npm test -- --run src/components/FontSizeSlider.test.tsx`
Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement and integrate the slider**

```tsx
export function FontSizeSlider({ label, value, min, max, onChange }: Props) {
  return (
    <label className="font-size-slider">
      <span><span>{label}</span><output>{value} px</output></span>
      <input aria-label={label} type="range" min={min} max={max} value={value}
        onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  )
}
```

Use `24–160` for title and `12–80` for body. Replace the number inputs; do not add a second numeric editor.

- [ ] **Step 4: Run component and app tests**

Run: `npm test -- --run src/components/FontSizeSlider.test.tsx src/App.test.tsx`
Expected: all tests PASS with app tests targeting sliders.

- [ ] **Step 5: Commit**

```bash
git add src/components/FontSizeSlider* src/components/TextStyleControls.tsx src/App.test.tsx src/styles.css
git commit -m "feat: control font sizes with sliders"
```

### Task 3: Categorized poster color palettes

**Files:**
- Create: `src/data/posterColors.ts`
- Create: `src/components/PosterColorPalette.tsx`
- Create: `src/components/PosterColorPalette.test.tsx`
- Modify: `src/components/ColorField.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing palette tests**

```tsx
it('shows five categories and applies a selected color', async () => {
  const onSelect = vi.fn()
  render(<PosterColorPalette onSelect={onSelect} />)
  await user.click(screen.getByRole('button', { name: '海报常用色' }))
  expect(screen.getAllByRole('tab')).toHaveLength(5)
  await user.click(screen.getByRole('button', { name: '选择颜色 #F3E9D2' }))
  expect(onSelect).toHaveBeenCalledWith('#F3E9D2')
})
```

- [ ] **Step 2: Verify the test fails**

Run: `npm test -- --run src/components/PosterColorPalette.test.tsx`
Expected: FAIL because palette data and component do not exist.

- [ ] **Step 3: Add the exact palette data**

Define five categories named `黑白灰`, `米色大地`, `莫兰迪`, `复古`, `深色`, each with six unique six-digit HEX colors. Include `#F3E9D2` in `米色大地`.

- [ ] **Step 4: Implement the compact expandable palette**

The closed state is one `海报常用色` button. The open state renders five category tabs and six color buttons. Each color button has an accessible name `选择颜色 <HEX>`, calls `onSelect`, and keeps the palette open for quick comparison.

- [ ] **Step 5: Integrate into every ColorField and run tests**

```tsx
<PosterColorPalette onSelect={(next) => { setDraft(next); onChange(next) }} />
```

Run: `npm test -- --run src/components`
Expected: all component tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/data/posterColors.ts src/components/PosterColorPalette* src/components/ColorField.tsx src/styles.css
git commit -m "feat: add curated poster color palettes"
```

### Task 4: Fixed bottom signature and final verification

**Files:**
- Modify: `src/components/EditorPanel.tsx`
- Modify: `src/components/PreviewCanvas.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing signature behavior tests**

```tsx
await user.type(screen.getByLabelText('署名文字'), '摄影 / 林野')
expect(screen.getByTestId('preview-signature')).toHaveTextContent('摄影 / 林野')
expect(screen.getByTestId('preview-signature')).toHaveStyle({ bottom: '6%' })
```

Also clear title and body while leaving signature populated and assert `下载 PNG` remains enabled.

- [ ] **Step 2: Verify signature tests fail**

Run: `npm test -- --run src/App.test.tsx`
Expected: FAIL because the signature field and preview element do not exist.

- [ ] **Step 3: Implement signature input and preview**

Add a labeled single-line input after the body textarea. In `PreviewCanvas`, render the signature only when non-empty with `position: absolute; left: 11%; right: 11%; bottom: 6%`. Use the body font family, weight and color; set size to `Math.max(14, bodyFontSize * 0.72)`.

- [ ] **Step 4: Include signature in empty-state validation**

```ts
const isEmpty = !state.title.trim() && !state.body.trim() && !state.signature.trim()
```

- [ ] **Step 5: Run full automated verification**

Run: `npm test -- --run && npm run build && git diff --check`
Expected: all tests PASS, production build succeeds, and diff check is clean.

- [ ] **Step 6: Browser verification**

Verify at `1440 × 1000` and `390 × 844`: sliders update the canvas, each palette opens and applies a color, signature remains fixed near the canvas bottom, state survives reload, PNG contains the signature, and console has no relevant errors.

- [ ] **Step 7: Commit**

```bash
git add src/App* src/components/EditorPanel.tsx src/components/PreviewCanvas.tsx src/styles.css
git commit -m "feat: add fixed poster signature"
```
