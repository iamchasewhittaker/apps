# Gmail Forge — Changelog

## [Unreleased]

### [Apr 30, 2026] — Newsletters now archived + leaker triage

**What changed**
- **`apps-script/auto-sort.gs`** — removed the `Newsletter` skip-archive line from `shouldSkipArchive_()`. The function now only protects `JobSearch`, `Personal`, and the `NEVER_ARCHIVE_ADDRESSES` list. Newsletters get labeled AND archived in the same sweep.
- **`gmail-filters.xml`** — added `shouldArchive` to all 24 Newsletter entries (Substack, Readwise, Marginalian, Hustle, Polymarket, Product Hunt, TLDR, Word Smarts, Athletic, Masters, John Hilton III, Daily Crossword, Sporcle, Twist, Farnam Street, Daily Stoic, Puzzmo, Superhuman, Church of Jesus Christ, Missionary.org, Natia Kurdadze, plus the substack.com domain rule and the iCloud aliases). Total `shouldArchive` lines: 63.
- **`claude.md`** — flipped the critical rule from "Newsletters are labeled but NOT archived" → "Newsletters are labeled AND archived (changed 2026-04-30)".
- **Apps Script redeployed** via `cd apps-script && npx clasp push --force`.

**Why**
The "newsletters stay in inbox" rule (set 2026-04-27) created exactly the noise it was trying to avoid — Substacks, Daily Stoic, TLDR, etc. piled up in inbox and made the daily review noisy. Newsletters are recurring/digest content; they belong in the `Newsletter` label, archived. Job-search whitelist is still fully protected (different label, different code path).

**Inbox leakers identified (next session)**
Candidates for `rules.gs` updates from today's report:
- `capacities.io` → Notification
- `hi.extra.email` (Extra app) → Notification
- `updates.linear.app` (Linear security alerts) → Security
- `james@toybook.com` → promote to domain rule `toybook.com` (Newsletter)
- GitHub CI notifications hitting `Security` instead of `Notification` — needs sender-specific override

## [Apr 28, 2026] — matchRules_ 3-pass refactor + LinkedIn social split

### What changed
- **`apps-script/auto-sort.gs`** — `matchRules_()` refactored from single-pass to 3-pass: (1) exact address + toAlias across all labels, (2) domain across all labels, (3) subject patterns. Address specificity now overrides domain breadth — a sender explicitly listed in any label's `addresses` wins over a catch-all domain in another label.
- **`apps-script/rules.gs`** — Added `messages-noreply@linkedin.com`, `invitations@linkedin.com`, `updates-noreply@linkedin.com` to Notification addresses. These social/connection notifications were matching the broad `linkedin.com` JobSearch domain and polluting JSHQ's InboxPanel. Job-search addresses (`jobs-listings@`, `inmail@`, `jobs-noreply@`) keep going to JobSearch via domain fallthrough.
- **`healthCheck_jobSearch_()` renamed to `healthCheck_jobSearch()`** — Apps Script hides functions with a trailing underscore from the Run dropdown (private convention). Renamed so it's selectable in the editor.
- **`JobSearch` Gmail label created manually** — Label didn't exist yet because no matching job email had triggered `getOrCreateLabel_()`. Created via Gmail Settings → Labels → Create new label. Required before JSHQ can query by `labelIds=`.
- **`gmail-filters.xml` re-imported** — picked up the 3 new entries from the prior session (ashbyhq.com, linkedin.com, e.linkedin.com).

### Why
Broad domain rules (all of `linkedin.com` → JobSearch) captured connection suggestions and "add this person" recommendations, which aren't job search signals. 3-pass match logic allows precise address-level overrides without restructuring the rules object. JSHQ InboxPanel verified clean: trigger active, JobSearch label exists, label created, system ready for first real job email.

## [Apr 28, 2026] — Job Search HQ alignment

### What changed
- **`apps-script/rules.gs`** — added `subjectPatterns` to the `JobSearch` rule (regex array). Catches recruiter outreach from non-ATS senders: `interview`, `availability`, `phone screen`, `time to chat`, `schedule a/an call|chat|interview|time`. Updated header comment to document the new optional field.
- **`apps-script/auto-sort.gs`** — `matchRules_()` now accepts and matches `subject` against `rule.subjectPatterns` after the domain/address/toAlias checks. `getRulesForMatching_()` propagates the field. Gemini system prompt now lists `JobSearch` with a description (was missing — AI fallback couldn't pick it). Added `jobsearch` / `job search` / `job-search` aliases to `normalizeLabel_()`. New diagnostic `healthCheck_jobSearch_()` logs trigger status, label existence, JobSearch thread count, and a sample of unlabeled inbox threads.
- **`gmail-filters.xml`** — added 3 entries: `ashbyhq.com`, `linkedin.com` (full domain), `e.linkedin.com`. All `shouldNeverSpam`-only (no label, parity with auto-sort).
- **`claude.md`** — bumped filter count 70 → 73 (docs previously said 69 — stale); documented subject-keyword matching + Job Search HQ integration.

### Why
Job Search HQ's InboxPanel queries Gmail via `labelIds=<JobSearch>` (not sender search), so emails must carry that label to surface. Existing rules covered ATS domains but missed recruiters using personal email — those interview invites silently never reached JSHQ. Subject patterns plug that gap.

## [Apr 20, 2026] — Dashboard + go-live polish

### Dashboard view (new)
- Added `apps-script/dashboardData.gs` — data-gathering functions: `getLabelCounts_()` (today / 7d / 30d per label via `GmailApp.search` with 500-thread cap), `getAutoSortTodayCount_()`, `getRecentActivity_(10)`, `getReviewQueueInfo_()`, `getHealthInfo_()`
- Added `apps-script/dashboard.html` — single-page HTML with inline CSS (matches guide.html dark theme); renders stats, label counts table, recent activity table
- Modified `doGet(e)` in `apps-script/auto-sort.gs` — branches on `?view=dashboard`; default path still runs `autoSort()` for Spend Radar's "Refresh All Apps" integration (no breaking change)
- First web app deployment created (Version 1); dashboard confirmed live

### Go-live polish
- Set `TRIGGER_TOKEN` Script Property (UUID) — enables doGet/doPost auth for dashboard + extension Sort button
- Fixed `NEWSLETTER_TO_ALIASES` (was placeholder text; now set to real iCloud aliases for Substack + Puzzmo/crossword)
- Renamed Apps Script project "Inbox Zero Auto-Sort" → "Gmail Forge"
- Added Gmail Forge to root CLAUDE.md portfolio table + Shipyard

## [Apr 18, 2026] — Sort wired + Guide + Context fix

### Sort button — label apply (complete)
- Added `doPost(e)` to `apps-script/auto-sort.gs` — accepts `{ token, applications: [{messageId, label}] }`, applies Gmail labels via `GmailApp.getUserMessageById`, returns `{ results: [{ok, messageId, label}] }`
- `extension/src/content.js` — extracts `data-legacy-message-id` / `data-message-id` from selected `tr` rows; passes `messageId` through `CLASSIFY` message; after results calls `applyLabels()` which POSTs batch to Apps Script web app
- `extension/src/background.js` — threads `messageId` through classify results
- `extension/src/popup.html` + `popup.js` — added Web App URL + Trigger Token fields; saved to `chrome.storage.sync`
- `extension/manifest.json` — added `https://script.google.com/*` + `https://script.googleusercontent.com/*` to `host_permissions`
- Deployed via `cd apps-script && npx clasp push --force`

### Guide button + overlay
- Added `?` circle button to right end of toolbar (after Sort)
- Clicking opens a modal overlay inside Gmail — 5 sections: Toolbar, How Sort Works, Label Guide, Architecture, Settings
- Click outside or `✕` to dismiss; click `?` again to toggle; full dark mode support

### Standalone guide minisite
- `guide.html` — dark-mode single-file minisite; no build step; open directly in browser
- 6 sections: Toolbar preview, Sort flow, Architecture, Labels, Settings, Adding rules

### Extension context invalidation fix
- Added `isContextAlive()` / `onContextDead()` / `safeSendMessage()` / `safeStorageGet()` wrappers in `content.js`
- On context death: removes toolbar, shows "extension reloaded — refresh tab" toast, clears intervals
- Removed now-unused `loadSettings()` function

## [Apr 16, 2026] — Phase 3 Go-Live

### Google-Side Setup (complete)
- Set all Script Properties: `CLASSIFIER_MODE`, `GEMINI_API_KEY`, `SHEET_ID`, `NEWSLETTER_TO_ALIASES` (2 iCloud aliases)
- Confirmed 5-min `autoSort` trigger was already active from prior session (`setupTrigger()` skipped gracefully)
- `healthCheck()` — all green: mode, keys, trigger count (1), sheet access
- `testRun()` — first live sweep; hit Gemini free-tier quota wall (`limit: 0` on all calls)
- Switched `CLASSIFIER_MODE` to `RULES_ONLY` — deterministic rules handle all known senders; unknown senders logged for manual review

### Review Queue (new feature)
- Added `logUnknownToSheet_()` to `apps-script/auto-sort.gs` — logs unmatched senders in RULES_ONLY mode to a "Review Queue" sheet tab
- Deduplicates by email address — each sender appears once regardless of how many sweeps hit them
- Columns: First Seen, Email, Domain, From Header, Subject, Assign Label (Chase fills in), Added to rules.gs? (checkbox)
- Pushed via `clasp push --force`; confirmed working on second `testRun()`

### Chrome Extension
- `npm install` + `npm run validate` — passed clean (0 vulnerabilities, manifest + files OK)
- Ready to load unpacked; not yet loaded in Chrome (remaining step)

### Subscriptions Tab (new feature)
- Added `refreshSubscriptions()` + `onOpen()` menu to `apps-script/auto-sort.gs`
- Scans `label:Receipt newer_than:180d`, groups by sender, keeps recurring senders (≥2 receipts) — writes a new "Subscriptions" tab in the Sheet
- Columns: Service, Sender Domain, Sender Email, Last Amount, Cadence (Weekly/Monthly/Quarterly/Yearly/Irregular), Last Charge, Est. Next Charge, Receipts (180d), Status (Active / Lapsed?)
- Manual trigger only — accessible via the "Gmail Forge → Refresh Subscriptions" menu in the Sheet. Clears and rewrites the tab on every run (no stale rows)
- Pushed via `clasp push --force`

## [Apr 16, 2026] — Rename + Archived Mail Visibility

### Renamed: Inbox Zero → Gmail Forge
- Directory moved: `portfolio/inbox-zero/` → `portfolio/gmail-forge/`
- ~130 text replacements across 48 files: project name, paths, env var names, package names, Chrome extension manifest, Apps Script file headers, all downstream docs (spend-radar, spend-clarity, job-search-hq, funded-ios, portfolio root CLAUDE.md, ROADMAP.md, governance docs, executive reports)
- Env vars renamed: `INBOX_ZERO_WEB_APP_URL` → `GMAIL_FORGE_WEB_APP_URL`, `INBOX_ZERO_TRIGGER_TOKEN` → `GMAIL_FORGE_TRIGGER_TOKEN`
- Off-filesystem renames still pending: Google Apps Script console, Spend Radar Script Properties, Asana

### Daily Report: archived mail now visible
- `CLAUDE.md` / `claude.md` report prompt updated: now runs two Gmail searches — inbox AND archived
- Added `🗄️ Auto-archived today` section showing every email the Apps Script swept + archived
- Added `📊 Total: X inbox / Y archived / X+Y received today` line at report bottom
- Previously invisible: emails auto-archived by the 5-min Apps Script sweep never appeared in the report

## [Apr 13, 2026] — healthCheck()

- Added `healthCheck()` in `apps-script/auto-sort.gs` — logs classifier mode, key presence (length only), trigger count, and sheet access without calling Gemini

### Phase 3 — Automation (Apr 13, 2026)
- Built Google Apps Script auto-sorter (`apps-script/auto-sort.gs`) — runs every 5 min, catches unlabeled inbox emails
- Created JS rules file (`apps-script/rules.gs`) mirroring all 69 XML filters as domain/address objects
- Switched AI provider from OpenAI to Gemini (`gemini-2.0-flash`) for unknown-sender classification
- Added `CLASSIFIER_MODE` toggle with fallback Route A support (`RULES_ONLY`) so automation can run with zero AI/API calls
- Added Google Sheets new-sender logging (logs every AI classification for weekly review)
- Built Chrome extension (`extension/`) with Manifest V3:
  - Label tab bar (Inbox, To Reply, Newsletter, Calendar, Receipt, Notification, Marketing, Cold Email, Security, Personal)
  - AI-powered "Sort" button in Gmail toolbar
  - Settings popup for API key + visible tab configuration
  - Dark mode support
  - Toast notifications
- Created setup README for both Apps Script and Chrome extension

### Phase 2 (Apr 13, 2026)
- Started Phase 2 mislabeled sender audit loop with `roadmap/mislabel-audit.md`
- Completed Apr 13 baseline Newsletter vs Cold Email review; no new confirmed reclassifications, so `gmail-filters.xml` remains unchanged at 69 filters

## [Apr 12, 2026] — Session 2: Filter expansion + system improvements
- Added 8 Receipt filters for Spend Clarity integration (Apple, PayPal, Costco, Target, Uber, DoorDash, Spotify, Google Play) — total now 60
- Added Security label + Google account alerts filter (accounts.google.com)
- Upgraded ZipRecruiter whitelist from address-level to domain-level (ziprecruiter.com)
- LinkedIn Messages: removed shouldArchive so recruiter DMs stay in inbox during job search
- Added 3 inbox leakers from daily report: Jack Carr (Marketing), Obsidian, Supabase (Notification)
- Added Natia Kurdadze (Newsletter); moved PEAK ENT from Notification → Calendar
- Created CLAUDE.md for auto-load in future sessions
- Organized all files into /Users/chase/Developer/chase/portfolio/gmail-forge/
- Created prompts/ folder with Spend Clarity integration prompts
- Fixed cross-session file location: was flat in ~/Downloads/, now in portfolio/

## [Apr 12, 2026] — Session 1: Filter build (11 new filters, total 47)
- Added Mesh, PEAK ENT, Word Smarts, The Athletic, The Masters, John Hilton III BYU, Sporcle, The Twist, Buck Mason, We Are OLLIN, NOCD

## [Apr 1, 2026]
- Added TLDR suite, Product Hunt, Polymarket, The Hustle, Puzzmo, Superhuman, Church of Jesus Christ, LinkedIn invitations/messages

## [Jan 28, 2026] — Initial build
- Built gmail-filters.xml with 31 filters and imported into Gmail

## [Jan 22, 2026]
- Defined Gmail label taxonomy (11 labels)
