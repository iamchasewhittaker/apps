# Inbox Zero — Claude Instructions

## Project
Chase Whittaker's Gmail Inbox Zero system. Three-layer architecture: XML filters (instant) → Apps Script auto-sorter (5-min sweep + AI) → Chrome extension (manual UI). No paid tools.

**Owner:** chase.t.whittaker@gmail.com  
**Asana GID:** 1213891408033292  
**Filter file:** `gmail-filters.xml` (import into Gmail when updated)  
**Apps Script:** `apps-script/auto-sort.gs` + `rules.gs` (deploy to script.google.com)  
**Extension:** `extension/` (load unpacked in Chrome)

---

## Critical Rules

- **Job search emails NEVER get archived** — Greenhouse, Lever, Workday, ZipRecruiter, LinkedIn job alerts/InMail always stay in inbox
- **Kassie's Gmail setup is paused** — Chase's inbox only
- **Re-import XML only when filters change** — not daily
- Always check **"Also apply filter to matching conversations"** on import

---

## Daily Report

When Chase says **"report"**, **"email report"**, or **"what's in my inbox"**, run this:

1. Search Gmail for today's emails (`after:YYYY/MM/DD`) — include **all emails**, both read and unread
2. Read each message (subject + sender + snippet is enough)
3. Output the report in this exact format:

```
📧 Email Report — [Date]

🚨 Needs Attention
- [sender] — [subject]

💼 Job Search
- [sender] — [subject]

🧾 Receipt/Finance
- [sender] — [subject]

📦 Notification
- [sender] — [subject]

📅 Calendar/Appointments
- [sender] — [subject]

📰 Newsletter
- [sender] — [subject]

📣 Marketing
- [sender] — [subject]

❄️ Cold Email
- [sender] — [subject]

👤 Personal
- [sender] — [subject]

🔐 Security
- [sender] — [subject]
```

Omit any category with zero emails. After the report, flag any **inbox leakers** (senders not yet covered by a filter) so Chase can decide whether to add them.

---

## Label Taxonomy

| Label | Purpose |
|---|---|
| Newsletter | Substack, blogs, digests |
| Notification | Apps, services, automated alerts |
| Receipt | Financial transactions, order confirmations |
| Calendar | Appointment reminders |
| Cold Email | Unsolicited outreach |
| FYI | Info-only, no action needed |
| Marketing | Promotional emails from brands |
| Follow-up | Chase needs to follow up |
| To Reply | Requires a response |
| Actioned | Completed |
| Personal | Personal contacts |
| Security | Google account alerts, magic links, account activations |

---

## Adding New Filters

When Chase identifies a new sender to filter:
1. Prefer domain-level matching (`from: domain.com`) over individual addresses
2. Add the entry to `gmail-filters.xml` in the correct section
3. Add the matching domain/address to `apps-script/rules.gs` in the correct label
4. Update the filter count in `claude.md` and `roadmap/roadmap.md`
5. Output the updated `gmail-filters.xml` for download/import

**Note:** With the Apps Script running, new senders are auto-classified by AI. You only need to manually add filters for senders you want to lock in permanently (skip AI cost + guarantee correct label).

---

## Current Filter Coverage (69 filters)

**Last updated:** April 12, 2026

| Category | Senders |
|---|---|
| Job Search (whitelist) | greenhouse-mail.io, lever.co, myworkday.com, ziprecruiter.com, jobs-listings@linkedin.com, inmail@linkedin.com |
| Newsletter | Substack alias, substack.com, Readwise, The Marginalian, The Hustle, Polymarket, Product Hunt, TLDR, Word Smarts, The Athletic, The Masters, John Hilton III, Daily Crossword Links, Sporcle, The Twist, Farnam Street, Daily Stoic, Puzzmo, Superhuman, Church of Jesus Christ, Missionary.org, Natia Kurdadze |
| Notification | Amazon, LinkedIn invitations/messages, USPS, ESPN Fantasy, Backblaze, Sunsama, iCloud, Mesh, Obsidian, Supabase |
| Calendar | PEAK ENT (phreesia-mail.com), Kassi Hair Co. (squareup.com), Dental/Weave (getweave.com), Luma Events (luma-mail.com), Google Calendar (calendar-notification@google.com) |
| Receipt | Venmo, Privacy.com, Anthropic, Citi, Safeco, Apple (no_reply@email.apple.com), PayPal, Costco, Target, Uber, DoorDash, Spotify, Google Play, Rocky Mountain Power, Chewy, Enbridge Gas, FASTEL, Nike |
| Marketing | Buck Mason, We Are OLLIN, NOCD, Lakeview, Jack Carr |
| Security | Google (accounts.google.com) |

---

## Import Instructions

1. Gmail → Settings (⚙️) → See all settings → Filters and Blocked Addresses
2. Click **Import filters**
3. Upload `gmail-filters.xml`
4. ✅ Check **"Also apply filter to matching conversations"**
5. Click **Create filters**

---

## Key Rules & Learnings

- Domain-level matching preferred over sender-specific (e.g., `substack.com` not individual addresses)
- **Natia Kurdadze** (natia@space-leads.com) → Newsletter (not Cold Email)
- **Daily Crossword Links** → Newsletter (matched via iCloud Hide My Email alias — see local copy of gmail-filters.xml for actual value)
- Job search senders are whitelisted only — no label, no archive — they stay in inbox naturally
- **ZipRecruiter** is whitelisted at domain level (`ziprecruiter.com`) — catches Phil, alerts, and all ZipRecruiter addresses
- **LinkedIn Messages** (`messages-noreply@linkedin.com`) are labeled Notification but NOT archived — stay in inbox during job search
- The XML file is not in Google Drive — find it in this folder or rebuild from conversation history
- When adding new filters, output a fresh `gmail-filters.xml` for reimport

---

## Automation (Phase 3)

### Apps Script Auto-Sorter
- **Files:** `apps-script/auto-sort.gs` (engine) + `apps-script/rules.gs` (sender rules)
- **Trigger:** 5-minute timer via `setupTrigger()`
- **Flow:** Find unlabeled inbox emails → match against rules.gs → if no match, classify via Gemini (or skip in Rules-only mode) → apply label + archive → log new senders to Google Sheet
- **Config:** Script Properties: `CLASSIFIER_MODE` (`GEMINI`/`RULES_ONLY`), `GEMINI_API_KEY` (for Gemini mode), `SHEET_ID` (optional)
- **Job search protection:** Greenhouse, Lever, Workday, ZipRecruiter, LinkedIn job addresses are whitelisted — never touched

### Chrome Extension
- **Files:** `extension/` directory (MV3)
- **Features:** Label tab bar (matches screenshot), Sort button (AI classification), settings popup
- **Install:** `chrome://extensions` → Developer mode → Load unpacked → select `extension/`

---

## Asana Project

**Project:** Inbox Zero Build  
**GID:** 1213891408033292  
**Status:** 🟢 Green — Phase 3 automation built, pending deployment
