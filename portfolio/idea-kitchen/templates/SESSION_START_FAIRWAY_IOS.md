# Session Start — Fairway iOS (2026-04-29)

> Paste this at the start of any new Claude Code chat to resume with full context.
> Say: "Read CLAUDE.md and HANDOFF.md first, then this prompt."

---

## Journey so far

- **2026-04-18** — v0.1 initial scaffold: all data models, FairwayBlob, FairwayStore, 5-tab layout, Augusta green palette, spreader calc, soil test, shrub beds, fertilizer plan, mow log
- **2026-04-24** — Phase 0 data entry: IFA over-application logging, Z2-S1..S6 head catalog, mixed-precip ProblemArea, 9 recovery tasks, `applyPhase0MigrationIfNeeded()`
- **2026-04-24** — Rachio v1 read-only API integration: Keychain token, fetch person/device/zones/events, zone-link picker, "Rachio says" mirror card, watering history view, 7 decode tests
- **2026-04-24** — KML sprinkler head ingestion: `import-kml.py` written, 23-pin manifest + photos downloaded, park-strip provisional matching, Z2-S5 nozzle correction from photo evidence
- **2026-04-25** — KML reimport: Zone 3 expanded 5 to 11 heads, Zone 4 "Back Yard" seeded with 12 heads, `Z*-S*` label standardization, `rewrite-kml-labels.py`, Phase 1 zone migration in FairwayStore
- **2026-04-25** — Pre-Season Audit view + photo audit data for all 41 heads, `HeadAuditSheet` with pre-filled estimates
- **2026-04-25** — Zone-menu refinements: actions on problems, shopping list, Z2 sub-grouping, schedule explainers, map zone-hull polygons
- **2026-04-25** — Verification session: 40/40 tests, 3 production bugs fixed (PropertySettingsView @MainActor, HeadData decoder, FairwayBlob decoder), device install on iPhone 12 Pro Max
- **2026-04-27** — Overview tab (v0.2): Open-Meteo weather + soil-temp chart + alerts + audit progress + Rachio status + schedule sanity + mow streak + quick-log row, 58 tests
- **2026-04-28** — Phase 2 shipped: GrassSubZone model, Z2 seeded with Main + Park strip sub-zones, sub-zone filter chips in ZoneDetailView, runtime card in ScheduleView, 62 tests, device install verified

---

## Still needs action

- Z4-S1 dig-out (buried head blocking full Zone 4 confidence) -- highest real-world priority
- Google Earth re-import: confirm all 41 pins show `Z*-S*` labels in Google Earth web
- Docs-sweep: COVERAGE_ANALYSIS.md, PROPERTY_PLACEMENT.md still pending
- Chase field-confirm provisional Z2-MATCH matching (especially Z2-S5 empty nozzle slot)
- Once Z2 matching confirmed: `git mv docs/heads/Z2-MATCH-Nth/` to `docs/heads/Z2-S{1..6}/`

---

## Fairway state at a glance

| Field | Value |
|-------|-------|
| Version | v0.2 |
| URL | local Xcode |
| Storage key | `chase_fairway_ios_v1` (UserDefaults) + Keychain `com.chasewhittaker.Fairway` (Rachio token) |
| Stack | SwiftUI + iOS 17 + @Observable + UserDefaults + Codable + Open-Meteo + Rachio v1 API |
| Xcode prefix | FW* |
| Bundle ID | com.chasewhittaker.Fairway |
| Linear | [Fairway iOS](https://linear.app/whittaker/project/fairway-ios-967c8e495407) |
| Last touch | 2026-04-28 |

---

## Key files for this session

| File | Purpose |
|------|---------|
| portfolio/fairway-ios/CLAUDE.md | App-level instructions |
| portfolio/fairway-ios/HANDOFF.md | Session state + notes |
| Fairway/FairwayStore.swift | @Observable @MainActor store -- load/save/seed/migrations |
| Fairway/FairwayBlob.swift | Root Codable struct (all app data) |
| Fairway/Models/ZoneData.swift | Zone model with heads, problems, schedule, subZones |
| Fairway/Models/HeadData.swift | Sprinkler head model with audit fields |
| Fairway/Views/OverviewView.swift | Overview tab -- weather, alerts, audit progress, quick-log |
| Fairway/PreviewData.swift | Mock data with all 4 zones pre-seeded |

---

## Suggested next actions (pick one)

1. Phase 3 -- ET calculator + schedule hybrid override (WeatherKit/Open-Meteo, Hargreaves ET0, Kc KBG)
2. Phase 4 -- Problem auto-detection (7 rules in ProblemDetector service)
3. Docs-sweep: generate COVERAGE_ANALYSIS.md and PROPERTY_PLACEMENT.md from sprinklers.json
