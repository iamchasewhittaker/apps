# Handoff — Clarity Growth (iOS)

## Current status: Phase 5 complete (MVP v0.1)

- **Version:** v0.1
- **Last session:** 2026-04-13
- **Bundle ID:** `com.chasewhittaker.ClarityGrowth`
- **Storage key:** `chase_growth_ios_v1` (single `Codable` root in `UserDefaults` — **never rename**)
- **Shared package:** `../clarity-ui` (local SPM — `ClarityUI`)
- **PBX prefix:** **`CG`** — all generated IDs in `ClarityGrowth.xcodeproj/project.pbxproj` use `CG*` (reserved siblings: `CC`, `CT`, `CX`, `CB`)

### Build / test

- `ClarityGrowth.xcodeproj` is **generated in-repo** (no manual Xcode project wizard).
- Verify with `xcodebuild` on an installed iOS Simulator + `CODE_SIGNING_ALLOWED=NO`.
- `xcodebuild test` can hang when Simulator services are unhealthy; retry after Simulator restart.

### Open project

```bash
open portfolio/clarity-growth-ios/ClarityGrowth.xcodeproj
```

---

## Product / data model (v0.1)

### Growth areas

Seven fixed IDs (legacy parity): `gmat`, `job`, `ai`, `pm`, `claude`, `bom`, `cfm`.

### Sessions

Each `GrowthSessionEntry` stores:
- `area`
- `mins`
- `note` (optional)
- `milestones` (optional)
- `backgrounds` (optional)
- `date` (`yyyy-MM-dd`)
- `timestampMs`

### Streak logic

`GrowthBlob.streakCount(for:today:)` mirrors prior Growth behavior: count consecutive unique logged days anchored from today with one-day fallback continuity.

### Persistence

- One root struct `GrowthBlob` keyed by `GrowthConfig.storeKey`.
- No secondary keys for app data.

---

## What shipped (MVP)

| Area | Notes |
|------|-------|
| Dashboard | Quote banner, total sessions/hours/active streaks, week activity bars |
| Areas | 7 area tiles with today highlight + streak label |
| Logging | Full log sheet (area/minutes/note/milestones/background) |
| History | Area filter, recent sessions list, delete support |
| Storage | `StorageHelpers` + `GrowthBlob` JSON |
| Tests | `ClarityGrowthTests` — JSON round-trip + math/streak coverage |

---

## Done when (checklist)

- [x] Seven growth areas persist and log independently
- [x] Dashboard and history views render from one `GrowthStore`
- [x] `xcodebuild build` clean (simulator, no signing) — verified iPhone 15 / iOS 17.2
- [ ] `xcodebuild test` — retry locally if CLI hangs due Simulator service health

---

## Next (repo roadmap)

Clarity iOS Phase sequence is now complete (Check-in, Triage, Time, Budget, Growth).

Next likely work:
- Budget v0.2+ ideas in [`../clarity-budget-ios/ROADMAP.md`](../clarity-budget-ios/ROADMAP.md)
- Growth v0.2+ ideas in [`ROADMAP.md`](ROADMAP.md)

---

## Fresh session prompt — continue Clarity Growth (copy into new chat)

After `checkpoint`:

```
Read CLAUDE.md and repo HANDOFF.md first, then portfolio/clarity-growth-ios/CLAUDE.md and portfolio/clarity-growth-ios/HANDOFF.md.

Goal: Continue Clarity Growth iOS at portfolio/clarity-growth-ios/.

Current state: Phase 5 MVP v0.1 shipped — 7 growth areas, streak-aware logging/history; PBX prefix CG; store key chase_growth_ios_v1; ClarityUI via ../clarity-ui.

Pick next work from portfolio/clarity-growth-ios/ROADMAP.md (or fix bugs). Follow existing patterns: @Observable @MainActor store, @MainActor on views that mutate store from nested Button builders, StorageHelpers persistence.

Verify:
  cd portfolio/clarity-growth-ios && xcodebuild -scheme ClarityGrowth -showdestinations
  xcodebuild build -scheme ClarityGrowth -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' CODE_SIGNING_ALLOWED=NO
  xcodebuild test  -scheme ClarityGrowth -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' CODE_SIGNING_ALLOWED=NO

Update CHANGELOG [Unreleased], ROADMAP, this HANDOFF, root ROADMAP Change Log, and root HANDOFF State when you stop.
```
