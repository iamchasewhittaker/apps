# Session Start — Gmail Forge (2026-04-29)

> Paste this at the start of any new Claude Code chat to resume with full context.
> Say: "Read CLAUDE.md and HANDOFF.md first, then this prompt."

---

## Journey so far

- **2026-01-22** — Defined Gmail label taxonomy (11 labels)
- **2026-01-28** — Built gmail-filters.xml with 31 filters and imported into Gmail
- **2026-04-01** — Added TLDR suite, Product Hunt, Polymarket, The Hustle, Puzzmo, Superhuman, Church of Jesus Christ, LinkedIn invitations/messages
- **2026-04-12** — Session 1: 11 new filters (total 47). Session 2: 8 Receipt filters for Spend Clarity, Security label, ZipRecruiter domain upgrade, LinkedIn Messages stays in inbox. Total 60 filters. Created CLAUDE.md, organized into portfolio/
- **2026-04-13** — Phase 2 mislabel audit. Phase 3 automation: Apps Script auto-sorter (auto-sort.gs + rules.gs), Gemini classification, Chrome MV3 extension with label tabs + Sort button + Settings popup
- **2026-04-16** — Renamed Inbox Zero to Gmail Forge (~130 text replacements). Phase 3 go-live: Script Properties set, 5-min trigger confirmed, healthCheck all green, hit Gemini free-tier quota, switched to RULES_ONLY mode. Review Queue feature added. Subscriptions tab added. Chrome extension loaded
- **2026-04-18** — Sort button wired end-to-end (doPost handler). Guide button + overlay inside Gmail. Standalone guide.html minisite. Extension context invalidation fix
- **2026-04-20** — Dashboard view deployed (Version 1 web app). TRIGGER_TOKEN set. NEWSLETTER_TO_ALIASES fixed. Apps Script project renamed to Gmail Forge
- **2026-04-28** — Job Search HQ alignment: subject-keyword matching (5 recruiter regexes), ashbyhq.com + linkedin.com domain filters, filter count 73. Then matchRules_ 3-pass refactor (address then domain then subject), LinkedIn social split (3 addresses to Notification), healthCheck renamed, JobSearch label created

---

## Still needs action

- Monitor: first real job email should auto-tag JobSearch within 5 min and appear in JSHQ InboxPanel
- Triage Review Queue items (Vercel, Tailscale, Chipotle, MACU not yet in rules.gs)
- Enable Gemini when budget allows (currently RULES_ONLY)
- Spend Radar Script Properties: rename INBOX_ZERO_* keys to GMAIL_FORGE_*
- Rename Asana project "Inbox Zero Build" to "Gmail Forge Build"

---

## Gmail Forge state at a glance

| Field | Value |
|-------|-------|
| Version | v0.3 |
| URL | Apps Script |
| Storage key | n/a (Script Properties: CLASSIFIER_MODE, GEMINI_API_KEY, SHEET_ID, NEWSLETTER_TO_ALIASES, TRIGGER_TOKEN) |
| Stack | Apps Script + Chrome MV3 extension + Gmail XML filters |
| Linear | [Gmail Forge](https://linear.app/whittaker/project/gmail-forge-110c46ff126d) |
| Last touch | 2026-04-28 |

---

## Key files for this session

| File | Purpose |
|------|---------|
| portfolio/gmail-forge/CLAUDE.md | App-level instructions |
| portfolio/gmail-forge/HANDOFF.md | Session state + notes |
| apps-script/auto-sort.gs | Engine: 5-min trigger, matchRules_ 3-pass, doGet/doPost, Review Queue logging |
| apps-script/rules.gs | 73 sender rules (address + domain + subjectPatterns) organized by label |
| gmail-filters.xml | 73 XML filters imported into Gmail (server-side instant sort) |
| extension/src/content.js | Chrome extension: toolbar, tab bar, Sort button, Guide overlay |
| apps-script/dashboardData.gs | Dashboard data: label counts, auto-sort stats, review queue info |

---

## Suggested next actions (pick one)

1. Triage Review Queue: classify remaining unknown senders, add to rules.gs + gmail-filters.xml
2. Enable Gemini classification (set CLASSIFIER_MODE=GEMINI once billing enabled)
3. Expand SENDER_RULES coverage by processing Audit tab unknowns
