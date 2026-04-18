# Shipyard (iOS) — Handoff

## State

| Field      | Value                                                                     |
| ---------- | ------------------------------------------------------------------------- |
| Focus      | Phase 1 scaffold complete — simulator build green, mock fleet renders     |
| Next       | Phase 2 — Supabase read-only fleet pull (after web RLS + auth lands)      |
| Last touch | 2026-04-17                                                                |

## Phase 1 — Complete

- `Shipyard.xcodeproj` hand-crafted with `SY*` UUID prefix (mirrors `unnamed-ios` pattern)
- SwiftUI shell: `ShipyardApp` + `ContentView` + `FleetListView` + `ShipRowView`
- `Ship` Codable model mirroring web `Project` type
- `FleetStore` @Observable with 6 mock ships
- `NauticalLabels` ported from web `STEP_NAUTICAL`
- `Palette` nautical token set (navy, gold, sail-cream)
- AppIcon 1024 — compass-rose mark on navy (generated from `design/app-icon.svg`)
- `docs/BRANDING.md` using portfolio template
- `ShipyardTests/FleetStoreTests.swift` — smoke tests for model decode + grouping

## Phase 2 — What's Next

1. **Supabase SDK** — add `supabase-swift` package, pull `projects` rows into `FleetStore`
2. **Auth** — magic-link sign-in matching the web app's gate (blocked on web RLS landing first)
3. **Ship detail screen** — read-only ship overview (tap a row → pushes detail view)
4. **Pull-to-refresh** — manual refresh on fleet list
5. **ClarityUI** — add package reference once the bare scaffold is proven stable

## Known Limitations

- No ClarityUI dependency yet — deferred to keep the bare pbxproj minimal. See `LEARNINGS.md`.
- AppIcon is a placeholder compass rose — can be restyled once brand direction is final.
- Mock data only — nothing reads from Supabase yet.
