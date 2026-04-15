# Learnings — Claude Usage Tool

> Mistakes, surprises, and "aha" moments. AI tools read this at session start.

---

| Date | What happened | Lesson |
|------|---------------|--------|
| 2026-04-14 | Reactivated from archive | DOM scraping is fragile — any claude.ai UI change silently breaks data extraction. Admin API path is more reliable but requires manual key management. |
| 2026-04-14 | Electron 28 + platform.claude.com | platform.claude.com crashes in Electron 28 — workaround opens login in system browser via shell.openExternal() |
