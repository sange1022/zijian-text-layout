# Background Export Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make PNG export work when the preview contains an uploaded Blob background image.

**Architecture:** Keep the existing Blob-based upload lifecycle and change only the `html-to-image` render option that corrupts Blob URLs. Lock the behavior with a focused dependency-injected export test.

**Tech Stack:** TypeScript, html-to-image, Vitest.

---

### Task 1: Preserve Blob URLs during export

**Files:**
- Modify: `src/export/exportPng.test.ts`
- Modify: `src/export/exportPng.ts`

- [ ] **Step 1: Write the failing regression assertion**

Require the existing renderer call to contain `cacheBust: false`:

```ts
expect(render).toHaveBeenCalledWith(
  node,
  expect.objectContaining({
    width: 1080,
    height: 1080,
    pixelRatio: 1,
    cacheBust: false,
  }),
)
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- --run src/export/exportPng.test.ts`

Expected: FAIL because the current renderer receives `cacheBust: true`.

- [ ] **Step 3: Implement the root-cause fix**

In `exportPng.ts`, change the render option to:

```ts
cacheBust: false,
```

This leaves `blob:` image URLs unchanged so `html-to-image` can fetch and embed them.

- [ ] **Step 4: Run the targeted test and verify GREEN**

Run: `npm test -- --run src/export/exportPng.test.ts`

Expected: the export test PASS.

- [ ] **Step 5: Commit**

```bash
git add src/export/exportPng.ts src/export/exportPng.test.ts
git commit -m "fix: export posters with background images"
```
