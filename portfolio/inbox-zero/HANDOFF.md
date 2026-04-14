# Inbox Zero — Handoff

## Quick State

| Field | Value |
|---|---|
| **Focus** | Phase 3 — automation built, pending deployment |
| **Last touch** | Apr 13, 2026 — built Apps Script auto-sorter + Chrome extension |
| **Next** | Deploy Apps Script to script.google.com; load Chrome extension unpacked; test both on live inbox |
| **Filter count** | 69 (XML) + 69 (JS rules mirroring XML) |
| **File location** | `/Users/chase/Developer/chase/portfolio/inbox-zero/` |

---

## Immediate Action Items (before next session)

- [ ] Deploy Apps Script: copy `apps-script/auto-sort.gs` + `rules.gs` to [script.google.com](https://script.google.com), set `CLASSIFIER_MODE` + `GEMINI_API_KEY` in Script Properties, run `setupTrigger()`
- [ ] (Optional) Create a Google Sheet for new-sender logging, set SHEET_ID in Script Properties
- [ ] Load Chrome extension: `chrome://extensions` → Developer mode → Load unpacked → select `extension/`
- [ ] Configure extension: click icon → choose classifier mode (`GEMINI`/`RULES_ONLY`) + set Gemini API key (if needed) → save
- [ ] Fill in iCloud Hide My Email aliases in `rules.gs` toAliases arrays (Substack + Daily Crossword)
- [ ] Run `testRun()` in Apps Script to verify classification on current inbox

---

## Current System State

- **69 XML filters** across: Job Search (whitelist), Newsletter, Notification, Calendar, Receipt, Marketing, Security
- **Apps Script auto-sorter** built: `apps-script/auto-sort.gs` + `rules.gs` — 5-min trigger, rule matching + Gemini classification + Rules-only fallback + Sheets logging
- **Chrome extension** built: `extension/` — label tab bar, Sort button, settings popup, dark mode
- **Daily report workflow** still works — say "report" in a session opened from this folder
- **Phase 2 target:** May 12, 2026 (30-day retrospective)

---

## Architecture

```
Layer 1: Gmail XML filters (69 rules, server-side, instant)
    ↓ unknown senders fall through
Layer 2: Apps Script (every 5 min)
    → Match against rules.gs (same 69 rules in JS)
    → If no match → Gemini classifies (or Rules-only skip) → label + archive
    → Log new sender to Google Sheet
Layer 3: Chrome extension (manual)
    → Tab bar for quick label navigation
    → Sort button for on-demand AI classification
```

---

## Resuming in a New Session

Open Claude Code from `/Users/chase/Developer/chase/portfolio/inbox-zero/` — CLAUDE.md auto-loads full context. Say "report" to run the daily email report, or paste from `prompts/spend-clarity-handshake.md` into a Spend Clarity session.
