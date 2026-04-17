# Product Lines — Portfolio Strategy

> Every active app maps to exactly one product line. Supporting tools and incubating projects are classified separately.
> Use this doc when making priority, consolidation, or kill decisions.

---

## Product Line 1: Clarity Life OS

**Target user:** Chase (and future users seeking a structured daily operating system)
**Core job:** Daily life operations — check-in, triage priorities, manage time, track budget, drive growth
**Brand thread:** "Clarity" naming, shared color palette, consistent iconography

| App | Platform | Status | Role in Line |
|-----|----------|--------|-------------|
| Wellness Tracker | Web (CRA) | Active v15.10 | Primary web hub — unified daily wellness and life operations |
| Clarity Hub | Web (CRA) | Active v0.2 | Desktop companion for 5 Clarity iOS domains |
| Clarity Check-in (iOS) | iOS (SwiftUI) | Active v0.1 | Daily emotional/physical check-in |
| Clarity Triage (iOS) | iOS (SwiftUI) | Active v0.1 | Priority decision-making and capacity planning |
| Clarity Time (iOS) | iOS (SwiftUI) | Active v0.1 | Time sessions and scripture streak |
| Clarity Budget (iOS) | iOS (SwiftUI) | Active v0.2 | YNAB-first Today (safe to spend) + dual scenarios + wants; web companion [`clarity-budget-web`](../../portfolio/clarity-budget-web) |
| Clarity Growth (iOS) | iOS (SwiftUI) | Active v0.1 | 7 growth areas and streaks |
| ClarityUI | Swift Package | Active v0.1 | Shared iOS design system |
| Clarity Command | Web (CRA) | Active v1.0 | Faith/family accountability and daily mission flow |

**Web roles (updated 2026-04-16):** Multiple web surfaces touch “life domains,” but they are **not competing canonical surfaces** — they own different data and jobs.

| Surface | Canonical for | Storage / sync | When to use |
|---------|----------------|----------------|-------------|
| **Wellness Tracker** (web) | Unified daily wellness — tracker, history, growth, tasks, meds, exports | `chase_wellness_v1` (+ related keys), Supabase `wellness` / companion rows | Full wellness journey in one app; see [`portfolio/wellness-tracker/CLAUDE.md`](../../portfolio/wellness-tracker/CLAUDE.md) |
| **Clarity Hub** (web) | The **five Clarity iOS domain apps** on desktop — same blobs as native Check-in, Triage, Time, Budget, Growth | Per-tab keys + Supabase `app_key` `checkin` / `triage` / `time` / `budget` / `growth` | Edit the same data as the split iOS suite from a browser; see [`portfolio/clarity-hub/CLAUDE.md`](../../portfolio/clarity-hub/CLAUDE.md) |
| **Clarity Budget** (web) | **YNAB safe-to-spend** companion for **Clarity Budget iOS** — month/week/day pace, optional blob merge | `chase_budget_web_v1` + YNAB PAT in `localStorage` only; Supabase `user_data` `app_key` **`clarity_budget`** | Browser STS + sync without replacing Clarity Hub’s budget tab; see [`portfolio/clarity-budget-web/README.md`](../../portfolio/clarity-budget-web/README.md) |

Daily “check-in” style input may exist in both products; **source of truth** is by stack: **Clarity Check-in iOS ↔ Clarity Hub** for the five-app OS; **Wellness Tracker** for the integrated wellness record. Prefer linking between apps in UI (cross-app nav) rather than duplicating features across blobs.

**Key metric:** Daily active use (even if just Chase). Are all 5 domains being exercised weekly?

---

## Product Line 2: Career Toolkit

**Target user:** Active job seekers and career operators
**Core job:** Pipeline management, AI-assisted applications, follow-up automation, inbox triage
**Brand thread:** Productivity-focused, professional, outcome-driven

| App | Platform | Status | Role in Line |
|-----|----------|--------|-------------|
| Job Search HQ | Web (CRA) + Chrome Extension | Active v8.5 | Primary pipeline manager with AI-assisted execution |
| Gmail Forge | Internal system | Active | Email triage automation and AI rules |

**Most market-ready line.** Job Search HQ is the closest to external launch.

**Key metric:** Applications submitted, interviews scheduled, response rate.

---

## Product Line 3: Finance & Budget

**Target user:** Budget-conscious power users (YNAB users specifically)
**Core job:** Transaction enrichment, budget visualization, YNAB companion workflows
**Brand thread:** Financial clarity, practical utility, YNAB ecosystem integration

| App | Platform | Status | Role in Line |
|-----|----------|--------|-------------|
| YNAB Clarity Web | Web (CRA) | Active v1.0 | Standalone YNAB dashboard and budget visualization |
| YNAB Clarity iOS | iOS (SwiftUI) | Local v0.2 | Native YNAB companion with assign flow |
| Spend Clarity | Python CLI | Local | Internal transaction enrichment from Gmail receipts + Privacy.com |

**Key metric:** Transactions enriched per week, budget categories with clear assignment.

---

## Supporting Tools (Not Product Lines)

These serve the builder, not end users.

| App | Purpose | Investment Tier |
|-----|---------|----------------|
| App Forge | Portfolio mission control and audit tool | Maintain |
| Knowledge Base | Personal knowledge and bookmark management | Maintain |
| App Hub | Post-push summaries and portfolio scripts | Maintain |

---

## Incubating (Milestone-Gated)

These need proof of value before continued investment.

| App | Milestone to Proceed | Deadline |
|-----|---------------------|----------|
| AI Dev Mastery | Deploy publicly + 1 user completes a module | 90 days from now |
| Shortcut Reference | Ship v1 + use it weekly for 1 month | 90 days from now |

**If milestone not met by deadline:** Archive as Revivable Candidate.

---

## Archived

See `docs/governance/ARCHIVE_POLICY.md` for full inventory and classifications.

---

## Decision Rules

1. **New feature?** Check if it belongs in an existing app in the same product line before creating a new app.
2. **New app?** Must pass Gate 1 (Strategy/Problem Fit) from `LAUNCH_CHECKLIST.md` and map to a product line.
3. **Overlap detected?** Document in this file under the relevant product line (use a short **Roles** or **Decision** note — see Clarity Life OS web roles table as an example).
4. **Kill candidate?** Use kill criteria from `ARCHIVE_POLICY.md`. Product hat reviews this bi-weekly.
