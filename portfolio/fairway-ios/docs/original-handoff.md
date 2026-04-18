# Irrigation Optimizer iOS App — Project Handoff Document

## Project Overview

This document provides full context for building the **Irrigation Optimizer** iOS app. The app is a field companion tool for a homeowner in Salt Lake City, Utah managing a 4-zone Rachio smart irrigation system. It helps track zone health, log sprinkler head inventories, flag problem areas, and surface Rachio schedule recommendations.

---

## Background & Context

### The Property
- **Location:** Vineyard, Utah (Utah County — hot, dry summers; clay-heavy soil)
- **Controller:** Rachio smart irrigation controller
- **Total Zones:** 4
- **Primary constraint:** Utah clay soil requires Cycle & Soak scheduling and low-precipitation nozzles to prevent runoff

### The Zones (from Rachio app)

| Zone | Name | Type | Sq Ft | Head Type |
|------|------|------|-------|-----------|
| 1 | Shurbs | Shrubs/Bubblers | 106* | Bubblers |
| 2 | Front Yard | Cool Season Grass | 1,028 | Hunter Pro-Spray |
| 3 | West Side Backyard | Cool Season Grass | 998 | Hunter (series TBD) |
| 4 | East Side Backyard | Cool Season Grass | 711 | Hunter Pro-Spray |

*Zone 1 sq footage is Rachio's figure and is an undercount; estimated true area is 115–145 sq ft.

### Zone Layout (from satellite imagery)
- **Zone 2 (Front Yard):** L-shaped front lawn + park strip along street. Main lawn section + narrow park strip between sidewalk and street.
- **Zone 3 (West Side Backyard):** Tall, narrow rectangular strip running along the west side of the property, bounded by the house foundation on the east and a fence/wall on the west.
- **Zone 4 (East Side Backyard):** Irregular shape on the east side of the backyard, adjacent to patio hardscape. Bounded by east fence.
- **Zone 1 (Shrubs):** Three separate planter beds — Bed A (backyard along house with boxwoods and hydrangeas), Bed B (narrow strip near AC units), Bed C (driveway island with ornamental tree, boxwoods, and groundcover).

---

## Soil Test Results (Received April 2026)

Soil test performed by Jimmy Lewis (jimmylewismows.com) during an on-site consultation. Results received April 2, 2026.

### Raw Nutrient Data

| Nutrient | Result | Optimal Range | Rating |
|----------|--------|---------------|--------|
| Nitrogen (N) | 2.45 | 7.0–18.0 | **Low** |
| Phosphorous (P) | 5.09 | 5.0–11.0 | Optimal |
| Potassium (K) | 8.84 | 38.0–72.0 | **Low** |
| Sulfur (S) | 6.79 | 7.0–16.0 | Low |
| Calcium (Ca) | 790.95 | 93.0–314.0 | High |
| Magnesium (Mg) | 96.65 | 28.0–67.0 | High |
| Sodium (Na) | 1.81 | 0.5–30.0 | Optimal |
| Iron (Fe) | 1.15 | 4.0–11.0 | Low |
| Manganese (Mn) | 1.27 | 4.0–12.0 | Low |
| Zinc (Zn) | 0.02 | 0.1–0.25 | **Low** |
| Copper (Cu) | 0.02 | 0.07–0.28 | Low |
| Boron (B) | 0.01 | 0.22–0.66 | Low |
| pH | 6.75 | 5.8–7.0 | Optimal |

### Key Findings
- pH is optimal — no acidification needed
- Nitrogen and Potassium are the primary deficiencies; Potassium especially important heading into summer
- Micronutrients broadly low (Fe, Mn, Zn, Cu, B) — Yard Mastery products address these
- High Calcium and Magnesium are typical of Utah soils; not a concern
- ProPeat fertilizers recommended — peat moss coating improves organic matter and moisture retention in clay soil

### Full Season Fertilizer Plan

| Timing | Application |
|--------|-------------|
| Early spring | Pre-emergent: Yard Mastery Prodiamine OR Lesco Stonewall; IFA Humate @ 10 lb/1,000 sq ft |
| Early spring | Yard Mastery Flagship @ 3 lb/1,000 sq ft OR ProPeat 17-0-4 @ 4 lb/1,000 sq ft |
| Late spring | Yard Mastery Flagship @ 3 lb/1,000 sq ft OR ProPeat 17-0-4 @ 4 lb/1,000 sq ft + GrubEx |
| Summer | Yard Mastery Stress Blend @ 5 lb/1,000 sq ft OR ProPeat 10-0-10 @ 5 lb/1,000 sq ft |
| Early fall | Yard Mastery Flagship @ 3 lb/1,000 sq ft OR ProPeat 17-0-4 @ 4 lb/1,000 sq ft |
| Late fall | IFA Step 4 22-2-12 @ 4 lb/1,000 sq ft OR ProPeat 13-5-8 @ 6 lb/1,000 sq ft |

Applications every 5–6 weeks during the growing season. Spot spray weeds with TZone as needed.

### Additional Recommendation from Jimmy Lewis
- **Hydr8** (Yard Mastery liquid soil surfactant/wetting agent) — new product for 2026, applied monthly during summer with a sprayer. Helps water penetrate clay soil — directly relevant to irrigation efficiency.
- **ProPeat availability:** Great Basin Turf carries ProPeat; confirm they'll sell to residential customers.
- IFA Humate @ 10 lb/1,000 sq ft — apply twice a year; improves soil quality and nutrient processing over time.

### Irrigation Implications
- Low micronutrients + clay soil = poor water and nutrient uptake; improving soil structure (Humate, ProPeat) will compound the benefit of optimized irrigation
- Hydr8 wetting agent works synergistically with Cycle & Soak scheduling — helps water move through clay rather than running off
- Potassium deficiency increases heat/drought stress; dialed-in irrigation is especially important this summer while K levels are being corrected

---

## Detailed Zone Analysis

### Zone 1 — Shrubs/Bubblers

**Head Inventory:**
- Estimated 5–8 bubbler heads across 3 beds
- Exact head count unconfirmed (no close-up photos yet)

**Problem Areas:**
1. Plant compatibility issue — hydrangeas and boxwoods share a zone despite different water needs; hydrangeas need more frequent watering (CONFIRMED — structural constraint)
2. Exposed landscape fabric and thin mulch in Bed A (CONFIRMED)
3. High heat load in Bed B from AC exhaust affecting plant stress (CONFIRMED)
4. Rachio sq footage undercount — 106 recorded vs ~115–145 estimated (CONFIRMED)

**Recommended Changes:**
- Schedule biased toward hydrangea watering frequency
- Add mulch depth in Bed A
- Consider heat-tolerant plants or extra water for Bed B
- Update sq footage in Rachio when confirmed

**Rachio Schedule:**
- Mode: Flex Daily
- Nozzle type: Bubblers (set appropriate precipitation rate)
- Bias toward more frequent short runs due to hydrangea needs

---

### Zone 2 — Front Yard

**Head Inventory:**
- H2-1: Northeast corner of main lawn
- H2-2: Northwest corner of main lawn
- H2-3: Southeast area of main lawn (arc adjustment needed)
- H2-4: Park strip, east end
- H2-5: Park strip, west end (arc adjustment needed)
- H2-6: Center/transition area between park strip and main lawn
- (2 additional heads recommended for park strip — not yet installed)

**Problem Areas:**
1. Dry spots in park strip — PRE-SEASON/UNCONFIRMED
2. Dry spots in center of main lawn — PRE-SEASON/UNCONFIRMED
3. Overspray from H2-3 and H2-5 onto sidewalk/hardscape — PRE-SEASON/UNCONFIRMED
4. Weed pressure in park strip — likely from inconsistent irrigation coverage (PRE-SEASON)
5. Poor park strip soil — compacted, clay-dominant — PRE-SEASON

**Recommended Changes:**
- Add 2 heads to park strip (Hunter MP1000 strip nozzles)
- Add 1 center head to main lawn
- Adjust arc on H2-3 and H2-5 to eliminate hardscape overspray
- Upgrade all heads to Hunter MP Rotator nozzles (better for clay soil)

**Rachio Schedule:**
- Mode: Flex Daily
- Nozzle PR: ~0.4 in/hr (MP Rotators)
- Cycle & Soak: 4 min run / 40 min soak / 3 cycles
- Start time: 5:00 AM
- Grass: Kentucky Bluegrass

---

### Zone 3 — West Side Backyard

**Head Inventory:**
- H3-1: North end of strip (confirmed)
- H3-2: Mid-north area (confirmed)
- H3-3: Mid-south area (confirmed)
- H3-4: South end near patio transition (confirmed)
- H3-5: Along east fence line (UNCONFIRMED — PRE-SEASON)

**Problem Areas:**
1. Significant coverage gap along east fence line — PRE-SEASON/UNCONFIRMED
2. Likely misdirected head near house foundation causing soggy conditions — PRE-SEASON/UNCONFIRMED
3. Probable hardscape overspray near patio — PRE-SEASON/UNCONFIRMED
4. Nozzle type unconfirmed — precipitation rate mismatch possible — PRE-SEASON

**Recommended Changes:**
- Rotate/adjust H3-3 away from foundation
- Add 2 new heads along east fence
- Full nozzle audit on all heads for matched precipitation rates
- Consider MP Rotator upgrade for clay soil performance

**Rachio Schedule:**
- Mode: Flex Daily
- Nozzle PR: TBD (pending nozzle audit)
- Cycle & Soak: 4 min / 40 min / 3 cycles (adjust after nozzle confirmation)
- Start time: 5:00 AM

---

### Zone 4 — East Side Backyard

**Head Inventory:**
- H4-1: Southwest corner near patio edge (confirmed — overspray issue)
- H4-2: Center of zone (confirmed)
- H4-3: North/back of zone (confirmed)

**Problem Areas:**
1. Overspray from H4-1 onto patio hardscape — CONFIRMED
2. Dry strip along east fence — PRE-SEASON/UNCONFIRMED
3. Coverage gap in NE corner — PRE-SEASON/UNCONFIRMED
4. Uneven distribution pattern across zone — PRE-SEASON/UNCONFIRMED

**Recommended Changes:**
- Adjust H4-1 arc to eliminate patio overspray (priority — confirmed issue)
- Add 1 head along east fence
- Evaluate head spacing for full coverage

**Rachio Schedule:**
- Mode: Flex Daily
- Nozzle PR: ~1.5–2.0 in/hr (fixed spray — Hunter Pro-Spray)
- Note: Fixed spray + clay soil = high runoff risk; Cycle & Soak critical
- Cycle & Soak: 3 min / 45 min / 3 cycles
- Start time: 5:00 AM
- Grass: Kentucky Bluegrass

---

## Key Principles for the App

### Pre-Season Notation System
All findings made before the irrigation season starts must be flagged as **PRE-SEASON — UNCONFIRMED**. The first manual zone test run of the season is the key diagnostic checkpoint to confirm or update these findings. The app must make this distinction clear and persistent.

### Soil Context
Utah clay soils drive nearly every technical recommendation:
- Low infiltration rate (~0.2 in/hr)
- Cycle & Soak scheduling prevents surface runoff
- MP Rotator nozzles (Hunter) preferred — lower precipitation rate (~0.4 in/hr) matches clay infiltration better than fixed sprays (~1.5–2.0 in/hr)
- Soil test results are pending and may refine infiltration rate settings

### Zone 1 Plant Compatibility
The hydrangea/boxwood compatibility issue in Zone 1 is a structural constraint, not a scheduling fix. Hydrangeas need more frequent, deeper watering than boxwoods. The schedule must bias toward hydrangea needs, which may slightly overwater boxwoods — this trade-off is intentional.

---

## App User Flow

```
Launch
  └─ Zone Dashboard (4 zone cards)
       ├─ Tap Zone Card
       │    └─ Zone Detail (tabbed)
       │         ├─ [Heads Tab] Head inventory list
       │         │    └─ Tap head → Head detail/edit
       │         │    └─ + button → Add head
       │         ├─ [Problems Tab] Problem area list
       │         │    └─ Tap problem → Problem detail/edit
       │         │    └─ + button → Add problem
       │         └─ [Schedule Tab] Rachio schedule settings
       │              └─ Edit button → Edit schedule fields
       └─ Settings (future)
```

---

## Design Decisions & Rationale

| Decision | Rationale |
|----------|-----------|
| SwiftUI + SwiftData | Modern Apple stack, no external dependencies, clean MVVM |
| iOS 17 minimum | Required for SwiftData |
| iPhone only | Field use case; tablet not needed |
| No Rachio API | Rachio API access not available; app is a manual tracking companion |
| Pre-seeded data | All 4 zones already analyzed; app should launch with real data |
| Pre-season badge system | Critical UX requirement — unconfirmed findings must be visually distinct |

---

## Pending Items (to incorporate when available)

1. **Soil test results** — will refine infiltration rate and Cycle & Soak timing
2. **Nozzle close-up photos** — will confirm Zone 3 head/nozzle type; may affect Zone 2 and 4 recommendations
3. **Season start manual test runs** — will confirm or resolve all PRE-SEASON flagged items
4. **Zone 3 head series confirmation** — Hunter brand confirmed, specific nozzle series unknown

---

## Files Reference

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Claude Code project instructions (tech stack, models, features) |
| `HANDOFF.md` | This file — full domain context and zone analysis data |

---

## Quick Reference: Rachio Schedule Parameters

| Zone | Mode | Nozzle PR | Run Time | Soak | Cycles | Grass |
|------|------|-----------|----------|------|--------|-------|
| 1 | Flex Daily | Bubbler ~0.5 in/hr | 5 min | 30 min | 2x | N/A (shrubs) |
| 2 | Flex Daily | MP Rotator ~0.4 in/hr | 4 min | 40 min | 3x | KBG |
| 3 | Flex Daily | TBD — audit first | 4 min | 40 min | 3x | Cool season |
| 4 | Flex Daily | Fixed spray ~1.5 in/hr | 3 min | 45 min | 3x | KBG |

KBG = Kentucky Bluegrass
All schedules: Start time 5:00 AM, Flex Daily mode
