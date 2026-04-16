# Inbox Zero — Changelog

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
- Manual trigger only — accessible via the "Inbox Zero → Refresh Subscriptions" menu in the Sheet. Clears and rewrites the tab on every run (no stale rows)
- Pushed via `clasp push --force`

## [Unreleased]

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
- Organized all files into /Users/chase/Developer/chase/portfolio/inbox-zero/
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
