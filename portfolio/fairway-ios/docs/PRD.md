# PRD — Fairway

## V1 features

1. **Zone management** — 4 zone cards on home screen; ZoneDetailView with Heads, Problems, Schedule tabs; Zone 1 adds a 4th Beds tab.
   Done when: All 4 zones render with status dot; tapping a zone opens detail; heads, problems, and schedule each display seeded data.

2. **Sprinkler heads** — per-zone list with head type, GPM, arc, coverage notes; PRE-SEASON badge on `isPreSeason: true` heads.
   Done when: Heads list renders; amber PRE-SEASON badge shows on flagged heads; no badge on confirmed heads.

3. **Problem areas** — per-zone issue log with description, severity, and confirmation status; red CONFIRMED badge on confirmed items.
   Done when: Problem list renders; red CONFIRMED badge shows on confirmed rows; amber PRE-SEASON badge shows on unconfirmed.

4. **Rachio schedules** — per-zone schedule detail (program name, type, start time, Cycle & Soak settings); Utah clay Cycle & Soak default.
   Done when: Schedule tab renders schedule data; Cycle & Soak values are present.

5. **Shrub beds (Zone 1)** — Beds A, B, C with plant list and per-bed upkeep tasks.
   Done when: Beds tab renders in Zone 1 detail only; each bed shows its plant list and task rows.

6. **Fertilizer season plan** — 6 application windows with product name, rate, date range, and product link; calibrated for Vineyard, UT zone 6b.
   Done when: All 6 applications render with date windows; product link taps open a URL.

7. **Spreader calculator** — input lawn sq ft; output lbs required, bags needed, refill count, and dial setting for the selected product.
   Done when: User enters area; calculator returns correct lbs, bags, and dial values.

8. **Soil test view** — 13 nutrients as a bar chart with current value, ideal range, and a finding note from the April 2026 test.
   Done when: Chart renders all 13 nutrients; pH 6.75 and low N+K readings are present.

9. **Maintenance** — task list with season test checklist and reminder support; mow log with date and notes.
   Done when: Task list renders; mow log accepts a new entry; season checklist items are tappable.

10. **Inventory** — products and equipment with stock qty, service history log, and add/edit actions.
    Done when: Inventory renders seeded products and equipment; stock log entries are visible.

11. **Persistence** — single JSON blob at `UserDefaults` key `chase_fairway_ios_v1`; `seedIfNeeded()` pre-populates all zones on first launch.
    Done when: Kill and relaunch app — all data persists; fresh install seeds correctly.

---

## NOT in V1

- iCloud or Supabase sync (data stays local)
- Rachio API integration (schedules are entered manually)
- Push notifications or reminders beyond native iOS reminders
- Weather or ET-based watering recommendations
- Photo attachments on problem areas
- Multi-property / multi-controller support
- App Store submission

---

## Prior art & positioning

Verdict: PROCEED
Alternatives found:
  - Rachio app — controls schedules and runtime, no agronomic record-keeping or soil data
  - Lawn Love / Sunday — subscription lawn care services, not self-managed tracking tools
  - Notes / Reminders — no structure for zones, nutrients, or spreader math
Justification: No app combines Rachio zone detail, soil test tracking, fertilizer scheduling, and spreader calculation in one structured local tool.
Positioning: Fairway is the ops log for a homeowner who treats their lawn like a superintendent treats a course.

---

## Constraints

- Platform: iOS 17+, SwiftUI, `@Observable @MainActor` store
- Storage: `UserDefaults` (single JSON blob at `chase_fairway_ios_v1`), `Codable` structs only — never `[String: Any]`
- Stack: SwiftUI + `@Observable` — no SwiftData, no external dependencies
- Bundle ID: `com.chasewhittaker.Fairway`
- Xcode prefix: FW

---

## Success metrics

- Chase uses Fairway as his sole reference during at least one full spring setup session (zone check, fertilizer pull, spreader dial).
- All seeded zone, soil, and fertilizer data is accurate enough that Chase corrects it rather than ignores it.

---

## Risks

1. **Seeded data goes stale.** Mitigation: edit flows for all models before Phase 2 ends; Chase updates data in-app rather than in code.
2. **Spreader calc is wrong for a product.** Mitigation: show the formula (lbs = area × rate; bags = lbs / bag size) so Chase can verify; flag as "check bag label."
3. **UserDefaults blob grows unwieldy.** Mitigation: keep the blob under 200 KB by not storing binary data; add a JSON export to `More` tab in Phase 2 if needed.
