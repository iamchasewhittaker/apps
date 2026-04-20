# Roadmap — Shipyard (iOS)

## Phase 1 — Scaffold · ✅ DONE 2026-04-17

- [x] Xcode project with `SY*` UUID prefix
- [x] SwiftUI shell + fleet list screen
- [x] Ship Codable model
- [x] Mock fleet data
- [x] AppIcon + branding docs
- [x] Smoke tests

## Phase 2 — Read-only Supabase sync · ✅ DONE 2026-04-19

- [x] Add `supabase-swift` Swift package
- [x] Pull `projects` rows into `FleetStore`
- [x] Email + password auth gate (matches current web flow)
- [x] Pull-to-refresh (already in Phase 1; now fetches real data)
- [x] Ship detail screen (read-only) (shipped in Phase 1)
- [x] `chase_shipyard_ios_v1` UserDefaults cache for offline fleet

## Phase 2.5 — Magic link auth

- [ ] Configure Supabase email template for magic link
- [ ] Register deep-link scheme `shipyard://auth/confirm`
- [ ] `.onOpenURL` handler in `ShipyardApp` → `exchangeCodeForSession`
- [ ] Swap `SignInView` back to magic-link UI

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
