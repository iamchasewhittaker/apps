# Roadmap — Wellness Tracker (iOS)

Last updated: 2026-04-12

## Next release

- [ ] **UI palette parity:** align `WellnessTracker/Theme/WellnessTheme.swift` to **YNAB Clarity** `ClarityTheme` (see `../wellness-tracker/docs/BRANDING.md`) so in-app chrome matches `AppIcon` + web direction.

## Branding

Shared **W + sunrise** mark with web; palette matches **YNAB Clarity** `ClarityTheme` (Spend Clarity = CLI, no logo — see BRANDING). Spec: [../wellness-tracker/docs/BRANDING.md](../wellness-tracker/docs/BRANDING.md). Asset: `WellnessTracker/Assets.xcassets/AppIcon.appiconset/AppIcon.png`. Session: [HANDOFF.md](./HANDOFF.md).

## Product intent

Deliver a high-quality native iOS Wellness Tracker experience in phased slices, prioritizing daily-use workflows before full analytics parity.

## Decision: companion vs replacement

- **Current decision:** Companion-first.
- **Current mode:** Local-only storage (`UserDefaults`), no auth/sync.
- **Revisit gate:** Consider replacement mode only after native daily workflows are fully usable for two consecutive weeks without relying on web.

## V1 (current) — Done-for-now scope

- Morning/evening check-in with same-day merge semantics
- Draft autosave + stale-draft discard
- Med list management
- Past days read-only history/detail

## V1 non-goals

- Auth or account system
- Supabase sync
- Advanced history analytics/export/AI summaries
- Full parity with all web tabs

## Phase 2 — Daily workflow parity (active focus)

1. [x] Ship native tab shell
2. [x] Ship Tasks capture essentials
3. [x] Ship Time tracking essentials (+ scripture streak update rule)
4. [x] Ship quick capture for Win and Pulse
5. [ ] Expand tasks flow to include top-3 triage + one-thing modes
6. [ ] Expand time flow to live timer and active-session controls

## Phase 3 — Medium parity

- Budget + Wants
- Growth logging

## Phase 4 — Insights parity (deferred)

- History analytics and trends
- Export/reporting workflows
- AI summary
- Start only after Phase 2 daily workflows are stable in real usage.

## Phase 5 — Cloud decision follow-through (conditional)

- If replacement decision is accepted: implement auth + sync strategy
- If companion decision remains: keep local-first and skip cloud complexity

## Backlog — repo hygiene (optional)

- **Split Wellness iOS into its own commit line:** A session `checkpoint` once bundled `portfolio/wellness-tracker-ios/` with unrelated `portfolio/ynab-clarity-ios/` changes in a single commit. That is fine for day-to-day work. If you later want a clean history for bisect, release notes, or iOS-only reviewers, you can split on a **branch copy**: e.g. `git reset --soft` to the parent of the mixed commit, `git reset` to unstage, then stage and commit `portfolio/wellness-tracker-ios/` (and only the root `HANDOFF.md` / `ROADMAP.md` lines that belong to Wellness) separately from YNAB paths—or use interactive rebase. **Defer until** commit archaeology matters; no product impact.

