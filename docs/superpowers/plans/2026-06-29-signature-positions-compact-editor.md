# Signature Positions and Compact Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add six selectable signature positions and compact the left editor so its main settings fit within a typical 900px-high desktop viewport.

**Architecture:** Extend the persisted `EditorState` with a validated `SignaturePosition` union and migrate older saved data to `bottom-left`. A focused `SignaturePositionPicker` will update that state, while `PreviewCanvas` will derive explicit edge and alignment styles from the selected value. Existing component structure remains intact; compactness is handled by small markup adjustments and scoped CSS.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite

---

## File map

- Modify `src/types.ts`: define the signature-position union and persist it in editor state.
- Modify `src/state/editorState.ts`: add the default position and migrate/validate saved state.
- Modify `src/state/editorState.test.ts`: cover valid positions, invalid values, and legacy migration.
- Create `src/components/SignaturePositionPicker.tsx`: render the accessible two-by-three position control.
- Create `src/components/SignaturePositionPicker.test.tsx`: verify all options and updates.
- Modify `src/components/EditorPanel.tsx`: place the picker next to the signature input and reduce textarea rows.
- Modify `src/components/TextStyleControls.tsx`: group font and weight into one compact row.
- Modify `src/components/PreviewCanvas.tsx`: map all six positions to canvas styles.
- Modify `src/App.test.tsx`: verify selection changes and preview positioning.
- Modify `src/styles.css`: compact spacing, controls, size grid, and responsive behavior.

### Task 1: Persist and migrate the signature position

**Files:**
- Modify: `src/types.ts`
- Modify: `src/state/editorState.ts`
- Test: `src/state/editorState.test.ts`

- [ ] **Step 1: Write failing state tests**

Add tests that remove `signaturePosition` from an otherwise valid state, restore a valid non-default position, and reject an unknown value:

```ts
it('adds the default signature position to a valid legacy state', () => {
  const legacy = { ...DEFAULT_EDITOR_STATE } as Record<string, unknown>
  delete legacy.signaturePosition

  expect(parseStoredState(JSON.stringify(legacy))).toEqual({
    ...legacy,
    signaturePosition: 'bottom-left',
  })
})

it('restores a valid signature position', () => {
  const saved = { ...DEFAULT_EDITOR_STATE, signaturePosition: 'top-center' as const }
  expect(parseStoredState(JSON.stringify(saved))).toEqual(saved)
})

it('rejects an unknown signature position', () => {
  const saved = { ...DEFAULT_EDITOR_STATE, signaturePosition: 'middle' }
  expect(parseStoredState(JSON.stringify(saved))).toEqual(DEFAULT_EDITOR_STATE)
})
```

- [ ] **Step 2: Run the state tests and verify failure**

Run: `npm test -- --run src/state/editorState.test.ts`

Expected: FAIL because `signaturePosition` is absent from the current state model and migration.

- [ ] **Step 3: Add the type, default, validation, and migration**

In `src/types.ts`, add:

```ts
export type SignaturePosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export type EditorState = {
  title: string
  body: string
  signature: string
  signaturePosition: SignaturePosition
  titleStyle: TextStyle
  bodyStyle: TextStyle
  backgroundColor: string
  sizeId: string
}
```

In `src/state/editorState.ts`, define the allowed values, add the default, validate it, and normalize legacy objects before `isEditorState` runs:

```ts
const SIGNATURE_POSITIONS = new Set([
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
])

export const DEFAULT_EDITOR_STATE: EditorState = {
  title: '留一点空白，\n给生活呼吸',
  body: '好的排版让文字慢下来。标题负责建立节奏，正文留出足够的行间距，让每一句话都被看见。',
  signature: '',
  signaturePosition: 'bottom-left',
  titleStyle: {
    fontId: 'source-serif',
    fontSize: 64,
    fontWeight: 700,
    color: '#111111',
  },
  bodyStyle: {
    fontId: 'source-sans',
    fontSize: 28,
    fontWeight: 400,
    color: '#4B4B4B',
  },
  backgroundColor: '#FFFFFF',
  sizeId: 'redbook',
}

// Inside isEditorState:
typeof state.signaturePosition === 'string' &&
SIGNATURE_POSITIONS.has(state.signaturePosition) &&

// Inside parseStoredState, after JSON.parse:
const candidate =
  value && typeof value === 'object'
    ? {
        ...value,
        ...(!('signature' in value) ? { signature: '' } : {}),
        ...(!('signaturePosition' in value)
          ? { signaturePosition: 'bottom-left' as const }
          : {}),
      }
    : value
```

- [ ] **Step 4: Run the state tests and verify success**

Run: `npm test -- --run src/state/editorState.test.ts`

Expected: all state tests PASS.

- [ ] **Step 5: Commit the state change**

```bash
git add src/types.ts src/state/editorState.ts src/state/editorState.test.ts
git commit -m "feat: persist signature position"
```

### Task 2: Add the accessible six-position picker

**Files:**
- Create: `src/components/SignaturePositionPicker.tsx`
- Create: `src/components/SignaturePositionPicker.test.tsx`
- Modify: `src/components/EditorPanel.tsx`

- [ ] **Step 1: Write the failing component test**

Create `src/components/SignaturePositionPicker.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { SignaturePositionPicker } from './SignaturePositionPicker'

it('renders six positions and reports the selected position', async () => {
  const user = userEvent.setup()
  const onChange = vi.fn()

  render(<SignaturePositionPicker value="bottom-left" onChange={onChange} />)

  expect(screen.getAllByRole('button')).toHaveLength(6)
  expect(screen.getByRole('button', { name: '左下' })).toHaveAttribute('aria-pressed', 'true')

  await user.click(screen.getByRole('button', { name: '上中' }))
  expect(onChange).toHaveBeenCalledWith('top-center')
})
```

- [ ] **Step 2: Run the picker test and verify failure**

Run: `npm test -- --run src/components/SignaturePositionPicker.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the picker**

Create `src/components/SignaturePositionPicker.tsx`:

```tsx
import type { SignaturePosition } from '../types'

type SignaturePositionPickerProps = {
  value: SignaturePosition
  onChange: (value: SignaturePosition) => void
}

const POSITIONS: Array<{ value: SignaturePosition; label: string }> = [
  { value: 'top-left', label: '左上' },
  { value: 'top-center', label: '上中' },
  { value: 'top-right', label: '右上' },
  { value: 'bottom-left', label: '左下' },
  { value: 'bottom-center', label: '下中' },
  { value: 'bottom-right', label: '右下' },
]

export function SignaturePositionPicker({ value, onChange }: SignaturePositionPickerProps) {
  return (
    <div className="signature-position-control">
      <span className="control-label" id="signature-position-label">署名位置</span>
      <div className="signature-position-grid" aria-labelledby="signature-position-label">
        {POSITIONS.map((position) => (
          <button
            type="button"
            key={position.value}
            aria-label={position.label}
            aria-pressed={value === position.value}
            onClick={() => onChange(position.value)}
          >
            <span className={`position-mark position-mark--${position.value}`} aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  )
}
```

In `EditorPanel.tsx`, import the picker, reduce title/body rows to `2` and `3`, and group the signature field with the picker:

```tsx
<div className="signature-row">
  <label className="field-control signature-field">
    <span>署名</span>
    <input
      aria-label="署名文字"
      type="text"
      placeholder="例如：摄影 / 林野"
      value={state.signature}
      onChange={(event) => onChange({ signature: event.target.value })}
    />
  </label>
  <SignaturePositionPicker
    value={state.signaturePosition}
    onChange={(signaturePosition) => onChange({ signaturePosition })}
  />
</div>
```

- [ ] **Step 4: Run picker and app tests**

Run: `npm test -- --run src/components/SignaturePositionPicker.test.tsx src/App.test.tsx`

Expected: picker test PASS; existing app tests remain PASS.

- [ ] **Step 5: Commit the picker**

```bash
git add src/components/SignaturePositionPicker.tsx src/components/SignaturePositionPicker.test.tsx src/components/EditorPanel.tsx
git commit -m "feat: add signature position picker"
```

### Task 3: Position the preview signature in all six locations

**Files:**
- Modify: `src/components/PreviewCanvas.tsx`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Replace the fixed-position app test with interaction coverage**

Use a table to verify every selector changes the preview to the expected edge and alignment:

```tsx
it.each([
  ['左上', { top: '6%', textAlign: 'left' }],
  ['上中', { top: '6%', textAlign: 'center' }],
  ['右上', { top: '6%', textAlign: 'right' }],
  ['左下', { bottom: '6%', textAlign: 'left' }],
  ['下中', { bottom: '6%', textAlign: 'center' }],
  ['右下', { bottom: '6%', textAlign: 'right' }],
])('moves the signature to %s', async (label, expectedStyle) => {
  const user = userEvent.setup()
  render(<App />)

  await user.type(screen.getByLabelText('署名文字'), '摄影 / 林野')
  await user.click(screen.getByRole('button', { name: label }))

  expect(screen.getByTestId('preview-signature')).toHaveStyle(expectedStyle)
})
```

- [ ] **Step 2: Run the app test and verify failure**

Run: `npm test -- --run src/App.test.tsx`

Expected: position cases other than left-bottom FAIL because preview placement is fixed.

- [ ] **Step 3: Derive explicit preview styles from state**

Add a helper in `PreviewCanvas.tsx` and spread its result into the signature style:

```ts
function getSignaturePositionStyle(position: SignaturePosition): React.CSSProperties {
  const isTop = position.startsWith('top-')
  const alignment = position.endsWith('-left')
    ? 'left'
    : position.endsWith('-right')
      ? 'right'
      : 'center'

  return {
    top: isTop ? '6%' : undefined,
    bottom: isTop ? undefined : '6%',
    textAlign: alignment,
  }
}
```

Use `left: 11%` and `right: 11%` from `.preview-signature`, so centered and edge-aligned variants share the same safe width. Spread `getSignaturePositionStyle(state.signaturePosition)` into the inline style before typography values.

- [ ] **Step 4: Run the app tests and verify success**

Run: `npm test -- --run src/App.test.tsx`

Expected: all app tests PASS for all six positions.

- [ ] **Step 5: Commit preview positioning**

```bash
git add src/components/PreviewCanvas.tsx src/App.test.tsx
git commit -m "feat: render six signature positions"
```

### Task 4: Compact the editor panel without hiding controls

**Files:**
- Modify: `src/components/TextStyleControls.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Put font and weight in one semantic row**

Wrap the existing font and weight labels in one grid and give the font column more space:

```tsx
<div className="control-row control-row--font">
  <label className="field-control">
    <span>{name}字体</span>
    <select
      aria-label={`${name}字体`}
      value={value.fontId}
      onChange={(event) => update({ fontId: event.target.value })}
    >
      {FONT_PRESETS.map((font) => (
        <option key={font.id} value={font.id}>
          {font.label} · {font.usage}
        </option>
      ))}
    </select>
  </label>
  <label className="field-control">
    <span>{name}粗细</span>
    <select
      aria-label={`${name}粗细`}
      value={value.fontWeight}
      onChange={(event) => update({ fontWeight: Number(event.target.value) })}
    >
      <option value="400">常规</option>
      <option value="600">中粗</option>
      <option value="700">粗体</option>
    </select>
  </label>
</div>
```

- [ ] **Step 2: Apply compact desktop styles**

Update `src/styles.css` with these dimensions and retain existing focus states:

```css
.editor-panel { padding: 4px 18px 18px; }
.settings-section { padding: 13px 0; }
.settings-section legend { margin-bottom: 9px; }
.field-control { gap: 5px; }
.field-control + .field-control { margin-top: 8px; }
textarea { min-height: 0; padding: 7px 10px; line-height: 1.45; }
select, input[type='number'], input[type='text'], .hex-input { height: 34px; }
.control-row { gap: 8px; margin-top: 0; }
.control-row--font { grid-template-columns: minmax(0, 1.65fr) minmax(92px, .8fr); }
.font-size-slider { gap: 5px; margin-top: 8px; }
.color-control { margin-top: 8px; }
.color-field { margin-top: 8px; }
.color-picker { height: 34px; }
.palette-toggle { height: 30px; }
.size-grid { grid-template-columns: repeat(3, 1fr); gap: 6px; }
.size-option { min-height: 46px; padding: 6px 7px; }
.signature-row { display: grid; grid-template-columns: minmax(0, 1fr) 126px; gap: 10px; align-items: end; }
.signature-position-control { display: grid; gap: 5px; }
.signature-position-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; }
.signature-position-grid button { position: relative; height: 16px; padding: 0; border: 1px solid #d8d8d8; border-radius: 4px; background: #fff; color: #777; cursor: pointer; }
.signature-position-grid button[aria-pressed='true'] { border-color: #171717; background: #171717; color: #fff; }
.position-mark { position: absolute; width: 3px; height: 3px; border-radius: 50%; background: currentColor; }
```

Define each `.position-mark--top-left` through `.position-mark--bottom-right` with `top`/`bottom: 3px`, `left`/`right: 4px`, or `left: 50%; transform: translateX(-50%)`. At `max-width: 900px`, preserve the existing stacked page and allow the content fields to use available width. At `max-width: 560px`, switch `.signature-row` to one column and keep the picker at a maximum width of `180px`.

- [ ] **Step 3: Run automated verification**

Run: `npm test -- --run`

Expected: all tests PASS.

Run: `npm run build`

Expected: TypeScript and Vite build complete with exit code 0.

- [ ] **Step 4: Verify the rendered layout in the in-app browser**

At `http://127.0.0.1:5173/`:

1. Use a desktop viewport at least 1440×900 and confirm the editor's main controls are visible without vertical scrolling.
2. Enter a signature and click all six position buttons; confirm each moves immediately and remains within the canvas safe area.
3. Change size presets, title/body styles, and colors; confirm the compact layout did not alter existing behavior.
4. Check a 390px-wide mobile viewport; confirm controls remain usable, no horizontal overflow appears, and the preview remains below the editor.
5. Download one PNG with a top-right signature and compare its placement with the preview.

- [ ] **Step 5: Commit compact layout and verification fixes**

```bash
git add src/components/TextStyleControls.tsx src/styles.css
git commit -m "style: compact the editor controls"
```

### Task 5: Final regression check

**Files:**
- Verify: all changed source and test files

- [ ] **Step 1: Run the complete test suite**

Run: `npm test -- --run`

Expected: all tests PASS with no unhandled errors.

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: build exits with code 0 and writes the production bundle to `dist/`.

- [ ] **Step 3: Inspect the final diff**

Run: `git diff --check && git status --short`

Expected: no whitespace errors; only intended implementation files are modified.

- [ ] **Step 4: Commit any final verified adjustments**

If verification required a source adjustment, stage only those files and commit them with:

```bash
git commit -m "fix: finalize signature layout"
```

If no adjustment was required, do not create an empty commit.
