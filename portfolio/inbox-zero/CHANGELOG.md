# Inbox Zero — Changelog

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
