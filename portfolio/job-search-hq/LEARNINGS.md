# Learnings — Job Search HQ

> Mistakes, fixes, and "aha" moments captured from real sessions.
> **AI tools:** read this at session start alongside CLAUDE.md for project-specific gotchas.
> **Chase:** append an entry any time something goes wrong or clicks.

---

## Format

### YYYY-MM-DD — Short title
**What happened:** 1-2 sentences describing the problem or discovery.
**Root cause:** Why it happened — the non-obvious part.
**Fix / lesson:** What was done, or what to do differently next time.
**Tags:** gotcha | react | git | deploy | supabase | python | api | ...

---

## Entries

### 2026-04-13 — SVG favicon rendering on macOS
**What happened:** `qlmanage -t -s 512` produces clean PNG renders from SVG files on macOS without needing ImageMagick, rsvg-convert, or any npm packages.
**Root cause:** qlmanage is the Quick Look thumbnail generator — it's on every Mac and handles SVG natively.
**Fix / lesson:** For SVG → PNG conversion in this monorepo, use `qlmanage -t -s <size> -o /tmp <file>.svg && cp /tmp/<file>.svg.png dest.png`. Then `sips -z H W` for resizing.
**Tags:** tooling · icons · svg

### 2026-04-13 — FocusTab needs app/contact data props from App.jsx
**What happened:** FocusTab previously only received `completedBlocks` / `expandedBlock` state. Adding the action queue required passing `applications`, `contacts`, `setAppModal`, `setPrepModal`, `setTab` from App.jsx.
**Root cause:** The queue is derived from live data, not persisted state — it belongs in FocusTab as computed logic.
**Fix / lesson:** Any new feature on FocusTab that reacts to pipeline/contacts data needs those arrays threaded through from App.jsx. The shell owns the data; tabs derive from it.
**Tags:** react · architecture · props
