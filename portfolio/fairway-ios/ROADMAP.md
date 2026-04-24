# Fairway iOS — Roadmap

## Phase 1 — MVP (current)
- [x] All data models + FairwayBlob
- [x] FairwayStore with seedIfNeeded()
- [x] 5-tab layout
- [x] Zone dashboard + detail (Heads/Problems/Schedule/Beds)
- [x] PRE-SEASON / CONFIRMED badge system
- [x] Fertilizer season plan with date windows + product links
- [x] Inventory management (products + equipment + stock log)
- [x] Spreader calculator
- [x] Soil test display
- [x] Shrub bed tracking
- [x] Maintenance tasks + mow log

## Phase 2 — Polish
- [ ] App icon (1024×1024 — Augusta green + white sprinkler arc)
- [ ] Local notifications for maintenance reminders (UNUserNotificationCenter)
- [ ] Empty state illustrations
- [ ] Onboarding flow (first-launch instructions)

## Phase 3 — Field Tools
- [ ] Camera integration for head photos
- [ ] QR/barcode scanner for product lookup
- [x] Map/satellite zone layout view — `HeadPinEditor.swift` WIP on `main` (MapKit + drag handles for bearing/arc)

## Phase 4 — Cloud
- [ ] iCloud or Supabase sync stub
- [ ] Export to PDF (season report)

## Rachio Integration

- [x] v1 read-only (shipped 2026-04-24): Keychain-secured token, fetch person/device/zones/schedule rules/events, auto-link zones by number, zone-link picker, ScheduleView "Rachio says" mirror card, Watering History view
- [ ] v1 runtime verification — install iOS 17.2 simulator runtime; run `xcodebuild test`; first-run Connect flow; sync; zone-link; bad-token; persistence; migration
- [ ] v2 — manual zone start/stop + pause controls (write operations, requires separate scope)
- [ ] v2 — background sync (BGAppRefreshTask) so watering history fills without open-app taps
- [ ] v2 — derive real precip rate per zone from Rachio "nozzle precip" field and stamp onto HeadData

## Active Remediation (post 2026-04-23 over-application)

- [ ] Data entry per `/Users/chase/.claude/plans/what-went-wrong-here-playful-lemur.md` — IFA inventory, fert app log, 6 Z2 heads, mixed-precip ProblemArea, 9 maintenance tasks
- [ ] Measure park strip width (4-6 ft → MP800SR; 6-8 ft → MP1000) — due 2026-04-26
- [ ] Verify Z2-S5 MP Rotator cap color (blue=MP1000, purple=MP800SR) — due 2026-04-26
- [ ] Order 5× MP Rotator nozzles (~$50) — due 2026-04-27
- [ ] Dig out + raise Z2-S6 with swing pipe — due 2026-04-25
- [ ] Install 5× MP Rotator nozzles + tune Z2 run-time (~3× longer than sprays) — due 2026-05-04

## Ideas Backlog
- Weather integration (manual rainfall entry)
- Push spreader support (when HHS100 is replaced)
- Zone coverage map (draw spray arcs on satellite image) — partially addressed by `HeadPinEditor`
- **Schema bump:** add `precipRateInPerHour: Double?` to `HeadData` — would be the right home for the precip-mismatch story
- **Schema bump:** add `photos: [URL]` to `HeadData` so head photos don't have to live in Photos/Google Earth
- **Calibration log:** structured calibration entries on `InventoryItem` (date, dial, target lb, actual lb, pass/fail) so the calibration discipline is enforced by the data model
