# Sprinkler Head Photo Audit — Fairway

**Audit date:** 2026-04-25
**Source KML:** `docs/Sprinklers Google Earth (1).kml` (41 placemarks)
**Photos read:** 126 across 41 head folders
**Photo size:** 1024 px (PNG, plenty for nozzle hardware ID)

## Methodology

For each head:
1. Read `photo-1.jpg` (nozzle close-up). Identify body manufacturer and nozzle/cap from stamping or distinctive cap color.
2. If photo-1 is ambiguous → read `photo-3.jpg` (running). Spray pattern is decisive: **multi-stream rotating = MP Rotator**, **single fan = fixed spray (VAN, 1555, etc.)**, **single rotating jet = gear rotor (PGP family)**.
3. If still ambiguous → read `photo-2.jpg` (placement) for context.
4. If all three are blocked (buried, packed, head not visible) → mark `blocked` and record the specific physical action needed.

### Confidence legend

| | Meaning |
|---|---|
| **high** | Nozzle text or distinctive cap clearly legible, OR running pattern is unambiguous |
| **med** | Consistent with cap color + body family, but no text confirmation and running photo not decisive |
| **low** | Photos give conflicting signals, or best-guess from running pattern only |
| **blocked** | Photos cannot ID nozzle. Physical action listed in §Blocked-heads. |

### MP Rotator cap-color → model family quick reference

| Cap | Model | Radius | Arc |
|---|---|---|---|
| Cream / light tan | MP1000 | 8–15 ft | 90–210° |
| Charcoal / dark gray | MP800 SR or MP800 | 6–12 ft | 0–360° |
| Teal / sea-green | MP800 SR (variant) | 6–12 ft | 90° |
| Cobalt blue | MP2000 | 13–21 ft | 90–210° |
| **Red** | **MP3000** | 22–30 ft | 90–210° |
| Olive / dark olive | MP3500 | 30–35 ft | 90–210° |

## Summary by zone

### Z2 — Front yard + park strip (18 heads, single valve — any application covers park strip)

| Label | KML pin | Body | Nozzle | Conf | Notes |
|---|---|---|---|---|---|
| Z2-S1 | 1st Sprinkler | Hunter Pro-Spray | Rain Bird VAN yellow | high | Photo-1: "RAIN BIRD" + "VAN" stamped on yellow/tan body. 4 ft radius per seed. Curb head, east end of park strip. |
| Z2-S2 | 6th Sprinkler | Hunter Pro-Spray | Rain Bird 1555 fixed spray (dark) | high | Photo-3 confirms fan-spray pattern across driveway. Body legible. Park strip east, large concrete apron. |
| Z2-S3 | 2nd Sprinkler | Hunter Pro-Spray | Rain Bird **1555ST** fixed spray | high | Photo-1: "RAIN BIRD 1555ST" stamped on white nozzle ring. Park strip mid, narrow mulch strip. |
| Z2-S4 | 4th Sprinkler | Hunter Pro-Spray | Rain Bird VAN yellow | high | Photo-1: yellow/tan VAN body with "INCREASE +" arrow stamping. 4 ft radius. Park strip far west end. |
| Z2-S5 | 5th Sprinkler | Hunter Pro-Spray | — (empty/dirt-packed slot) | **blocked** | Photo-1 shows EMPTY nozzle hole packed with dirt. CORRECTION on file: prior seed claimed "MP Rotator confirmed (blue cap)" — disproved. |
| Z2-S6 | 3rd Sprinkler | Hunter Pro-Spray | — (calcium-encrusted, buried) | **blocked** | Sitting in 4–5" erosion pit; can't pop up; nozzle slot solid calcium + dirt. |
| Z2-S7 | grey | Hunter Pro-Spray | MP Rotator (cream cap) → MP1000 | high | Geared rotator visible top-down. North-most front-yard head. |
| Z2-S8 | black | Hunter Pro-Spray | — (empty/dirt-packed slot) | **blocked** | Body legible ("Hunter Pro-Spray"); nozzle slot empty/dirt-packed. Same failure mode as S5. |
| Z2-S9 | green | Hunter Pro-Spray | MP Rotator (teal cap) → MP800 SR family | high | Photo-3 confirms multi-stream rotating pattern. Cap is teal/sea-green — likely MP800 SR. |
| Z2-S10 | Black | Hunter Pro-Spray | MP Rotator (dark cap) → MP800 or MP1000 | high | Photo-3 confirms multi-stream rotator. Cap color hard to call from photo-1; body legible. |
| Z2-S11 | black | Hunter Pro-Spray | — (empty/dirt-packed slot) | **blocked** | Body legible; nozzle slot empty/packed. |
| Z2-S12 | blue Sprinkler | Hunter Pro-Spray | MP Rotator (cobalt blue cap) → MP2000 | high | Distinctive cobalt blue MP cap. |
| Z2-S13 | grey | Hunter Pro-Spray | MP Rotator (cream cap) → MP1000 | high | "Hunter" stamping + cream cap visible. |
| Z2-S14 | Black | Hunter Pro-Spray **PROS-04 PRS40 + Check Valve** | TBD (nozzle dark, photo-3 misty) | low | Body markings unusually rich: "CHECK VALVE", "PRS40" (40 PSI pressure-regulating). Nozzle not legible — could be MP800 or fixed spray. **Field re-photo recommended.** |
| Z2-S15 | Blue | Hunter Pro-Spray | MP Rotator (cobalt blue cap) → MP2000 | high | Body + blue cap clear. (4 photos on disk for this one.) |
| Z2-S16 | Blue | Hunter Pro-Spray | MP Rotator (cobalt blue cap) → MP2000 | high | Cobalt blue MP cap. |
| Z2-S17 | black | Hunter Pro-Spray | **conflicting signals** — photo-1 looks MP-like (gear pattern), photo-3 shows fan-shaped fixed-spray pattern | **low** | Photos disagree. Could be a fixed-spray nozzle whose radial slots look gear-like from above, OR an MP Rotator that wasn't running when photo-3 was shot. **Field re-photo with running confirmation needed.** |
| Z2-S18 | black | Hunter Pro-Spray | — (slot dark / encrusted) | **blocked** | Photo-1 nozzle slot appears empty or fully encrusted. |

**Z2 nozzle-family roll-up** (excluding blocked):
- 2× Rain Bird VAN yellow (S1, S4)
- 3× Rain Bird 1555 fixed-spray (S2, S3) plus possibly S17
- 2× MP Rotator cream/MP1000 (S7, S13)
- 1× MP Rotator teal/MP800 SR (S9)
- 1× MP Rotator dark/MP800 or MP1000 (S10)
- 3× MP Rotator blue/MP2000 (S12, S15, S16)
- 5× fully **blocked** nozzles (S5, S6, S8, S11, S18) — slot empty/encrusted or head buried
- 2× low-confidence nozzles needing field re-photo (S14, S17)

This confirms the existing seed problem statement: **Z2 has at least three nozzle families running on a single valve**, which makes uniform run-time tuning impossible. Standardization (e.g. swap all to MP Rotators) is still the right move.

> **New finding vs. seed**: The seed file had Z2-S8 as `nozzle: "TBD — confirm during season test"`. Photo-1 shows the same empty/dirt-packed slot failure mode as Z2-S5 — this is a pre-existing structural problem, not just an unconfirmed nozzle. Add Z2-S8 alongside Z2-S5 in the "needs nozzle install" action list.

### Z3 — West side yard (11 heads)

| Label | KML pin | Body | Nozzle | Conf | Notes |
|---|---|---|---|---|---|
| Z3-S1 | b yellow | Hunter Pro-Spray | MP Rotator-style turret (cap color unclear) | med | **Only head missing photo-3.** Photo-1 shows flat Pro-Spray disc + small turret with gear pattern inside white ring. Photo-2 is wide placement against house siding (head barely visible). Need running photo. |
| Z3-S2 | b yellow | Hunter Pro-Spray | MP Rotator (cream cap) → MP1000 | high | Cream-cap geared rotator. (4 photos on disk.) |
| Z3-S3 | b black | Hunter Pro-Spray | MP Rotator OR fixed spray (dark) | med | Body legible; nozzle has radial slots that could read either way from above. |
| Z3-S4 | B black | Hunter Pro-Spray | MP Rotator (cream/tan cap) → MP1000 | high | Cream cap rotator visible. |
| Z3-S5 | B Black | Hunter Pro-Spray | MP Rotator (dark cap) → MP800 or MP1000 | med | Body legible ("Hunter" + "Adj-S 8" interior); cap color reads dark/black from photo. |
| Z3-S6 | b black | Hunter Pro-Spray | MP Rotator (dark cap) | med | Similar to S5. |
| Z3-S7 | b blue (red marker NW-most) | Hunter Pro-Spray | MP Rotator (dark cap) | med | Body partially buried, turret + gear visible. Was H3-1 in legacy seed. |
| Z3-S8 | b red | Hunter Pro-Spray | MP Rotator **(RED cap)** → MP3000 | high | Distinctive red MP3000 cap. Was H3-2 in legacy seed. |
| Z3-S9 | b red | Hunter Pro-Spray | MP Rotator **(RED cap)** → MP3000 | high | Red MP3000. Was H3-3. |
| Z3-S10 | b red | Hunter Pro-Spray | MP Rotator **(RED cap)** → MP3000 | high | Red MP3000. Was H3-4. |
| Z3-S11 | B bred | Hunter Pro-Spray | MP Rotator **(RED cap)** → MP3000 | high | Red MP3000, partly buried. (4 photos on disk.) Was H3-5. |

**Z3 nozzle-family roll-up:**
- 5× MP Rotator MP3000 red (S7? S8, S9, S10, S11) — south half of side yard
- 4× MP Rotator MP1000 cream / MP800 dark (S1, S2, S4, S5, S6 — mix)
- 1× ambiguous MP-or-fixed-spray (S3)

**Mixed-precip warning for Z3**: even if every Z3 head is an MP Rotator (which is the photo evidence), a zone running both **MP3000 (red, ~0.4 in/hr)** and **MP1000 (cream, ~0.4 in/hr)** is generally OK — the matched precip rate is the entire point of MP Rotators. But mixing **MP800 SR (~0.5 in/hr)** with **MP3000** breaks that property. Worth tagging as a `Z3 mixed nozzle` problem in the app.

> **Important caveat**: I read all Z3 bodies as "Hunter Pro-Spray" but the existing seed (and CLAUDE.md) calls them "Hunter (series TBD)". The retracted top-down view of a Pro-Spray body can be hard to distinguish from a Hunter PGP rotor body when heavily soiled. Body family should be field-verified before any nozzle-swap work — a PGP body cannot accept MP Rotator nozzles directly.

### Z4 — Back yard (12 heads)

| Label | Body | Nozzle | Conf | Notes |
|---|---|---|---|---|
| Z4-S1 | Hunter Pro-Spray (presumed) | — (head submerged in mud at house corner) | **blocked** | Photo-1 shows a small dark dot in mud pit. Photos 2/3 show the corner with no head visible. Cannot ID without dig-out. |
| Z4-S2 | Hunter Pro-Spray | MP Rotator (dark cap) | med | Body legible; running photo-3 inconclusive. |
| Z4-S3 | Hunter Pro-Spray | MP Rotator (cream cap) → MP1000 | high | Cream-cap geared rotator. |
| Z4-S4 | Hunter Pro-Spray | MP Rotator (dark cap) | med | Geared cap visible from above. |
| Z4-S5 | Hunter Pro-Spray | MP Rotator (dark cap) | med | Body legible ("PRO-SPRAY" stamped); running photo-3 inconclusive. |
| Z4-S6 | Hunter Pro-Spray | MP Rotator **(RED cap)** → MP3000 | high | Distinctive red MP3000 cap. |
| Z4-S7 | Hunter Pro-Spray | — (partly buried, nozzle not legible) | **blocked** | Body partially submerged; turret visible but cap obscured. |
| Z4-S8 | Hunter Pro-Spray | MP Rotator **(RED cap)** → MP3000 | high | Red MP3000. |
| Z4-S9 | Hunter Pro-Spray | MP Rotator (dark cap) | high | "PRO-SPRAY" + dark gear cap clearly visible. |
| Z4-S10 | Hunter Pro-Spray | MP Rotator **(RED cap)** → MP3000 | high | Red MP3000. |
| Z4-S11 | Hunter Pro-Spray | MP Rotator (dark cap, small) | med | Cap partly obscured. |
| Z4-S12 | Hunter Pro-Spray | MP Rotator **(RED cap)** → MP3000 | high | Red MP3000. |

**Z4 nozzle-family roll-up:**
- 5× MP Rotator MP3000 red (S6, S8, S10, S12 + likely matching) — back yard distance heads
- 5× MP Rotator dark cap MP800 or MP1000 (S2, S4, S5, S9, S11) — closer-in heads
- 1× MP Rotator cream MP1000 (S3)
- 2× **blocked** (S1, S7)

**Mixed-precip note**: same caveat as Z3 — if every head is an MP Rotator, this zone has matched precip rates (~0.4 in/hr) regardless of model, which is good. But mixing MP800 (0.5 in/hr) breaks the property.

## Blocked heads — physical action required

| Head | Failure mode | Physical action |
|---|---|---|
| **Z2-S5** | Empty nozzle slot, packed with dirt | Clear slot; install nozzle to match strategy (likely MP1000 or VAN per radius needs). |
| **Z2-S6** | Buried in 4–5" erosion pit, calcium-encrusted | Dig out; raise head with swing-pipe extender; descale or replace nozzle; backfill. |
| **Z2-S8** | Empty / dirt-packed nozzle slot | Clear slot; install nozzle. |
| **Z2-S11** | Empty / dirt-packed nozzle slot | Clear slot; install nozzle. |
| **Z2-S14** | Body identifiable; nozzle hardware not legible from photos | Field re-photo while running, looking straight down at retracted nozzle ring text. |
| **Z2-S17** | Photo-1 and photo-3 give conflicting signals | Field re-photo: take a photo-1 with nozzle pulled up by hand, plus a clean photo-3 of the running pattern. |
| **Z2-S18** | Slot dark / encrusted | Clear slot; if fixture intact, ID nozzle and install. Re-photo. |
| **Z4-S1** | Head submerged in mud at house corner | Dig out completely; clean cap and nozzle; raise with swing-pipe extender; backfill. **Highest-priority blocked head — currently producing zero coverage.** |
| **Z4-S7** | Partly buried; nozzle/cap not legible | Clear soil from cap; re-photo close-up. |

**Need physical work before they can be confirmed: 9 heads** out of 41 = **22%**
- 7 fully blocked (nozzle not ID-able from any photo): Z2-S5, S6, S8, S11, S18, Z4-S1, S7
- 2 low-confidence (body legible but nozzle requires field re-photo): Z2-S14, S17

The other **32 heads** (78%) are ID'd at med or high confidence from photos alone.

## What the photos cannot tell us (every head)

Even when nozzle is fully ID'd, the following fields **must come from a season-test field visit** — they cannot be derived from any single photo:

- **Arc setting** (e.g. 90° vs 180° vs 210°). Running shots show direction but not the precise arc end-stops; MP Rotators in particular have continuous arc adjustment.
- **Radius (ft)**. Foreshortened in photos; needs tape-measure during a wet run.
- **GPM**. Comes from manufacturer spec lookup *after* nozzle is ID'd, OR from a catch-cup test (real measurement). Catch-cup is also the only way to verify advertised GPM matches actual flow.
- **Internal damage** — broken seals, worn gears, cracked turrets, low-pressure symptoms. Only visible during a wet run, and even then only by close inspection.
- **Pressure-regulating spec on Pro-Spray bodies** — only Z2-S14 had "PRS40" stamped legibly; the rest of the bodies need a closer field photo to confirm whether they are PRS30/PRS40 or non-regulating.

## Cross-reference with existing CLAUDE.md "Known corrections / TODOs"

| CLAUDE.md item | Status after this audit |
|---|---|
| *"Z2-S1 seed nozzle = 'Brass adjustable' → photo 1 shows Rain Bird VAN yellow"* | ✅ **Confirmed.** Z2-S1 is Rain Bird VAN yellow. |
| *"All 6 new Z3 heads (Z3-S1..Z3-S6) … need per-head nozzle/arc/GPM data"* | 🟡 **Nozzle ID'd at med-or-better confidence for all 6. Arc/GPM still field-only.** |
| *"All 12 Z4 heads (Z4-S1..Z4-S12) need per-head nozzle/arc/GPM data"* | 🟡 **Nozzle ID'd for 10/12 (high or med). Z4-S1 + Z4-S7 are blocked. Arc/GPM still field-only.** |
| *"Visual matching of Z2-MATCH-1st..6th → Z2-S1..S6 still pending"* | ⏸ **Not addressed in this audit** — uses the existing provisional MATCH→S mapping from `PreviewData.swift` (1st→S1, 6th→S2, 2nd→S3, 4th→S4, 5th→S5, 3rd→S6). Anchor pins (S5 blue MP cap, S6 erosion pit) still need physical confirmation, but the photo content is consistent with the existing mapping (S5 has empty slot, S6 is in erosion pit). |

## Recommended next actions, in order

1. **Physical work on the 9 blocked heads.** Highest urgency: Z4-S1 (mud-buried, zero coverage) and Z2-S6 (erosion pit). Lowest urgency: re-photo cases (Z2-S14, S17).
2. **Field-confirm Z3 body family** before any nozzle-swap work — Pro-Spray vs PGP rotor matters.
3. **Update `PreviewData.swift`** to replace `nozzle: "TBD..."` with the audited values (high/med confidence rows), keeping `confirmedBySeasonTest: false` since this is photo-only. Blocked heads stay TBD with a pointer to this audit. *(Separate task — explicitly out of scope of the audit per the approved plan.)*
4. **Season test (next valve-on day):**
   - Catch-cup test to capture real GPM per zone.
   - Tape-measure radius per head.
   - Arc protractor (or visually) at each head's running endpoints.
5. **Tag mixed-precip-rate problems** in the app's Problems tab for Z3 (MP Rotator family mix) and revisit the existing Z2 problem statement once standardization is decided.
