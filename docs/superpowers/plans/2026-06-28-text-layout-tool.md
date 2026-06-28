# 文字排版图片工具 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个可实时编辑标题与正文、选择中文字体和常用图片尺寸，并导出高清 PNG 的响应式网页工具。

**Architecture:** 使用 React + TypeScript 管理单一编辑状态，控制面板和预览画布共享同一状态源。预览使用按目标像素建模、CSS 缩放展示的 DOM 画布；导出使用 `html-to-image` 按实际尺寸生成 PNG。本地状态通过一个带校验的持久化 hook 保存。

**Tech Stack:** Vite, React 19, TypeScript, Vitest, Testing Library, html-to-image, CSS

---

## File Map

- `package.json`：依赖与开发、测试、构建命令。
- `vite.config.ts`、`tsconfig*.json`、`index.html`：Vite + TypeScript 基础配置。
- `src/types.ts`：编辑状态、文字样式、尺寸和字体类型。
- `src/data/presets.ts`：字体与尺寸预设。
- `src/state/editorState.ts`：默认值、状态校验和持久化键。
- `src/hooks/usePersistedEditorState.ts`：状态更新与 localStorage 同步。
- `src/components/EditorPanel.tsx`：控制面板组合。
- `src/components/TextStyleControls.tsx`：标题/正文复用样式控件。
- `src/components/ColorField.tsx`：取色器和十六进制输入。
- `src/components/SizePresets.tsx`：尺寸预设按钮。
- `src/components/PreviewCanvas.tsx`：目标尺寸画布和屏幕缩放。
- `src/components/ExportButton.tsx`：字体等待、校验和 PNG 下载。
- `src/App.tsx`：应用壳和状态组合。
- `src/styles.css`：黑白视觉系统与响应式布局。
- `src/**/*.test.ts(x)`：对应单元与交互测试。

### Task 1: Scaffold and test harness

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/test/setup.ts`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Write a failing smoke test**

```tsx
import { render, screen } from '@testing-library/react'
import App from './App'

it('renders the editor shell', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: '字间' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '下载 PNG' })).toBeInTheDocument()
})
```

- [ ] **Step 2: Install dependencies and verify the smoke test fails**

Run: `npm install && npm test -- --run`
Expected: FAIL because `src/App.tsx` does not exist.

- [ ] **Step 3: Add the minimal app shell**

```tsx
export default function App() {
  return <><h1>字间</h1><button>下载 PNG</button></>
}
```

- [ ] **Step 4: Run the test and build**

Run: `npm test -- --run && npm run build`
Expected: tests PASS and Vite build succeeds.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig*.json index.html src
git commit -m "chore: scaffold text layout app"
```

### Task 2: Domain presets and persisted state

**Files:**
- Create: `src/types.ts`
- Create: `src/data/presets.ts`
- Create: `src/state/editorState.ts`
- Create: `src/hooks/usePersistedEditorState.ts`
- Test: `src/state/editorState.test.ts`
- Test: `src/hooks/usePersistedEditorState.test.tsx`

- [ ] **Step 1: Write failing tests for the five exact canvas sizes and invalid saved data**

```ts
expect(SIZE_PRESETS.map(({ width, height }) => [width, height])).toEqual([
  [1242, 1656], [1080, 1080], [900, 383], [1080, 1920], [1920, 1080],
])
expect(parseStoredState('{"title":12}')).toEqual(DEFAULT_EDITOR_STATE)
```

- [ ] **Step 2: Run focused tests**

Run: `npm test -- --run src/state/editorState.test.ts`
Expected: FAIL because preset and parser modules do not exist.

- [ ] **Step 3: Define state and presets**

```ts
export type TextStyle = { fontId: string; fontSize: number; fontWeight: number; lineHeight: number; color: string }
export type EditorState = { title: string; body: string; titleStyle: TextStyle; bodyStyle: TextStyle; backgroundColor: string; sizeId: string }
export type SizePreset = { id: string; label: string; detail: string; width: number; height: number }
export type FontPreset = { id: string; label: string; family: string; fallback: string; usage: '标题' | '正文' | '通用' }
```

Implement all approved font labels, all five size presets, a complete `DEFAULT_EDITOR_STATE`, and `parseStoredState` that accepts only a structurally valid state with known font and size IDs.

- [ ] **Step 4: Write the failing persistence-hook test**

```tsx
const { result } = renderHook(() => usePersistedEditorState())
act(() => result.current.update({ title: '新的标题' }))
expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toMatchObject({ title: '新的标题' })
```

- [ ] **Step 5: Implement the hook and run tests**

The hook returns `{ state, update, reset }`, initializes from `parseStoredState`, and writes every valid state update to localStorage.

Run: `npm test -- --run src/state src/hooks`
Expected: all state and hook tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/types.ts src/data src/state src/hooks
git commit -m "feat: add editor presets and persisted state"
```

### Task 3: Editor controls and live preview

**Files:**
- Create: `src/components/ColorField.tsx`
- Create: `src/components/TextStyleControls.tsx`
- Create: `src/components/SizePresets.tsx`
- Create: `src/components/EditorPanel.tsx`
- Create: `src/components/PreviewCanvas.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/EditorPanel.test.tsx`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Write failing interaction tests**

```tsx
render(<App />)
await user.clear(screen.getByLabelText('标题内容'))
await user.type(screen.getByLabelText('标题内容'), '夏日来信')
expect(screen.getByTestId('preview-title')).toHaveTextContent('夏日来信')
await user.click(screen.getByRole('button', { name: /方图 1:1/ }))
expect(screen.getByTestId('preview-canvas')).toHaveAttribute('data-size', '1080x1080')
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm test -- --run src/App.test.tsx src/components/EditorPanel.test.tsx`
Expected: FAIL because editor controls and preview do not exist.

- [ ] **Step 3: Implement accessible controls**

`EditorPanel` renders labeled title/body textareas, two `TextStyleControls`, `SizePresets`, and `ColorField` for background. `TextStyleControls` renders font, size, weight, line-height and color controls. Number inputs clamp to safe ranges; color text values update state only when matching `^#[0-9A-Fa-f]{6}$`.

- [ ] **Step 4: Implement the scaled preview**

`PreviewCanvas` resolves the active size and font presets, renders a `data-export-canvas` DOM node at the exact target width/height, and scales it to fit its container. Title and body preserve newlines with `white-space: pre-wrap`; the content stack is left aligned and vertically centered.

- [ ] **Step 5: Connect app state and run tests**

```tsx
const { state, update } = usePersistedEditorState()
return <AppShell editor={<EditorPanel state={state} onChange={update} />} preview={<PreviewCanvas state={state} />} />
```

Run: `npm test -- --run`
Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/components src/App.test.tsx
git commit -m "feat: add editor controls and live preview"
```

### Task 4: Reliable PNG export

**Files:**
- Create: `src/export/exportPng.ts`
- Create: `src/components/ExportButton.tsx`
- Modify: `src/App.tsx`
- Test: `src/export/exportPng.test.ts`
- Test: `src/components/ExportButton.test.tsx`

- [ ] **Step 1: Write failing export tests**

```ts
await exportPng(node, { width: 1080, height: 1080, name: '方图' })
expect(toPng).toHaveBeenCalledWith(node, expect.objectContaining({ width: 1080, height: 1080, pixelRatio: 1 }))
expect(downloadAnchor.download).toMatch(/^字间-方图-\d{8}-\d{6}\.png$/)
```

```tsx
render(<ExportButton isEmpty onExport={onExport} />)
expect(screen.getByRole('button', { name: '下载 PNG' })).toBeDisabled()
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm test -- --run src/export src/components/ExportButton.test.tsx`
Expected: FAIL because exporter and button do not exist.

- [ ] **Step 3: Implement export behavior**

`exportPng` waits for `document.fonts.ready`, calls `html-to-image` `toPng` with the preset's actual width and height, creates an anchor with a timestamped filename, triggers download, and always removes the anchor. `ExportButton` shows `正在生成…`, prevents duplicate clicks, and exposes a short `role="alert"` message if generation fails.

- [ ] **Step 4: Connect export to the exact preview node**

Use one shared ref passed to `PreviewCanvas` and `ExportButton`. Disable export only when both `title.trim()` and `body.trim()` are empty.

- [ ] **Step 5: Run export tests and full suite**

Run: `npm test -- --run && npm run build`
Expected: all tests PASS and build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/export src/components/ExportButton.tsx src/App.tsx
git commit -m "feat: export layouts as high resolution png"
```

### Task 5: Approved visual system, fonts, and responsive QA

**Files:**
- Create: `src/fonts.css`
- Create: `src/styles.css`
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/*.tsx`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Add failing semantic assertions**

```tsx
expect(screen.getByRole('main')).toBeInTheDocument()
expect(screen.getByLabelText('背景颜色')).toHaveAttribute('type', 'color')
expect(screen.getByText('小红书 3:4')).toHaveAttribute('aria-pressed', 'true')
```

- [ ] **Step 2: Implement the design tokens and typography**

Use the approved true-white panel, neutral gray workspace, near-black text, `8px` control radii, `18px` app radius, crisp `#dedede` borders, restrained shadows, and one black primary action. Define font faces with explicit system fallbacks and load only the approved font families.

- [ ] **Step 3: Implement responsive layout and states**

At widths above `900px`, use a fixed `360px` editor rail and flexible preview. At `900px` and below, stack editor above preview and cap the preview width to the viewport. Add hover, focus-visible, selected, disabled, loading, and error states; respect `prefers-reduced-motion`.

- [ ] **Step 4: Run automated verification**

Run: `npm test -- --run && npm run build`
Expected: all tests PASS and build succeeds with no TypeScript errors.

- [ ] **Step 5: Browser verification**

Run: `npm run dev -- --host 127.0.0.1`

Verify in the in-app browser at desktop and mobile widths:

1. Change both text fields and confirm instant preview.
2. Change title/body fonts, sizes, weights, line heights and colors independently.
3. Select each of the five sizes and confirm aspect ratio changes without losing text.
4. Refresh and confirm state restoration.
5. Export a PNG and inspect its exact pixel dimensions and visual match.
6. Confirm no horizontal overflow, clipped controls, console errors or inaccessible focus states.

- [ ] **Step 6: Commit**

```bash
git add src package.json package-lock.json
git commit -m "feat: polish responsive text layout studio"
```

### Task 6: Final fidelity and regression verification

**Files:**
- Modify: only files required by discovered mismatches

- [ ] **Step 1: Capture the approved mockup and implementation at comparable desktop dimensions**

Use the approved companion screen as concept evidence and capture the current implementation at `1440 × 1000`.

- [ ] **Step 2: Inspect both images**

Compare layout split, typography hierarchy, true-white/gray palette, control density, canvas scale, borders, radii, spacing, visible copy and responsive behavior. Record and fix every material mismatch.

- [ ] **Step 3: Re-run complete verification**

Run: `npm test -- --run && npm run build`
Expected: all tests PASS and production build succeeds.

- [ ] **Step 4: Confirm clean repository state**

Run: `git status --short`
Expected: no uncommitted files except intentional local QA artifacts, which must be removed before handoff.
