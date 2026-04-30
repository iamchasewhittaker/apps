# Gmail Forge — Roadmap

> **Owner:** Chase Whittaker  
> **Last updated:** April 30, 2026  
> **Approach:** Free Gmail XML filter system + daily Claude review

---

## 🎯 North Star

A fully automated inbox where only emails requiring attention land in the inbox — everything else is sorted, labeled, and archived before Chase ever sees it.

---

## ✅ Phase 1 — MVP (Complete)

**Goal:** Get the core filter system working with zero paid tools.

| Task | Status | Notes |
|---|---|---|
| Define Gmail label taxonomy | ✅ Done | 11 labels: Newsletter, Notification, Receipt, Calendar, Cold Email, FYI, Marketing, Follow-up, To Reply, Actioned, Personal |
| Build gmail-filters.xml | ✅ Done | 73 filters as of Apr 28, 2026 (added ashbyhq.com + full linkedin.com whitelist) |
| Import filters into Gmail | ✅ Done | Applied retroactively to existing emails |
| Whitelist job search senders | ✅ Done | Greenhouse, Lever, Workday, ZipRecruiter, LinkedIn |
| Establish daily review workflow | ✅ Done | Morning email report prompt with Claude |
| Decide on tool approach | ✅ Done | Staying free — no getinboxzero.com |

**MVP Definition of Done:** Newsletters, marketing, and notifications no longer hit the inbox automatically. Job search emails always surface. Daily review takes under 5 minutes.

---

## 🔄 Phase 2 — Iteration (30-Day Review)

**Target:** ~May 12, 2026  
**Goal:** Refine based on real usage. Identify gaps, misclassified emails, and unsustainable patterns.

| Task | Status | Notes |
|---|---|---|
| Track inbox leakers daily | 🔄 In progress | Added via daily Claude report |
| Identify any mislabeled senders | 🔄 In progress | Baseline audit started Apr 13; using `roadmap/mislabel-audit.md` |
| Monthly newsletter unsubscribe audit | ⬜ Pending | Pull open rates; unsubscribe from anything not opened in 30 days |
| Assess daily review sustainability | ⬜ Pending | Is 5-min review realistic long-term? |
| Clean up any duplicate/overlapping filters | ⬜ Pending | Audit XML for redundancies |
| 30-day retrospective | ⬜ Pending | Document what's working, what isn't |

**Questions to answer at 30 days:**
- What senders keep slipping through?
- Are any labels getting misused or ignored?
- Is the manual XML update process too slow?

---

## ✅ Phase 3 — Automation (Complete · Apr 20, 2026)

**Goal:** Reduce or eliminate manual XML updates.

| Task | Status | Notes |
|---|---|---|
| Google Apps Script auto-sorter | ✅ Done | `apps-script/auto-sort.gs` — 5-min trigger, rule matching + Gemini + Rules-only fallback |
| Sender rules in JS (mirrors XML) | ✅ Done | `apps-script/rules.gs` — 69 filters as JS objects |
| New-sender Google Sheets logging | ✅ Done | Built into auto-sort.gs — logs AI classifications to "New Senders" sheet |
| Chrome extension (label tab bar) | ✅ Done | `extension/` — MV3, tab bar + Sort button + settings popup |
| Deploy Apps Script | ✅ Done | clasp push + web app deployment (Version 1, Apr 20) |
| Deploy Chrome extension | ✅ Done | Loaded in Chrome (Apr 18); Sort button wired to doPost |
| Observability dashboard | ✅ Done | `doGet?view=dashboard` — live label counts, Review Queue size, trigger health |
| Spend Clarity integration | ✅ Doc | [integrations/receipt-to-spend-clarity.md](../integrations/receipt-to-spend-clarity.md) |
| Gmail AI labels (Google's native feature) | ⬜ Monitor | Monitor if Google expands this natively |

---

## 🎯 Next Up — Inbox Leaker Triage (Apr 30, 2026)

Identified during today's report; promote each into `apps-script/rules.gs` + `gmail-filters.xml`, then `clasp push --force` and re-import XML.

| Sender / Domain | Proposed label | Notes |
|---|---|---|
| `capacities.io` | Notification | Capacities app updates |
| `hi.extra.email` | Notification | Extra app emails |
| `updates.linear.app` | Security | Linear security alerts (separate from generic Linear notifications) |
| `toybook.com` | Newsletter | Promote `james@toybook.com` to domain rule |
| GitHub CI (`notifications@github.com` filtered by subject?) | Notification | Currently hitting Security — needs sender-specific override or subject pattern |

## ⏸️ Paused / Out of Scope

| Item | Reason |
|---|---|
| Kassie's Gmail setup | Paused indefinitely — Chase's inbox is the only active focus |
| getinboxzero.com | Decided against paid tools |
| AI-powered auto-categorization | ✅ Shipped — Apps Script + Gemini (with Rules-only fallback) |

---

## 📊 Success Metrics

| Metric | MVP Target | Current |
|---|---|---|
| Inbox emails per day (non-job-search) | < 10 | TBD at 30 days |
| Time to triage inbox | < 5 min/day | TBD |
| Filter count | 40+ | 69 ✅ |
| Inbox leakers per week | < 5 | TBD |
| Job search emails missed | 0 | 0 ✅ |

---

## 📝 Change Log

| Date | Change |
|---|---|
| Apr 30, 2026 | **Newsletters archive again:** removed `Newsletter` from `shouldSkipArchive_()` in `auto-sort.gs`; added `shouldArchive` to all 24 Newsletter entries in `gmail-filters.xml`; flipped `claude.md` critical rule. Apps Script redeployed via clasp. Reversed the Apr 27 "keep newsletters in inbox" experiment after three days of inbox noise. |
| Apr 20, 2026 | **Dashboard view:** added `apps-script/dashboard.gs` + `dashboard.html`; branched `doGet` on `?view=dashboard` (preserves Spend Radar trigger); shows live label counts (today/7d/30d), auto-sort today count, Review Queue size, recent activity, trigger health — single URL to verify filtering health |
| Apr 13, 2026 | **Phase 3 kickoff:** Built Apps Script auto-sorter (`apps-script/auto-sort.gs` + `rules.gs`) with Gemini classification + Rules-only fallback + Google Sheets logging; built Chrome extension (`extension/`) with label tab bar, Sort button, settings popup, dark mode |
| Apr 13, 2026 | Started Phase 2 mislabeled sender audit loop; created `roadmap/mislabel-audit.md`; baseline review found no new confirmed Newsletter vs Cold Email reclassifications |
| Apr 12, 2026 | Church filter upgraded to domain-level (churchofjesuschrist.org); added Google Calendar notifications filter — total now 69 |
| Apr 12, 2026 | Fixed Apple filter (domain → no_reply@email.apple.com); added 3 Calendar (Kassi Hair Co., dentist, Luma), 5 Receipt (Rocky Mountain Power, Chewy, Enbridge Gas, FASTEL, Nike) — total now 68 |
| Apr 12, 2026 | Added 8 Receipt filters for Spend Clarity integration (Apple, PayPal, Costco, Target, Uber, DoorDash, Spotify, Google Play) — total now 60 |
| Apr 12, 2026 | Added Security label + Google filter; ZipRecruiter → domain-level whitelist; LinkedIn messages unarchived for job search — total now 52 |
| Apr 12, 2026 | Added Jack Carr (Marketing), Obsidian, Supabase (Notification) — total now 51 |
| Apr 12, 2026 | Added Natia Kurdadze (Newsletter); moved PEAK ENT to Calendar label — total now 48 |
| Apr 12, 2026 | Added 11 new filters (Mesh, PEAK ENT, Word Smarts, The Athletic, The Masters, John Hilton III BYU, Sporcle, The Twist, Buck Mason, We Are OLLIN, NOCD) — total now 47 |
| Apr 1, 2026 | Added TLDR suite, Product Hunt, Polymarket, The Hustle, Puzzmo, Superhuman, Church of Jesus Christ, LinkedIn invitations/messages |
| Jan 28, 2026 | Initial gmail-filters.xml built and imported — 31 filters |
| Jan 22, 2026 | Gmail label taxonomy defined |
