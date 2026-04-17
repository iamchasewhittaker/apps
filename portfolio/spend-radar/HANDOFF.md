# Spend Radar — Handoff

## Quick State

| Field | Value |
|---|---|
| **Focus** | Code complete through Phase G. Awaiting user one-time setup (Apps Script projects + web app deploy). |
| **Last touch** | 2026-04-16 — Phases A–G landed (docs, 6-file script split, Receipts/Audit tabs, cross-project button, `spend-radar-web` CRA scaffold) |
| **Next** | User: run one-time setup (below) → verify `Refresh All` + `Audit Last Run` → deploy `spend-radar-web` |
| **Script ID** | not yet created (run `createDedicatedSheet()` first) |
| **Sheet** | dedicated — will be created by `createDedicatedSheet()` |
| **Dashboard** | `portfolio/spend-radar-web/` — deploy to Vercel once CSV URLs are pasted into `src/constants.js` |

---

## Status

### Code (done by Claude)
- [x] `apps-script/subscriptions.gs` — menu, triggers, `refreshSubscriptions`, `createDedicatedSheet`, `debugSubscriptions`, `healthCheck`
- [x] `apps-script/receipts.gs` — `refreshReceipts` + Receipts tab
- [x] `apps-script/extraction.gs` — `SENDER_RULES` (17 merchants) + heuristic fallback + prioritized amount regex
- [x] `apps-script/audit.gs` — `auditLastRun` + 6 flag rules + yellow row shading
- [x] `apps-script/triggers.gs` — `refreshAll`, `refreshAllApps` (tokenized `UrlFetchApp`), `openDashboard`
- [x] `apps-script/helpers.gs` — shared utilities
- [x] `apps-script/.clasp.json.example` + `.gitignore`
- [x] `portfolio/gmail-forge/apps-script/auto-sort.gs` — `doGet(e)` appended
- [x] `portfolio/spend-radar-web/` — CRA scaffold
- [x] Root `CLAUDE.md` — 2 new portfolio table rows
- [x] `LEARNINGS.md`, `ROADMAP.md`, `CHANGELOG.md`, `docs/BRANDING.md`

### User one-time setup (~20 min)
- [ ] **Gmail Forge web app deploy**
  - [ ] `cd portfolio/gmail-forge/apps-script && npx clasp push --force`
  - [ ] script.google.com → Deploy → New deployment → Web app (Execute as Me, Anyone has access). Copy URL.
  - [ ] Script Properties → `TRIGGER_TOKEN` = new UUID
- [ ] **Spend Radar Apps Script project**
  - [ ] Create new project at script.google.com → paste 6 `.gs` files (or deploy via clasp)
  - [ ] Run `createDedicatedSheet()` → copy logged Sheet ID
  - [ ] Script Properties:
    - [ ] `SHEET_ID` = <copied ID>
    - [ ] `GMAIL_FORGE_WEB_APP_URL` = <web app URL from above>
    - [ ] `GMAIL_FORGE_TRIGGER_TOKEN` = <same UUID as `TRIGGER_TOKEN`>
    - [ ] `DASHBOARD_URL` = <spend-radar-web Vercel URL, after Phase E deploy>
  - [ ] Run `setupOnOpenTrigger()` → authorize Gmail + Sheets + UrlFetch
- [ ] **First verification run**
  - [ ] Open Sheet → `Spend Radar → Refresh All` → Subscriptions + Receipts tabs populate
  - [ ] `Audit Last Run` → review Audit tab flags → add unknowns to `SENDER_RULES` → re-run
  - [ ] `Refresh All Apps` → toast confirms both
- [ ] **Web dashboard**
  - [ ] Sheet → File → Share → Publish to web → CSV (do for both `Subscriptions` and `Receipts` tabs)
  - [ ] Paste the two CSV URLs into `portfolio/spend-radar-web/src/constants.js`
  - [ ] Deploy per global CLAUDE.md Vercel-Git Connection:
    ```bash
    vercel project add spend-radar-web --scope iamchasewhittakers-projects
    vercel link --project spend-radar-web --scope iamchasewhittakers-projects --yes
    vercel git connect https://github.com/iamchasewhittaker/apps.git --yes
    vercel --prod
    ```
  - [ ] Paste deployed URL into Spend Radar Script Properties `DASHBOARD_URL`

---

## Verification

| Check | How |
|---|---|
| Sheet menu appears | Reload Sheet; `Spend Radar` menu loaded via `onOpen` installable trigger |
| Subscriptions populated | `Refresh Subscriptions` → rows with Monthly/Yearly est. summary |
| Receipts populated | `Refresh Receipts` → rows sorted by Date desc, Gmail Link works |
| Audit surfaces unknowns | `Audit Last Run` → rows flagged `recurring unknown — add a rule` drive `SENDER_RULES` growth |
| Cross-project refresh | `Refresh All Apps` → toast shows both OK; bad token → toast shows `unauthorized` |
| `healthCheck()` | Logs: `SHEET_ID: set`, `GMAIL_FORGE_*: set`, `onOpen triggers: 1` |

---

## Notes

- **Standalone script gotcha:** `onOpen` is installable-only for standalone scripts. `setupOnOpenTrigger()` must run once after any SHEET_ID change.
- **Token rotation:** regenerate UUID in Gmail Forge `TRIGGER_TOKEN` and Spend Radar `GMAIL_FORGE_TRIGGER_TOKEN` simultaneously if leaked.
- **Clarity Budget bridge** is ROADMAP #1, not shipped yet.
