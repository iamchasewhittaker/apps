# MVP Audit — Claude Usage Tool
*Audit date: 2026-04-12 · Framework: 6-step MVP (Capture → Validate → Define → Build → Ship → Learn)*

*Status: Archived — 2026-04-04.*

---

**What it is:** macOS menu bar app (Electron + React + TypeScript + Vite) that tracks Claude Max subscription usage and API costs by scraping claude.ai/settings/usage and platform.claude.com/settings/billing — optionally uses the Anthropic Admin API.

**Current step (per the framework):** Archived (was at Step 5 — Ship)

**Evidence for that step:** v0.10.0 shipped. Distributable `.dmg` via electron-builder. Tray icon + popup window, 60-second auto-refresh loop. Both scraping and Admin API paths implemented. IPC handlers documented. The app worked and solved a real problem (Claude cost visibility).

**What's missing to legitimately be at this step:** No formal Step 6 (Learn) retro. The archival reason is not documented in the files — the README notes it as archived but doesn't say why. Guesses: maintenance burden from Claude.ai UI changes breaking the scraper, or shifted focus away from utility apps.

**Biggest risk/red flag:** The core mechanism (DOM scraping) is brittle by design. Any Claude.ai UI change could silently break usage reporting. The Admin API path is more reliable but requires key management. This fragility is likely part of why it was archived.

**Recommended next action:** No action needed. If Claude.ai ever exposes a proper usage API, this could be revived with a more stable data source. In the meantime: document the archival reason in the README so future-you knows why this was shelved, not just that it was.
