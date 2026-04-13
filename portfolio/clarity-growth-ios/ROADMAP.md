# Roadmap — Clarity Growth (iOS)

## v0.1 (shipped)

- [x] Programmatic `ClarityGrowth.xcodeproj` with `CG*` PBX IDs
- [x] Single-root persistence via `GrowthBlob` + `GrowthStore` (`chase_growth_ios_v1`)
- [x] Seven growth areas + milestones (`gmat`, `job`, `ai`, `pm`, `claude`, `bom`, `cfm`)
- [x] Dashboard: quote, sessions/hours/active streaks, week bars, area cards
- [x] Session logging sheet: area, minutes, optional note/milestones/background
- [x] History tab: area filter, session list, delete
- [x] Unit tests for blob round-trip + streak/math helpers

## Ideas (v0.2+)

- [ ] Monthly trend view (minutes and sessions by area)
- [ ] Area-level goals (target sessions/minutes per week)
- [ ] Calendar heatmap for streak visibility
- [ ] Export / import `GrowthBlob` JSON backup
- [ ] Optional cross-app logging hooks from Clarity Time / Triage actions

## Related

- **Prior Clarity app:** Phase 4 — Clarity Budget — `portfolio/clarity-budget-ios/`
- **Shared UI package:** `portfolio/clarity-ui/`
