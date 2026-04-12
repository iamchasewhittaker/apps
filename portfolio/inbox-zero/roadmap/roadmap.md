# Inbox Zero — Roadmap

> **Owner:** Chase Whittaker  
> **Last updated:** April 12, 2026  
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
| Build gmail-filters.xml | ✅ Done | 69 filters as of Apr 12, 2026 |
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
| Identify any mislabeled senders | ⬜ Pending | Review Newsletter vs Cold Email accuracy |
| Monthly newsletter unsubscribe audit | ⬜ Pending | Pull open rates; unsubscribe from anything not opened in 30 days |
| Assess daily review sustainability | ⬜ Pending | Is 5-min review realistic long-term? |
| Clean up any duplicate/overlapping filters | ⬜ Pending | Audit XML for redundancies |
| 30-day retrospective | ⬜ Pending | Document what's working, what isn't |

**Questions to answer at 30 days:**
- What senders keep slipping through?
- Are any labels getting misused or ignored?
- Is the manual XML update process too slow?

---

## 🚀 Phase 3 — Automation (Future)

**Target:** Q3 2026 (if Phase 2 reveals manual friction)  
**Goal:** Reduce or eliminate manual XML updates.

| Idea | Effort | Notes |
|---|---|---|
| Script to auto-generate XML from a spreadsheet | Low | Maintain a Google Sheet of senders → auto-export XML |
| Spend Clarity integration | Medium | Receipt label → auto-feed into portfolio/spend-clarity Python CLI for transaction categorization |
| Lightweight web app (like getinboxzero GitHub) | Medium | Self-hosted, free — builds on Gmail API |
| Gmail AI labels (Google's native feature) | Low | Monitor if Google expands this natively |
| Zapier/Make automation for new senders | Medium | Detect new senders, prompt for classification |

---

## ⏸️ Paused / Out of Scope

| Item | Reason |
|---|---|
| Kassie's Gmail setup | Paused indefinitely — Chase's inbox is the only active focus |
| getinboxzero.com | Decided against paid tools |
| AI-powered auto-categorization | Not needed yet — manual daily review is sufficient at MVP |

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
