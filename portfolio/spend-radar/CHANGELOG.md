# Changelog — Spend Radar

All notable changes to this project will be documented here.

## [Unreleased]

### Added
- `LEARNINGS.md` — seed entries: API-free extraction decision, clean Gmail Forge split, installable `onOpen` trigger gotcha, cross-project tokenized web app pattern
- `ROADMAP.md` — v0.1 state, V1 backlog (Clarity Budget bridge at top), V2 parked ideas, decisions log
- `CHANGELOG.md` — this file
- `docs/BRANDING.md` — identity sheet (teal/cyan accent `#14b8a6`)
- `apps-script/receipts.gs` — per-receipt extraction → `Receipts` tab (Date, Merchant, Item, Amount, Category, Sender, Source, Gmail Link)
- `apps-script/extraction.gs` — `SENDER_RULES` table (17 merchants) + heuristic fallback (`From` display-name parsing) + prioritized amount regex
- `apps-script/audit.gs` — `auditLastRun()` with 6 rule flags (missing amount, unknown sender needs rule, system sender, recurring unknown, large charge, stale subscription) + `Audit` tab writer
- `apps-script/helpers.gs` — shared utilities (`extractEmail_`, `extractDomain_`, date/cadence math)
- `apps-script/triggers.gs` — `refreshAll()` + `refreshAllApps()` (tokenized `UrlFetchApp` call to Gmail Forge web app)
- `apps-script/subscriptions.gs` — new `createDedicatedSheet()` helper (logs ID + URL to paste into `SHEET_ID`)
- `apps-script/.clasp.json.example` — deploy template
- `apps-script/.gitignore` — blocks `.clasp.json` + `node_modules/`
- `portfolio/spend-radar-web/` — CRA companion dashboard: monthly/yearly totals, subscriptions cards, recent receipts, cancel candidates; reads two published Sheet CSV URLs

### Changed
- `apps-script/subscriptions.gs` — trimmed to menu + `refreshSubscriptions` (pulls helpers from `helpers.gs` + `extraction.gs`); added `Category` column, `Monthly est.` + `Yearly est.` summary rows, extended menu (`Refresh Receipts`, `Refresh All`, `Refresh All Apps`, `Audit Last Run`, `Open Dashboard`)
- `CLAUDE.md` — documents new Script Properties (`GMAIL_FORGE_WEB_APP_URL`, `GMAIL_FORGE_TRIGGER_TOKEN`), dedicated Sheet migration, security note on `TRIGGER_TOKEN` rotation
- `HANDOFF.md` — updated setup steps for dedicated Sheet + web app deploy + web dashboard CSV URLs
- `portfolio/gmail-forge/apps-script/auto-sort.gs` — added `doGet(e)` tokenized web app endpoint for cross-project `Refresh All Apps` button
- `portfolio/gmail-forge/apps-script/DEPLOY-CLASP.md` — documented web app deploy step + `TRIGGER_TOKEN` Script Property

### Fixed
- (none yet — v0.1 initial scaffold)
