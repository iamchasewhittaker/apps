# Handoff — App Forge

> Current state for multi-session / multi-agent work. Update State when you stop or switch tasks.

---

## State

| Field | Value |
|-------|-------|
| **Version** | v8.1 |
| **Branch** | `main` |
| **URL** | app-forge-fawn.vercel.app |
| **Storage key** | `chase_forge_v1` |
| **Focus** | Maintenance / next feature TBD — see ROADMAP.md |
| **Next** | Wire Supabase sync (Phase 3 of rollout, same shared project as Wellness + Job Search) |
| **Blockers** | None |
| **Last touch** | 2026-04-13 — Theme alignment: `C` tokens in `App.jsx` updated to BASE token set (`bg` `#0f1117`, `surface` `#161b27`, `border` `#1f2937`, `borderLight` `#374151`, `text` `#f3f4f6`, `muted` `#6b7280`, `dim` `#374151`); DM Sans Google Fonts link added to `public/index.html`; `theme-color` meta updated to `#0f1117` |

---

## Fresh session prompt

```
Read CLAUDE.md and HANDOFF.md first, then portfolio/app-forge/CLAUDE.md and portfolio/app-forge/HANDOFF.md.

Goal: Continue App Forge at portfolio/app-forge/.

Current state: v8.1 monolith — all tabs in src/App.jsx. C design tokens updated to portfolio BASE palette.

Pick next work from portfolio/app-forge/ROADMAP.md.

Follow existing patterns:
- Single file: everything in src/App.jsx
- C object for design tokens (lines 225–238)
- Inline styles only
- localStorage only (no Supabase yet)

Verify: cd portfolio/app-forge && npm start

Update CHANGELOG [Unreleased], ROADMAP, HANDOFF, root ROADMAP Change Log, root HANDOFF State when done.
```

---

## Key files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Full monolith — all tabs, components, audit engine, data, styles |
| `public/index.html` | Font loading, PWA meta |

## Design tokens (C object, App.jsx lines 225–238)

```js
const C = {
  bg:          "#0f1117",   // BASE
  surface:     "#161b27",   // BASE
  border:      "#1f2937",   // BASE
  borderLight: "#374151",   // BASE
  text:        "#f3f4f6",   // BASE
  muted:       "#6b7280",   // BASE
  dim:         "#374151",   // BASE
  purple:      "#9F8AE8",   // app accent — keep
  teal:        "#1D9E75",   // app accent — keep
  amber:       "#BA7517",   // app accent — keep
  coral:       "#D85A30",   // app accent — keep
  blue:        "#378ADD",   // app accent — keep
};
```
