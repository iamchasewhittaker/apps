# Session Start — Claude Usage Tool (2026-04-29)

> Paste this at the start of any new Claude Code chat to resume with full context.
> Say: "Read CLAUDE.md and HANDOFF.md first, then this prompt."

---

## Journey so far

- **2026-03-20** — v0.9.0: Core scraping engine built. Claude Max/Pro usage bars, API credit balance, auto-refresh every 60s, persistent sessions (electron-store), macOS tray icon with popup window
- **2026-03-25** — v0.10.0: Admin API client (adminApi.ts) for usage/cost reports and credit balance. Dual data path: scraping + Admin API. Activity log showing last fetch times and errors. Platform login crash workaround (opens in system browser)
- **2026-04-14** — Reactivated from projects/archive/ to portfolio/. HANDOFF, LEARNINGS, CHANGELOG, ROADMAP, BRANDING created. Cursor symlink added

---

## Still needs action

- Scraper may be broken (claude.ai DOM likely changed since archival)
- Electron 28 is outdated; update to latest stable
- Add branding/logo per portfolio standard
- platform.claude.com crashes in Electron 28; opens in system browser as workaround

---

## Claude Usage Tool state at a glance

| Field | Value |
|-------|-------|
| Version | v0.10.0 |
| URL | local Electron |
| Storage key | electron-store |
| Stack | Electron 28 + React 18 + TypeScript + Vite |
| Linear | [Claude Usage Tool](https://linear.app/whittaker/project/claude-usage-tool-a002c92c1688) |
| Last touch | 2026-04-14 |

---

## Key files for this session

| File | Purpose |
|------|---------|
| portfolio/claude-usage-tool/CLAUDE.md | App-level instructions |
| portfolio/claude-usage-tool/HANDOFF.md | Session state + notes |
| electron/scraper.ts | Web scraping engine: hidden BrowserWindows to claude.ai + platform.claude.com |
| electron/main.ts | App entry point: tray icon, popup window, IPC, 60s auto-refresh |
| electron/adminApi.ts | Anthropic Admin API client for usage/cost + credit balance |
| src/components/ClaudeMaxUsage.tsx | Usage bars display (scraped data) |
| electron/preload.ts | IPC bridge between main process and renderer |

---

## Suggested next actions (pick one)

1. Assess scraper health: does claude.ai/settings/usage still parse correctly with current DOM?
2. Update Electron from 28 to latest stable
3. Replace scraper with stable API if Anthropic exposes a usage endpoint
