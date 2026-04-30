# Session Start — Shipyard iOS (2026-04-29)

> Paste this at the start of any new Claude Code chat to resume with full context.
> Say: "Read CLAUDE.md and HANDOFF.md first, then this prompt."

---

## Journey so far

- **2026-04-17** — Phase 1 scaffold: Shipyard.xcodeproj (SY* prefix), SwiftUI shell, Ship Codable model, mock fleet, FleetListView grouped by status, ShipRowView with nautical MVP-step label, compass-rose AppIcon, FleetStoreTests
- **2026-04-19** — Phase 2 complete: supabase-swift v2 SPM, real projects fetch from Supabase, email/password auth, session bootstrap + authStateChanges listener, UserDefaults cache for offline, SignInView wired, toolbar reload + sign-out
- **2026-04-20** — Phase 2 bug fixes (found on first device install): .initialSession false-positive (nil session check), sign-out not sticking (belt-and-suspenders handleSignedOut), error banner in FleetListView
- **2026-04-20** — Nautical rebrand: 8-token Palette.swift (bg/surface/steel/gold/dim/dimmer/ghost/white), Font+Shipyard.swift (BigShoulders/DM Mono/Instrument Sans), HelmMark.swift (8-spoke ship's helm), LaunchScreenView, OnboardingView (3-page), all views restyled, AppIcon regenerated from helm SVG, installed on iPhone 12 Pro Max

---

## Still needs action

- Supabase fetch not yet smoke-tested end-to-end on device (sign-in works; need to verify real data vs. mock fallback)
- No ClarityUI dependency yet (deferred to keep pbxproj minimal)

---

## Shipyard iOS state at a glance

| Field | Value |
|-------|-------|
| Version | v0.1 (Phase 2 complete) |
| URL | local Xcode |
| Storage key | `chase_shipyard_ios_v1` (UserDefaults cache of last fleet fetch) |
| Stack | SwiftUI + iOS 17 + @Observable + supabase-swift v2 + UserDefaults |
| Xcode prefix | SY* |
| Bundle ID | com.chasewhittaker.Shipyard |
| Linear | -- |
| Last touch | 2026-04-20 |

---

## Key files for this session

| File | Purpose |
|------|---------|
| portfolio/shipyard-ios/CLAUDE.md | App-level instructions |
| portfolio/shipyard-ios/HANDOFF.md | Session state + notes |
| Shipyard/Services/FleetStore.swift | @Observable @MainActor -- Supabase fetch + auth listener + cache fallback |
| Shipyard/Services/SupabaseService.swift | Shared SupabaseClient singleton |
| Shipyard/Models/Ship.swift | Codable struct mirroring web Project type |
| Shipyard/Views/Fleet/FleetListView.swift | Grouped list by status with error banner + toolbar |
| Shipyard/Constants/Palette.swift | 8 nautical color tokens (bg, surface, steel, gold, dim, dimmer, ghost, white) |
| Shipyard/Views/HelmMark.swift | Reusable ship's helm SwiftUI view |

---

## Suggested next actions (pick one)

1. Phase 2.5 -- Magic-link auth (deep-link scheme `shipyard://auth/confirm`, .onOpenURL, exchangeCodeForSession)
2. Phase 3 -- WIP-of-1 gate mirror (read-only), review countdown chips, Captain's Log viewer
3. Phase 4 -- Widgets (small: active ship; medium: fleet stats)
