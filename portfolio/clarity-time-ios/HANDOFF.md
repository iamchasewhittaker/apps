# Handoff — Clarity Time (iOS)

## Current status: Phase 3 complete (MVP)

- **Version:** v0.1
- **Last session:** 2026-04-13
- **Bundle ID:** `com.chasewhittaker.ClarityTime`
- **Storage key:** `chase_time_ios_v1` (single `Codable` root in `UserDefaults` — never rename)
- **Shared package:** `../clarity-ui` (local SPM — `ClarityUI`)
- **Branding / launcher:** [`docs/BRANDING.md`](docs/BRANDING.md) · shipped **`AppIcon.png`** (1024) = user-selected **clock + ring progress arc + check badge**; wide slide = [`docs/design/app-icon-mockup-wide.png`](docs/design/app-icon-mockup-wide.png); provenance [`docs/design/app-icon-source-user-1024.png`](docs/design/app-icon-source-user-1024.png). Shared rules: [`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`](../../docs/design/CLARITY_IOS_APP_ICON_SPEC.md).

### Build / test

- `ClarityTime.xcodeproj` is **generated in-repo** (no manual Xcode project wizard). PBX object IDs use prefix **`CX`** (do not use `CT` — reserved for Clarity Triage).
- Verify with `xcodebuild` on an **installed** iOS Simulator + `CODE_SIGNING_ALLOWED=NO`. Use `-showdestinations` if `iPhone 16` is missing on your host.

### Open project

```bash
open portfolio/clarity-time-ios/ClarityTime.xcodeproj
```

---

## Product / data model (MVP)

### Time sessions

1. **Timer** — Start with optional title + category; pause/resume; stop writes a `TimeSession` with `kind == .timer` and `durationSeconds` from wall clock minus paused intervals. Active timer state is persisted in the blob so a relaunch can resume accounting (UI may still show “paused” state from blob).
2. **Manual** — User enters duration (minutes), optional title/category, and optional day (defaults to today); appends a `TimeSession` with `kind == .manual`.
3. **History** — Sessions listed newest-first; delete supported.

### Scripture streak

- **Counts toward streak:** `ScriptureDayEntry.completed == true` for a calendar day (`yyyy-MM-dd`, local timezone via `DateHelpers`).
- **Optional metadata:** `scriptureReference` (e.g. “John 3:16”) does **not** affect streak.
- **Streak rule:** Current streak = consecutive completed days ending at **today** if today is completed; otherwise it ends at **yesterday** and counts backward (so an incomplete today does not zero the streak until the chain breaks). Implemented in `TimeBlob.scriptureStreakCount()`.

### Persistence

- One root struct `TimeBlob` keyed by `TimeConfig.storeKey`.
- No secondary `UserDefaults` keys for app data.

---

## What shipped (MVP)

| Area | Notes |
|------|--------|
| Sessions | Timer (start/pause/resume/stop) + manual duration entry; categories from `TimeConfig` |
| Scripture | Per-day completion toggle + optional reference; streak display |
| Quote | `timeQuotes` + `QuoteBanner` on Time tab |
| Storage | `StorageHelpers` + `TimeBlob` JSON |
| Tests | `ClarityTimeTests` — JSON round-trip, streak logic, timer elapsed math |

---

## Done when (checklist)

- [x] Timer start → pause → resume → stop persists a session
- [x] Manual session adds row with correct duration
- [x] Scripture toggle persists; streak matches rules above
- [x] `xcodebuild build` clean (simulator, no signing)
- [x] `xcodebuild test` pass (same destination)

---

## Next (repo roadmap)

**Phase 5 — Clarity Growth (iOS)** — `portfolio/clarity-growth-ios/` — not started. See repo root [`HANDOFF.md`](../../HANDOFF.md) “Fresh session prompt — Phase 5 (Clarity Growth)”.

**Clarity Budget (Phase 4)** — shipped at `portfolio/clarity-budget-ios/` (v0.1). To continue Budget work, use repo root [`HANDOFF.md`](../../HANDOFF.md) “Fresh session prompt — continue Clarity Budget” or [`portfolio/clarity-budget-ios/HANDOFF.md`](../clarity-budget-ios/HANDOFF.md).

---

For **Clarity Time maintenance only**, use the “Session start — maintenance only” block in [`CLAUDE.md`](CLAUDE.md).
