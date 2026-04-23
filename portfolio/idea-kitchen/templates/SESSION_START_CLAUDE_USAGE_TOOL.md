# SESSION_START — Claude Usage Tool Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Claude Usage Tool is a functional v0.10.0 Electron app.
**App:** Claude Usage Tool
**Slug:** claude-usage-tool
**One-liner:** macOS menu-bar monitor for Claude Code usage — shows token counts, session costs, and daily/weekly totals scraped from the Claude Code admin API.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The app is functional; decisions are made.

---

## What to produce

All six STEP 6 artifacts (downloadable panels, not code blocks in chat). Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/claude-usage-tool`
2. **BRANDING.md** — developer-tool aesthetic, Claude purple/indigo accent, menu-bar app conventions
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect v0.10.0 shipped scope; note scraper may be broken; V1 = fix + stable monitor
5. **APP_FLOW.md** — document the scrape → parse → menu bar render → detail panel flow
6. **SESSION_START_claude-usage-tool.md** — stub only

Output paths: `portfolio/claude-usage-tool/docs/`

---

## App context — CLAUDE.md

**Version:** v0.10.0
**Stack:** Electron 28 + React 18 + TypeScript + Vite — the only TypeScript app in the portfolio
**Storage:** electron-store (persistent across restarts)
**URL:** local Electron app
**Entry:** `electron/main.ts` + `src/App.tsx`
**Linear:** [Claude Usage Tool](https://linear.app/whittaker/project/claude-usage-tool-a002c92c1688)

**What this app is:**
A macOS menu-bar app that monitors Claude Code usage. Scrapes token counts and cost data from the Claude Code admin/stats API, renders a compact menu-bar summary (tokens today, cost today), and opens a detail panel with daily/weekly/monthly history. Built because Claude Code doesn't expose usage data in an easily digestible format.

**Architecture:**
- `electron/main.ts` — main process: scraper (polling), admin API calls, preload bridge
- `electron/adminApi.ts` — Claude admin API integration
- `electron/preload.ts` — secure IPC bridge to renderer
- `src/App.tsx` + `src/components/` — React + TypeScript UI
- `electron-store` — persists usage history across restarts

**Known issue:**
Scraper may be broken (Claude Code API shape may have changed). Needs verification and possibly a fix before the app is reliably usable.

**Stack exception:**
TypeScript is the only exception to the portfolio "no TypeScript" convention. Justified here because Electron main process type safety is critical (IPC, native APIs).

**Brand system:**
- Claude purple/indigo accent — clearly Claude-related
- Menu-bar app conventions: compact, fast, non-intrusive
- Voice: precise — "14.2k tokens, $0.43 today"

---

## App context — HANDOFF.md

**Version:** v0.10.0
**Focus:** Scraper reliability uncertain. Core UI is solid.
**Last touch:** 2026-04-21

**Next:**
1. Verify scraper is still working against current Claude Code API
2. If broken: audit `electron/adminApi.ts` and `electron/main.ts` for API shape changes
3. Add error state in menu bar (e.g., "⚠ offline" when scraper fails)
4. Add configurable polling interval (currently hardcoded)
