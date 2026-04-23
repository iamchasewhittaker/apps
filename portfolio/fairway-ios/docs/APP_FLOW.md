# App Flow — Fairway

## Primary flow — spring zone check

The one path that proves the app is worth opening on the first day of the season.

1. User launches Fairway. → `seedIfNeeded()` runs on first launch; ZoneList renders 4 zone cards with status dots.
2. User taps Zone 1 (Front). → ZoneDetailView opens; tabs: Heads / Problems / Schedule / Beds.
3. User taps Heads tab. → Head list renders; PRE-SEASON amber badges on flagged heads.
4. User taps a head to review coverage notes. → Head detail shows type, GPM, arc, and notes.
5. User taps Problems tab. → Problem list renders; CONFIRMED red badges on confirmed areas.
6. User taps Schedule tab. → Schedule shows program name, type, start time, Cycle & Soak values.
7. User taps Beds tab (Zone 1 only). → Beds A/B/C render with plant list and upkeep tasks.
8. User navigates to Lawn tab → FertilizerView. → 6 season applications with date windows and product links.
9. User taps SpreaderCalc. → Enters lawn area; app returns lbs required, bags needed, refill count, dial setting.
10. User navigates to Soil tab. → 13-nutrient bar chart with April 2026 readings and findings.

End state: Chase knows which zones need pre-season head check, what fertilizer is due, the spreader dial setting, and what the soil needs.

---

## Alternate flows

**Empty state — fresh install, seed not run.**
`seedIfNeeded()` fires synchronously on `FairwayStore` init. Empty state should never be user-visible unless seed data is stripped. If it somehow occurs: ZoneList shows "No zones yet." with a soft gray message.

**Error state — UserDefaults decode failure.**
If the JSON blob fails to decode (schema mismatch after an update), `FairwayStore` catches the error and falls back to `seedIfNeeded()`. A banner or console log should record the failure. User sees fresh seeded data rather than a crash.

**Phase 2 — edit flow (not yet built).**
User will eventually long-press or tap an edit button on a head, problem, or task. That flow is deferred. V1 is read-only + spreader calc.

---

## Screens

| Screen | Purpose | Empty state | Error state |
|--------|---------|-------------|-------------|
| ZoneList (ContentView tab 1) | 4 zone cards with status dots | "No zones yet." (seed failure only) | — |
| ZoneDetailView | Per-zone detail; 3–4 tabs | No heads / No problems shown with placeholder text | — |
| HeadDetailView | Single head detail | — | — |
| FertilizerView (Lawn tab) | 6-application season plan | — | — |
| SpreaderCalcView | Area input → lbs / bags / dial | Zero state: all outputs show 0 until area entered | — |
| ShrubBedView | Beds A/B/C with plants + tasks | "No beds configured." if empty | — |
| SoilTestView | 13-nutrient bar chart + findings | — | — |
| MaintenanceView | Task list + season checklist | "No tasks." | — |
| MowLogView | Mow date log with notes | "No mow entries yet." | — |
| InventoryView (More tab) | Products + equipment + stock log | "No items." | — |

---

## Accessibility notes per screen

**ZoneList**
- Zone cards: minimum 44pt tap target on the card itself; status dot does not need to be tappable alone.
- VoiceOver label: "Zone [name], [active/inactive]." Status dot color must not be the sole indicator — use `accessibilityLabel` with status text.
- Contrast: accent green `#15803D` on surface `#112417` — verify 4.5:1 at all text sizes.
- Dynamic Type: zone name uses `.headline`; scales automatically.

**ZoneDetailView**
- Tab bar labels: "Heads," "Problems," "Schedule," "Beds" — text labels present; not icon-only.
- VoiceOver focus order: tab picker → list content.

**HeadDetailView / Problem rows**
- PRE-SEASON and CONFIRMED badges: include badge text in VoiceOver label ("PRE-SEASON — review before activating"), not just color.
- Minimum row height 44pt.

**SpreaderCalcView**
- Input field: label "Lawn area in square feet" is explicit, not placeholder-only.
- Output values: read aloud as "[value] pounds required," not bare numbers.
- `.monospacedDigit()` on output numbers for alignment.

**SoilTestView**
- Bar chart: each bar has an `accessibilityLabel` — "[nutrient]: [value], ideal [range], [below/within/above] range."
- Chart does not rely on color alone — bar length is the primary signal; color is secondary.

**MaintenanceView / MowLogView**
- Checkboxes: 44pt targets; toggled state read as "checked" / "unchecked" by VoiceOver.

**InventoryView**
- Stock log rows: 44pt minimum.

**Global**
- All text supports Dynamic Type. No hardcoded font sizes except `.monospacedDigit()` output.
- Dark mode only (Augusta palette); no light mode variant in V1.

---

## Data model sketch

```
FairwayBlob: Codable
  zones: [Zone]
  fertilizerPlan: [FertApplication]
  soilTest: SoilTest
  maintenanceTasks: [Task]
  mowLog: [MowEntry]
  inventory: Inventory

Zone: Codable, Identifiable
  id, name, status: ZoneStatus
  heads: [Head]
  problems: [Problem]
  schedule: Schedule
  beds: [ShrubBed]?         // Zone 1 only; nil for zones 2-4

Head: Codable, Identifiable
  id, name, type, gpm, arc, notes, isPreSeason: Bool

Problem: Codable, Identifiable
  id, description, severity, isConfirmed: Bool, isPreSeason: Bool

Schedule: Codable
  programName, type, startTime, cycleMinutes, soakMinutes, frequency

ShrubBed: Codable, Identifiable
  id, name, plants: [String], tasks: [Task]

FertApplication: Codable, Identifiable
  id, applicationNumber, productName, rate, startDate, endDate, productURL

SoilTest: Codable
  date, nutrients: [NutrientReading]

NutrientReading: Codable, Identifiable
  id, name, value, idealMin, idealMax, finding

Task: Codable, Identifiable
  id, title, isComplete, dueDate?

MowEntry: Codable, Identifiable
  id, date, notes

Inventory: Codable
  products: [Product], equipment: [Equipment]

Product: Codable, Identifiable
  id, name, category, stockQty, unitSize, log: [StockLogEntry]

Equipment: Codable, Identifiable
  id, name, serviceHistory: [ServiceEntry]
```
