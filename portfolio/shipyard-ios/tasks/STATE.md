# State

**Active**: 03_PHASE_2_5_MAGIC_LINK
**File**: tasks/plans/PLAN_03_PHASE_2_5_MAGIC_LINK.md
**Phase**: 2.5
**Status**: Pending
**Updated**: 2026-04-20T00:00:00Z

---

## Overview

| # | Plan | File | Status | Progress |
|---|------|------|--------|----------|
| 01 | PHASE_1_SCAFFOLD | PLAN_01_PHASE_1_SCAFFOLD.md | Complete | 6/6 tasks |
| 02 | PHASE_2_SUPABASE_SYNC | PLAN_02_PHASE_2_SUPABASE_SYNC.md | Complete | 6/6 tasks |
| 03 | PHASE_2_5_MAGIC_LINK | PLAN_03_PHASE_2_5_MAGIC_LINK.md | Pending | 0/4 tasks |
| 04 | PHASE_3_INTERACTIONS | PLAN_04_PHASE_3_INTERACTIONS.md | Pending | 0/4 tasks |
| 05 | PHASE_4_POLISH | PLAN_05_PHASE_4_POLISH.md | Pending | 0/4 tasks |
| 06 | NAUTICAL_REBRAND | PLAN_06_NAUTICAL_REBRAND.md | Complete | 6/6 tasks |

---

## Plans

### PLAN_01_PHASE_1_SCAFFOLD

#### Phase 1: Scaffold — Complete 2026-04-17

| Task | Status |
|------|--------|
| Xcode project with `SY*` UUID prefix | Complete |
| SwiftUI shell + fleet list screen | Complete |
| Ship Codable model | Complete |
| Mock fleet data | Complete |
| AppIcon + branding docs | Complete |
| Smoke tests | Complete |

### PLAN_02_PHASE_2_SUPABASE_SYNC

#### Phase 2: Read-only Supabase sync — Complete 2026-04-19

| Task | Status |
|------|--------|
| Add `supabase-swift` v2.30.0 Swift Package | Complete |
| `SupabaseService` singleton + `FleetStore.fetchFromSupabase()` | Complete |
| Email + password auth gate (SignInView) | Complete |
| `bootstrapSession()` + `authStateChanges` listener | Complete |
| `chase_shipyard_ios_v1` UserDefaults cache for offline fleet | Complete |
| Bug fixes on iPhone 12 Pro Max install (.initialSession guard + signOut sync + error banner) | Complete |

### PLAN_03_PHASE_2_5_MAGIC_LINK

#### Phase 2.5: Magic link auth — Pending

| Task | Status |
|------|--------|
| Configure Supabase email template for magic link | Pending |
| Register deep-link scheme `shipyard://auth/confirm` in Info.plist | Pending |
| `.onOpenURL` handler in `ShipyardApp` → `exchangeCodeForSession` | Pending |
| Swap `SignInView` back to magic-link UI (keep password fallback) | Pending |

### PLAN_04_PHASE_3_INTERACTIONS

#### Phase 3: Interactions — Pending

| Task | Status |
|------|--------|
| WIP-of-1 gate mirror (read-only; edits happen on web) | Pending |
| Review countdown chips | Pending |
| Captain's Log (learnings) viewer | Pending |
| Deep-link `shipyard://ship/<slug>` → ship detail | Pending |

### PLAN_05_PHASE_4_POLISH

#### Phase 4: Polish — Pending

| Task | Status |
|------|--------|
| Widgets (small: active ship; medium: fleet stats) | Pending |
| Live Activity for "Under Construction" ship | Pending |
| Haptics (row tap, refresh bump) | Pending |
| Share fleet snapshot to Messages/Mail | Pending |

### PLAN_06_NAUTICAL_REBRAND

#### Rebrand: Nautical brand system — Complete 2026-04-20

| Task | Status |
|------|--------|
| 8-token Palette.swift (bg/surface/steel/gold/dim/dimmer/ghost/white) | Complete |
| Font+Shipyard.swift — BigShoulders / DM Mono / Instrument Sans helpers | Complete |
| HelmMark.swift reusable SwiftUI view | Complete |
| LaunchScreenView + OnboardingView | Complete |
| AppIcon regenerated from helm SVG | Complete |
| All views restyled with new tokens/fonts | Complete |
