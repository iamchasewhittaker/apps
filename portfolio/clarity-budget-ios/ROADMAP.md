# Roadmap — Clarity Budget (iOS)

## v0.1 (shipped)

- [x] **App icon + branding** — `AppIcon.png`, `docs/design/app-icon-mockup-wide.png`, [`docs/BRANDING.md`](docs/BRANDING.md), `CLAUDE.md` links (2026-04-13). **Glyph:** stacked coins shipped 2026-04-14 (dual-column → `docs/design/app-icon-mockup-explore-columns.png`).
- [x] Dual scenarios (baseline + stretch) in one `BudgetBlob`
- [x] Wants budget cap + spent + remaining vs plan
- [x] Tab UX: Scenarios (edit + glance) · Wants (log + reset)
- [x] ClarityUI shell (palette, quotes, dark mode)
- [x] Programmatic `ClarityBudget.xcodeproj` (`CB*` IDs) + unit tests target

## v0.2 (shipped) — 2026-04-16

- [x] **YNAB-first Today tab** — safe-to-spend month / week / day + `refreshYNABSnapshot()` + `SafeToSpendHomeView`
- [x] **Web companion** — [`../clarity-budget-web`](../clarity-budget-web) Next.js + optional Supabase `clarity_budget` row; dashboard UI matched to iOS Today
- [x] **Blob sync field** — `_syncAt` on `BudgetBlob`; stub `BudgetSupabaseSync` on iOS
- [x] **YNAB link** — token, budget, category roles, income sources, import Baseline, PATCH fund (2026-04-15)

## Ideas (backlog)

- [ ] **iOS Supabase** — replace stub `BudgetSupabaseSync` with real auth + push/pull when env keys are set
- [ ] Calendar-month boundaries for wants (rollover / “this month”)
- [ ] Per-want line items (label + amount) instead of only aggregate spent
- [ ] Compare scenarios chart / delta summary card
- [ ] Export blob JSON (share sheet) for backup
- [ ] Accessibility pass (VoiceOver on currency fields, Dynamic Type)
- [ ] Web: richer category-role editing (optional; mappings today from iOS or synced blob)

## Related

- **Backlog:** Not mirrored in Linear; ideas and shipped items stay in this file and `CHANGELOG.md`.
- **Next Clarity app (repo plan):** Phase 5 — Clarity Growth — `portfolio/clarity-growth-ios/`
- **Shared UI:** `portfolio/clarity-ui/`
