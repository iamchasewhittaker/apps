# Roadmap — Shipyard (iOS)

## Phase 1 — Scaffold · ✅ DONE 2026-04-17

- [x] Xcode project with `SY*` UUID prefix
- [x] SwiftUI shell + fleet list screen
- [x] Ship Codable model
- [x] Mock fleet data
- [x] AppIcon + branding docs
- [x] Smoke tests

## Phase 2 — Read-only Supabase sync

- [ ] Add `supabase-swift` Swift package
- [ ] Pull `projects` rows into `FleetStore` (depends on web RLS landing first)
- [ ] Magic-link / email-OTP auth gate
- [ ] Pull-to-refresh
- [ ] Ship detail screen (read-only)
- [ ] Add `chase_shipyard_ios_v1` UserDefaults cache for offline fleet

## Phase 3 — Interactions

- [ ] WIP-of-1 gate mirror (read-only; edits happen on web)
- [ ] Review countdown chips
- [ ] Captain's Log (learnings) viewer
- [ ] Deep-link `shipyard://ship/<slug>` → ship detail

## Phase 4 — Polish

- [ ] Widgets (small: active ship; medium: fleet stats)
- [ ] Live Activity for "Under Construction" ship
- [ ] Haptics (row tap, refresh bump)
- [ ] Share fleet snapshot to Messages/Mail

## Parked Ideas

- ClarityUI package dependency (deferred Phase 1 to keep pbxproj minimal)
- Apple Watch companion (fleet glance)
- Siri Shortcuts (`"What's on fire in the fleet?"`)
