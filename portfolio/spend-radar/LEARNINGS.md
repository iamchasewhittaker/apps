# Learnings — Spend Radar

> Mistakes, fixes, and "aha" moments captured from real sessions.
> **AI tools:** read this at session start alongside CLAUDE.md for project-specific gotchas.
> **Chase:** append an entry any time something goes wrong or clicks.

---

## Format

### YYYY-MM-DD — Short title
**What happened:** 1-2 sentences describing the problem or discovery.
**Root cause:** Why it happened — the non-obvious part.
**Fix / lesson:** What was done, or what to do differently next time.
**Tags:** gotcha | apps-script | gmail | sheets | deploy | clasp | extraction | ...

---

## Entries

### 2026-04-16 — Extraction stays API-free on purpose
**What happened:** Original scope considered calling Claude API from Apps Script to clean up merchant + item strings. Dropped before implementation.
**Root cause:** Introducing an AI API call adds a secret to manage, an egress dependency, a per-run cost, and a latency spike on every `refreshReceipts`. For a personal tracker reading a well-known set of senders, rule-based extraction matches or beats fuzzy LLM output at zero cost.
**Fix / lesson:** Ship `SENDER_RULES` (domain → merchant + itemRe + category) plus a heuristic fallback that parses the `From` display name. The Audit tab surfaces unknowns that need a rule — the human grows the rule set instead of paying an LLM on every run.
**Tags:** architecture, apps-script, extraction, cost

### 2026-04-16 — Clean extraction from Gmail Forge project
**What happened:** Subscriptions logic originally lived in `portfolio/gmail-forge/apps-script/auto-sort.gs`. Split out into its own Apps Script project + `portfolio/spend-radar/` folder.
**Root cause:** Gmail Forge is a time-triggered labeling job — subscriptions tracking is a menu-triggered Sheet refresh with a different UX, different scopes, and a different cadence. Bundling them kept forcing unrelated changes into one deploy.
**Fix / lesson:** Two Apps Script projects, one Sheet (Phase C moves Spend Radar to its own Sheet too). Each project reads `label:Receipt` independently — Gmail Forge writes the label, Spend Radar reads it.
**Tags:** architecture, apps-script, separation

### 2026-04-16 — Standalone scripts cannot use simple `onOpen`
**What happened:** Pasting a bound-script-style `onOpen()` into a standalone Apps Script project did nothing on Sheet reload.
**Root cause:** Standalone scripts (which is what we want so the code is portable) need an **installable** `onOpen` trigger pointed at the target spreadsheet — simple triggers only fire for container-bound scripts.
**Fix / lesson:** `setupOnOpenTrigger()` runs once from the editor, reads `SHEET_ID` from Script Properties, and calls `ScriptApp.newTrigger('onOpen').forSpreadsheet(sheetId).onOpen().create()`. Guard against duplicate triggers. Document this in HANDOFF setup steps.
**Tags:** apps-script, gotcha, triggers

### 2026-04-16 — Cross-project refresh needs a tokenized web app
**What happened:** Wanted one menu click in the Sheet to refresh Spend Radar **and** trigger Gmail Forge's `autoSort()`. Two separate Apps Script projects — no shared in-process call path.
**Root cause:** Apps Script projects are sandboxed. Only way to invoke another project's function is HTTP (a deployed web app) or a shared library.
**Fix / lesson:** Expose Gmail Forge as a tokenized web app (`doGet(e)` validates `e.parameter.token` against a `TRIGGER_TOKEN` Script Property). Spend Radar's `refreshAllApps()` does its own work, then `UrlFetchApp.fetch`es the endpoint. Shared secret stored in Script Properties on both sides — never committed.
**Tags:** apps-script, security, architecture
