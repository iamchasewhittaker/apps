# Portfolio Status Report — 2026-04-29

> Auto-generated. 42 active projects scanned (+ 3 archived). Source: git log, package.json, Vercel, CLAUDE.md.

---

## Top 4 Monetization (STRATEGY.md targets)

| App | STRATEGY Target | Current State | Gap |
|-----|----------------|---------------|-----|
| **Job Search HQ** | Stripe + pricing page + Pro features (4-week plan) | v8.18 deployed. Gmail Inbox Feed, Morning Launchpad, Chrome extension, AI coach all shipped. No paywall, no Stripe. | Stripe + pricing page + plan-gating not started |
| **GMAT Mastery Web** | Lemon Squeezy + landing page + onboarding (4-week plan) | v0.1 deployed. Claude API question generation working. Missing: HANDOFF, CHANGELOG, ROADMAP. | Payment infra + onboarding + docs all pending |
| **Clarity Budget Web** | Stripe + Safe-to-Spend paywall (4-week plan) | v0.4 deployed. Steps 1-8 done (auth, Privacy.com, AI categorize, review UI, flags, card mapping). Active build. | Stripe + plan-gating not started. Core product advancing well. |
| **Unnamed** | Stripe + lane paywall + onboarding (4-week plan) | v0.1 deployed. 4-lane system working. 7-day rule in effect (no new features until usage streak). | Stripe + plan-gating not started. Blocked by 7-day usage rule. |

**Bottom line:** All 4 are deployed on Vercel. Zero have payment infrastructure. Clarity Budget Web is the most actively developed. GMAT Mastery has the weakest docs foundation.

---

## Vercel Deployments (10 projects, all healthy)

| Project | URL | Last Deploy |
|---------|-----|-------------|
| clarity-budget-web | clarity-budget-web.vercel.app | 15h ago |
| alias-ledger | alias-ledger.vercel.app | 15h ago |
| unnamed | unnamed-gold.vercel.app | 15h ago |
| job-search-hq | job-search-hq.vercel.app | 15h ago |
| knowledge-base | knowledge-base-hazel-iota.vercel.app | 15h ago |
| gmat-mastery-web | gmat-mastery-web.vercel.app | 15h ago |
| ash-reader | ash-reader.vercel.app | 15h ago |
| shipyard | shipyard-sandy-seven.vercel.app | 15h ago |
| ai-dev-mastery | ai-dev-mastery.vercel.app | 15h ago |
| chase | chase-kappa.vercel.app | 15h ago |

**Not on Vercel but marked "Active" in CLAUDE.md:** wellness-tracker, clarity-command, clarity-hub, funded-web, rollertask-tycoon-web, app-forge (all local-only or previously deployed).

---

## Recent Activity (last 2 weeks, substantive changes)

| Project | What changed | Date |
|---------|-------------|------|
| **clarity-budget-web** | Steps 6-8: /review UI, /flags UI, Privacy.com connector, AI Gateway | 04-28 to 04-29 |
| **ash-reader-ios** | Phases 5-7: iCloud sync, reminders, sharing, streaks. 41/41 tests. | 04-29 |
| **roller-task-tycoon-ios** | V2 Game Feel: subtasks, templates, haptics, animations | 04-28 |
| **fairway-ios** | Phase 2: Z2 sub-zones (park strip / main grass) | 04-28 |
| **wellness-tracker-ios** | Phase 2 #5: Tasks top-3 triage + one-thing modes | 04-28 |
| **shipyard** | Linear issue sync + learnings dedup fix | 04-28 |
| **gmail-forge** | Auto-sort rules update (73 sender rules + JobSearch regexes) | 04-28 |
| **clarity-*-ios (4 apps)** | Swift 6 concurrency fix (nonisolated removal) | 04-28 |
| **ai-dev-mastery** | Branding: logo, favicon, manifest, AppIcon | 04-29 |
| **job-search-hq** | InboxPanel updates + docs | 04-28 |

**Dormant (no substantive changes in 2+ weeks):** alias-ledger, app-forge, app-hub, ash-reader (web), clarity-budget-ios, clarity-command (web), clarity-hub, clarity-ui, claude-usage-tool, drivemind (last: 04-20), funded-ios, funded-web, gmat-mastery-web (last: 04-28 docs only), idea-kitchen, job-search-hq-ios, knowledge-base, roller-task-tycoon (web), rollertask-tycoon-web, shipyard-ios, shortcut-reference, spend-clarity, spend-radar, spend-radar-web, unnamed (web), unnamed-ios.

---

## Documentation Gaps

### Missing required files (per root CLAUDE.md convention)

| Project | CLAUDE | STATE | README | HANDOFF | CHANGELOG | ROADMAP | LEARNINGS |
|---------|--------|-------|--------|---------|-----------|---------|-----------|
| gmat-mastery-web | Y | N | Y | **N** | **N** | **N** | **N** |
| drivemind | Y | N | Y | Y | **N** | **N** | **N** |
| clarity-ui | Y | N | N | **N** | Y | **N** | **N** |
| gmail-forge | Y | N | N | Y | Y | **N** | Y |
| ash-reader | Y | N | Y | Y | Y | Y | **N** |
| app-hub | **N** | N | Y | Y | **N** | **N** | **N** |

**STATE.md:** 0 of 42 projects have STATE.md at root. 3 have it in tasks/ subdirectory (shipyard, shipyard-ios, gmat-mastery-web).

**README.md missing (20 projects):** alias-ledger, ash-reader-ios, clarity-budget-ios, clarity-checkin-ios, clarity-command, clarity-command-ios, clarity-growth-ios, clarity-time-ios, clarity-triage-ios, clarity-ui, fairway-ios, funded-ios, gmail-forge, knowledge-base, rollertask-tycoon-web, shipyard-ios, spend-radar, spend-radar-web, unnamed-ios.

---

## Linear Coverage

**Tracked (8 projects):**
- Job Search HQ, Job Search HQ iOS, Clarity Budget Web, Idea Kitchen, RollerTask Tycoon iOS, Claude Usage Tool, Fairway iOS, Portfolio Monorepo Migration, Portfolio Governance

**Missing (per STRATEGY.md requirements):**
- GMAT Mastery Web (Top 4)
- Unnamed Web (Top 4)
- Unnamed iOS
- Monetization Sprint (cross-app)
- Shipyard, Wellness Tracker, AI Dev Mastery, Ash Reader (active deployed apps)
- DriveMind (active build)

---

## ROADMAP.md Staleness

Root ROADMAP.md has several stale entries:
- Growth Tracker: listed as "Active" — should be "Archived"
- Money: listed as "Active" — should be "Archived"
- RollerTask Tycoon web PWA: listed as "Active" — Vercel project removed 04-25
- AI Dev Mastery: listed as "local" — now deployed on Vercel
- Clarity Budget Web: listed as "local" — now deployed on Vercel
- Unnamed: listed as "local" — now deployed on Vercel
- Job Search HQ: version listed as v8.12 — should be v8.18

---

## Archive Candidates (per STRATEGY.md section 10)

| App | Recommendation | Reason |
|-----|---------------|--------|
| RollerTask Tycoon Web PWA | Archive | Already retired, Vercel removed |
| Growth Tracker | Done | Already in archive/ |
| Money | Done | Already in archive/ |
| Spend Radar | Archive | Superseded by Clarity Budget receipt enrichment |
| Spend Radar Web | Archive | Dashboard for Spend Radar |
| Clarity Hub | Archive | Superseded by Shipyard |
| Clarity Command Web | Archive | Superseded by Shipyard + Unnamed |
| Funded Web | Archive | Consolidate into Clarity Budget |
| App Forge | Archive | Superseded by Idea Kitchen + Claude Code |
| Clarity Triage/Time/Growth/Command iOS | Hold or Bundle | Depends on Path A vs Path B decision |

---

## Summary

- **43 total projects** (3 archived, ~10 archive candidates, ~15 dormant, ~15 active)
- **10 deployed on Vercel**, all healthy
- **4 Top 4 monetization apps** all deployed, none have payment infrastructure
- **0 STATE.md files** — biggest documentation gap
- **20 projects missing README**
- **~10 Linear projects needed** but not created
- **Root ROADMAP.md** has 7+ stale entries
- **Most active this week:** clarity-budget-web, ash-reader-ios, roller-task-tycoon-ios
