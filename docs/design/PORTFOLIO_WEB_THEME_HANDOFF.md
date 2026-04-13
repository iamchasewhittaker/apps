# Portfolio Web Theme — Alignment Handoff

> Goal: Make all three React apps feel like a suite. Same dark base, same font, same spacing rhythm. Each app keeps its own accent color.

---

## Current State

| App | Style object | Background | Text | Font | Accent |
|-----|-------------|-----------|------|------|--------|
| Wellness Tracker | `T` in `theme.js` | `#0d0d0f` | `#e8e6e0` (warm) | system-ui | `#3d9970` (green) |
| Job Search HQ | `s` in `constants.js` | `#0f1117` | `#e5e7eb` (cool) | DM Sans, system-ui | `#3b82f6` (blue) |
| App Forge | `C` inline in `App.jsx` | `#0d0d0f` | `#e8e6e0` (warm) | system-ui | `#1D9E75` teal / `#9F8AE8` purple |
| Knowledge Base | inline throughout | `#09090b` | mixed | system-ui | `#10b981` (green) |

**Problems to fix:**
- Background differs: `#09090b`, `#0d0d0f`, `#0f1117` — pick one
- Text differs: warm `#e8e6e0` vs cool `#e5e7eb`
- Font: Job Search has DM Sans; others fall back to system-ui
- Surface/border colors are all slightly different

---

## Target Token Set

These become the shared base for all apps. Each app keeps its own `ACCENT`.

```js
// BASE — same for all apps
const BASE = {
  bg:          "#0f1117",   // single dark bg (was #0d0d0f / #09090b / #0f1117)
  surface:     "#161b27",   // card / panel backgrounds
  surfaceAlt:  "#1f2937",   // hover, selected states
  border:      "#1f2937",   // default borders
  borderLight: "#374151",   // slightly visible borders
  text:        "#f3f4f6",   // primary text (headings, values)
  textSub:     "#e5e7eb",   // secondary text (body)
  muted:       "#6b7280",   // labels, placeholders, metadata
  dim:         "#374151",   // disabled, faint text
  font:        "'DM Sans', system-ui, sans-serif",
};

// PER-APP — each app defines its own
const ACCENT = "#3b82f6";  // Job Search: blue
// const ACCENT = "#8b5cf6";  // App Forge: purple
// const ACCENT = "#10b981";  // Knowledge Base: green
// const ACCENT = "#3d9970";  // Wellness: green

// Derived from accent (copy these formulas):
const ACCENT_BG  = ACCENT + "18";  // e.g. "#3b82f618" — for chip/badge backgrounds
const ACCENT_BDR = ACCENT + "35";  // e.g. "#3b82f635" — for accent borders
```

---

## Per-App Migration Steps

### 1. Job Search HQ — `src/constants.js`

**Effort: Low.** Already uses `s` object. Just update the color values to match BASE.

Changes to make in the `s` object:
```js
// BEFORE                           // AFTER
root: { background: "#0f1117" }     // already correct — keep
// Update surfaces: "#1f2937" → "#161b27" (cards, panels)
// Update text: keep "#f3f4f6" for headings, "#e5e7eb" for body
// No font change needed — already has DM Sans
```

Key tokens to align (find and update):
- `"#111827"` (darker surface) → `#161b27`
- Text is already `#f3f4f6` / `#e5e7eb` / `#6b7280` — these are correct, keep them
- Accent stays `#3b82f6`

**Net change:** Minimal — mostly surface and border values.

---

### 2. Wellness Tracker — `src/theme.js`

**Effort: Low.** `T` object already centralized. Update values.

```js
// Update these T keys:
bg:          "#0f1117",  // was #0d0d0f
surface:     "#161b27",  // was #1a1a1f
border:      "#1f2937",  // was #2a2a35
text:        "#f3f4f6",  // was #e8e6e0 (warm) — move to cool
muted:       "#6b7280",  // was #6b6a72

// Keep app accent:
accent:      "#3d9970",  // unchanged
```

Add DM Sans to `index.html` or the global `<style>` tag:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

Update `App.jsx` root style:
```js
fontFamily: "'DM Sans', system-ui, sans-serif",
```

---

### 3. App Forge — `src/App.jsx`

**Effort: Medium.** `C` object is inline in App.jsx monolith. Same approach — update values.

```js
// Update C object:
bg:          "#0f1117",  // was #0d0d0f
surface:     "#161b27",  // was #111116
border:      "#1f2937",  // was #1e1e28
borderLight: "#374151",  // was #2a2a36
text:        "#f3f4f6",  // was #e8e6e0 (warm)
muted:       "#6b7280",  // was #7a7888
```

Add DM Sans font same as Wellness.

Keep accents: `purple: "#8b5cf6"`, `teal: "#1D9E75"` (app-specific).

---

### 4. Knowledge Base — `src/constants.js`

**Effort: Medium.** Styles are scattered inline throughout the components. 

Best approach: add a `C` or `s` style object at the top of `constants.js` (it already has one for some things) and do a find-replace pass to pull hardcoded colors out.

Inline colors to replace:
- `"#09090b"` → `"#0f1117"` (background)
- `"#18181b"` → `"#161b27"` (surface)
- `"#27272a"` → `"#1f2937"` (border)
- `"#a1a1aa"` → `"#6b7280"` (muted text)
- Accent stays `#10b981`

---

## Session Start Prompt

```
Read CLAUDE.md and HANDOFF.md first, then the relevant app's CLAUDE.md.

Goal: Apply the shared design token set from docs/design/PORTFOLIO_WEB_THEME_HANDOFF.md 
to [APP NAME] at portfolio/[app-folder]/.

Target tokens (see handoff for full list):
  bg: #0f1117 · surface: #161b27 · border: #1f2937 · borderLight: #374151
  text: #f3f4f6 · textSub: #e5e7eb · muted: #6b7280
  font: 'DM Sans', system-ui, sans-serif

Keep the app's own accent color unchanged.
Do NOT change layout, component structure, or any logic — colors and font only.

Verify: npm start, visually scan all tabs for readability.
Update CHANGELOG [Unreleased] when done.
```

---

## Suggested Order

1. **Job Search HQ** — fewest changes, best-aligned already. Good first test.
2. **Wellness Tracker** — centralized `T` object, easy update.
3. **App Forge** — monolith but `C` object is centralized.
4. **Knowledge Base** — most scattered, save for last.

---

## What NOT to do

- Don't extract a shared npm package or shared file — inline styles are the pattern; just align the values
- Don't change any component structure, layout, or logic
- Don't change accent colors — those are intentionally app-specific
- Don't add Tailwind or CSS modules
