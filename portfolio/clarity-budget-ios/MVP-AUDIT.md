# MVP Audit — Clarity Budget (iOS + web)

**Last updated:** 2026-04-16

## What this MVP is

**v0.2** — Local-first **Clarity Budget** with:

- **Today (YNAB-first):** safe to spend **month / week / day** after bills and essentials, driven by `BudgetMetricsEngine` + live YNAB month data (`refreshYNABSnapshot()`).
- **Dual scenarios** (baseline + stretch) and **Wants** aggregate tracking in one `BudgetBlob`, quote banner, **ClarityUI** shell.
- **Optional YNAB (read + write):** personal access token in Keychain, budget picker, per-category **roles**, income sources, **Import Baseline**, **Fund category** (PATCH) with confirmation.
- **Web companion:** [`../clarity-budget-web`](../clarity-budget-web) — same STS math, optional Supabase sign-in for blob merge (`app_key` = `clarity_budget`); YNAB PAT never leaves the browser localStorage.

**Cloud:** iOS **Supabase sync is a stub** (`BudgetSupabaseSync`) until `supabase-swift` + plist keys are added. Web can push/pull today.

## Step assessment

| Dimension | Notes |
|-----------|--------|
| **Scope** | v0.2 goals met: Today tab, web dashboard, scenarios, wants, persistence (`chase_budget_ios_v1`), YNAB settings + import + fund, `_syncAt` field for future merge. |
| **Honesty** | YNAB is optional for scenarios/wants; core “Clarity” value is strongest when YNAB is linked (Today + import). |
| **Gaps** | iOS real Supabase; wants still aggregate only; no calendar-month rollover; category mapping UX on web is minimal (assume iOS or synced blob). |

## Process (this repo)

**Linear is not used** for Clarity Budget MVP. Backlog, releases, and session handoff live **in this repo only**: [`ROADMAP.md`](ROADMAP.md), [`CHANGELOG.md`](CHANGELOG.md), [`HANDOFF.md`](HANDOFF.md).

## Status

**Active** — v0.2 shipped (2026-04-16). Next milestone per [`ROADMAP.md`](ROADMAP.md): iOS Supabase implementation, then wants month boundaries / accessibility / export as prioritized.

## Next milestone (suggested)

1. Replace `BudgetSupabaseSync` stub with `supabase-swift` + auth when keys are set.  
2. Calendar-month boundaries for wants (rollover).  
3. Accessibility pass (VoiceOver on currency, Dynamic Type).
