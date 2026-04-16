# Learnings — Rollertask Tycoon Web

> Mistakes, fixes, and "aha" moments captured from real sessions.
> **AI tools:** read this at session start alongside CLAUDE.md for project-specific gotchas.
> **Chase:** append an entry any time something goes wrong or clicks.

---

## Format

### YYYY-MM-DD — Short title
**What happened:** 1-2 sentences describing the problem or discovery.
**Root cause:** Why it happened — the non-obvious part.
**Fix / lesson:** What was done, or what to do differently next time.
**Tags:** gotcha | react | swift | python | git | deploy | supabase | ...

---

## Entries

### 2026-04-14 — Ring-based SVG icon replaced with portfolio-standard text logo
**What happened:** Generated a Clarity-family ring icon (dark tile + rings + coaster glyph) and deployed it as `logo.svg`, `favicon.svg`, and all PNGs. User then asked for the bold text logo (ROLLER / TASK) instead — two deploys were needed.
**Root cause:** There are two logo systems in this portfolio: the Clarity-family ring icon (used for iOS AppIcon + PNG web assets) and the text-based SVG logo (used for `logo.svg`, `favicon.svg`, in-app UI). Conflated the two.
**Fix / lesson:** For web apps, `logo.svg` and `favicon.svg` are always the text format from `PORTFOLIO_APP_LOGO.md`. The ring PNG is only for `logo192.png`, `logo512.png`, `apple-touch-icon.png` (PWA manifest home-screen icons). Keep them separate.
**Tags:** gotcha, assets, branding
