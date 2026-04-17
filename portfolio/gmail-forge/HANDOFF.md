# Gmail Forge — Handoff

## Quick State

| Field | Value |
|---|---|
| **Focus** | Phase 3 LIVE · daily report extended to show archived mail · project renamed from "Inbox Zero" |
| **Last touch** | Apr 16, 2026 — renamed to Gmail Forge; daily report now includes auto-archived section + totals line |
| **Next** | Load Chrome extension → run "Gmail Forge → Refresh Subscriptions" from Sheet menu to backfill → monitor Review Queue → eventually enable GEMINI mode → rename Apps Script project + update Spend Radar Script Properties (manual, off-filesystem) |
| **Script ID** | `1xCONJKIfWzFwdS29I4M_r5CuhebILiQAlFJHtfkjzYnjP-NKD_90jqQI` |
| **Editor URL** | https://script.google.com/d/1xCONJKIfWzFwdS29I4M_r5CuhebILiQAlFJHtfkjzYnjP-NKD_90jqQI/edit |
| **Google Sheet** | https://docs.google.com/spreadsheets/d/1OT1Jtrp2jaVPVUCZGKnFwf8NwAK0h3PA447VZHYJP54/edit |
| **Filter count** | 69 (XML) + 69 (JS rules mirroring XML) |
| **File location** | `/Users/chase/Developer/chase/portfolio/gmail-forge/` |
| **Classifier mode** | `RULES_ONLY` (Gemini free-tier quota exhausted; switch to `GEMINI` once billing enabled) |

---

## System Status — All Green ✅

- [x] Apps Script deployed via clasp (Apr 16)
- [x] Script Properties set: `CLASSIFIER_MODE=RULES_ONLY`, `GEMINI_API_KEY`, `SHEET_ID`, `NEWSLETTER_TO_ALIASES` (2 aliases)
- [x] `setupTrigger()` confirmed — 5-min trigger already existed from prior session
- [x] `healthCheck()` — all green: config OK, trigger present (1), sheet accessible
- [x] `testRun()` — clean run; all swept emails matched existing rules
- [x] Chrome extension — `npm install` + `npm run validate` passed; ready to load unpacked
- [x] Review Queue sheet tab — auto-created on first unknown sender; deduplicates by email
- [x] Subscriptions tab — menu-driven refresh; scans `label:Receipt` last 180d for recurring senders

---

## Remaining / Next Steps

### Code (done this session ✅)
- [x] **Daily report extended** — searches inbox AND archived separately; new `🗄️ Auto-archived today` section + `📊 Total` line
- [x] **Renamed to Gmail Forge** — directory, all docs, downstream references (spend-radar, spend-clarity, job-search-hq, funded-ios, portfolio root)

### Still pending
- [ ] **Load Chrome extension** — Chrome → `chrome://extensions` → Developer mode → Load unpacked → select `/Users/chase/Developer/chase/portfolio/gmail-forge/extension/`; configure popup (mode + API key)
- [ ] **Review Queue habit** — check "Review Queue" tab in the Google Sheet periodically; fill in "Assign Label" column; add confirmed senders to `rules.gs` + `gmail-filters.xml`
- [ ] **Enable Gemini** — when ready: enable billing on the GCP project tied to `GEMINI_API_KEY`, then change `CLASSIFIER_MODE` back to `GEMINI` in Script Properties

### Manual off-filesystem renames (not in git)
- [ ] **Google Apps Script console** — rename project "Inbox Zero" → "Gmail Forge" at script.google.com
- [ ] **Spend Radar Script Properties** — add `GMAIL_FORGE_WEB_APP_URL` + `GMAIL_FORGE_TRIGGER_TOKEN` (same values as the old `INBOX_ZERO_*` keys), verify Refresh All Apps works, delete old keys
- [ ] **Chrome extension** — after loading unpacked, verify popup title shows "Gmail Forge" (manifest.json already updated)
- [ ] **Asana** — rename project "Inbox Zero Build" → "Gmail Forge Build" (GID `1213891408033292` unchanged)

---

## Adding a Rule from Review Queue

When a new sender appears in the Review Queue tab:
1. Identify domain (e.g., `cursor.com`) or exact address
2. Add domain to correct label in `apps-script/rules.gs`
3. Add matching entry to `gmail-filters.xml`
4. Run `cd apps-script && npx clasp push --force` to deploy
5. Re-import `gmail-filters.xml` into Gmail (Settings → Filters → Import)
6. Check "Added to rules.gs?" column in sheet

---

## Architecture

```
Layer 1: Gmail XML filters (69 rules, server-side, instant)
    ↓ unknown senders fall through
Layer 2: Apps Script (every 5 min)
    → Match against rules.gs (same 69 rules in JS)
    → If match → label + archive
    → If no match (RULES_ONLY) → log to "Review Queue" sheet tab (deduplicated)
    → If no match (GEMINI) → Gemini classifies → label + archive → log to "New Senders" tab
Layer 3: Chrome extension (manual)
    → Tab bar for quick label navigation
    → Sort button for on-demand AI classification
```

---

## Script Properties Reference

| Property | Value | Notes |
|---|---|---|
| `CLASSIFIER_MODE` | `RULES_ONLY` | Change to `GEMINI` once billing enabled |
| `GEMINI_API_KEY` | set (length 53) | From aistudio.google.com |
| `SHEET_ID` | set | Google Sheet for logging |
| `NEWSLETTER_TO_ALIASES` | set (2) | iCloud Hide My Email addresses for Substack/Crossword — not in git |

---

## Resuming in a New Session

Run `./scripts/handoff` for a quick project health check. Open Claude Code from `/Users/chase/Developer/chase/portfolio/gmail-forge/` — CLAUDE.md auto-loads full context. See `prompts/resume-phase3-live.md` for a ready-to-paste session starter.
