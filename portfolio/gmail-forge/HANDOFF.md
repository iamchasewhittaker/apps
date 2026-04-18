# Gmail Forge — Handoff

## Quick State

| Field | Value |
|---|---|
| **Focus** | Phase 3 LIVE · Sort button fully wired (classifies + applies labels via Apps Script doPost) · Guide button + in-extension overlay + standalone guide.html minisite · extension context invalidation bug fixed |
| **Last touch** | Apr 18, 2026 — wired Sort to apply labels; added ? Guide button to toolbar with full overlay; built guide.html minisite; fixed "Extension context invalidated" crash on extension reload |
| **Next** | Off-filesystem renames → Subscriptions backfill → enter Web App URL + Token in popup settings → Gemini when ready |
| **Script ID** | `1xCONJKIfWzFwdS29I4M_r5CuhebILiQAlFJHtfkjzYnjP-NKD_90jqQI` |
| **Editor URL** | https://script.google.com/d/1xCONJKIfWzFwdS29I4M_r5CuhebILiQAlFJHtfkjzYnjP-NKD_90jqQI/edit |
| **Google Sheet** | https://docs.google.com/spreadsheets/d/1OT1Jtrp2jaVPVUCZGKnFwf8NwAK0h3PA447VZHYJP54/edit |
| **Filter count** | 69 (XML) + 69 (JS rules mirroring XML) |
| **File location** | `/Users/chase/Developer/chase/portfolio/gmail-forge/` |
| **Classifier mode** | `RULES_ONLY` (Gemini free-tier quota exhausted; switch to `GEMINI` once billing enabled) |

---

## System Status

- [x] Apps Script deployed via clasp (Apr 16)
- [x] Script Properties set: `CLASSIFIER_MODE=RULES_ONLY`, `GEMINI_API_KEY`, `SHEET_ID`, `NEWSLETTER_TO_ALIASES` (2 aliases)
- [x] `setupTrigger()` confirmed — 5-min trigger active
- [x] `healthCheck()` — all green
- [x] Chrome extension — **loaded in Chrome** (Apr 18)
- [x] Tab bar — working (all 10 tabs visible)
- [x] Sort button — **fully wired**: classifies selected emails + applies labels via Apps Script `doPost` handler
- [x] Guide button (`?`) — added to toolbar; opens overlay with full feature reference inside Gmail
- [x] Standalone `guide.html` minisite — dark-mode, 6 sections, lives at `portfolio/gmail-forge/guide.html`
- [x] Extension context invalidation bug — fixed; graceful teardown + "refresh tab" toast when extension reloads with Gmail open
- [x] Review Queue sheet tab — auto-created on first unknown sender
- [x] Subscriptions tab — menu-driven refresh available; **not yet run**

---

## Remaining / Next Steps

### 1. ~~Wire Sort Button to Apply Labels~~ ✅ DONE (Apr 18)

`doPost(e)` added to `auto-sort.gs`. Extension extracts `data-legacy-message-id` from selected rows, POSTs `{ token, applications: [{messageId, label}] }` to web app. Toast shows "Labeled X email(s)".

**One remaining setup step:** open extension popup → enter Web App URL + Trigger Token (see Script Properties for `TRIGGER_TOKEN`; get deployment URL from script.google.com → Deploy → Manage deployments).

### 2. Off-Filesystem Renames (MANUAL, ~5 min)
- [ ] **Google Apps Script console** — rename "Inbox Zero" → "Gmail Forge" at script.google.com
- [ ] **Spend Radar Script Properties** — rename `INBOX_ZERO_*` keys → `GMAIL_FORGE_*` (same values); verify Refresh All Apps; delete old keys
- [ ] **Asana** — rename "Inbox Zero Build" → "Gmail Forge Build" (GID `1213891408033292`)

### 3. Subscriptions Backfill (MANUAL, ~1 min)
Open [Google Sheet](https://docs.google.com/spreadsheets/d/1OT1Jtrp2jaVPVUCZGKnFwf8NwAK0h3PA447VZHYJP54/edit) → Gmail Forge menu → Refresh Subscriptions. Scans 180 days of `label:Receipt`, surfaces recurring charges.

### 4. Enable Gemini AI (when budget allows)
Enable billing on GCP project tied to `GEMINI_API_KEY` → set `CLASSIFIER_MODE = GEMINI` in Script Properties. Estimated cost: ~pennies/month.

### 5. Review Queue (ongoing habit)
Check "Review Queue" tab in the Sheet weekly. For new senders: add to `rules.gs` + `gmail-filters.xml` → `clasp push --force` → re-import XML in Gmail.

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
