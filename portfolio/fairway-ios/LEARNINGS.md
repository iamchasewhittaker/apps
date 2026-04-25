# Fairway iOS — Learnings

## SwiftData vs @Observable + Codable

**Decision date:** 2026-04-18

Considered SwiftData for Fairway given the relational data model (Zone → Heads, Problems, Schedule).
Chose @Observable + Codable blob instead to stay consistent with portfolio pattern.

**SwiftData would win if:**
- Dataset grows large enough to need SQLite queries
- Cross-model filtering via @Query becomes valuable
- Cascade deletes matter at scale (delete zone → auto-delete heads)

**SwiftData risks for small apps:**
- Non-optional field additions require VersionedSchema + MigrationPlan or crash on launch for existing users
- First app in portfolio = no shared patterns to reference
- Supabase sync requires manually serializing every @Model object to JSON

**The blob pattern wins here because:**
- Total data: 4 zones, ~20 heads, ~20 problems — fits in UserDefaults trivially
- Adding a field is: add `var newField: String = ""` with a default — done, old saves decode fine
- All other portfolio iOS apps use this pattern (Unnamed, JobSearchHQ, ClarityBudget, etc.)
- Supabase sync later: encode blob to JSON, push — trivial

**Revisit SwiftData for any future app with >5 entity types or >1000 records.**

---

## Real-world calibration discipline matters more than the spreader calculator

**Date:** 2026-04-23

`SpreaderCalcView` correctly computed: 11 lb of IFA 23-3-8 to hit 4 lb/1,000 sq ft across Z2/Z3/Z4 (2,737 sq ft). Spyker HHS100 dial 3.5 was the right *starting* setting per the IFA bag.

Skipped the 100 sq ft physical calibration test against the actual bag. Result: **17.8 lb applied — 62% over-application** of pre-emergent + nitrogen on the lawn (incl. the always-fragile park strip).

**The math told me I was over only after the fact:** bag-down weight (222.4) − empty-spreader baseline (215.2) = 7.2 lb remaining → 17.8 lb applied. The same arithmetic done on the front end (TARE the spreader, run a marked 100 sq ft, weigh delta) would have caught the rate before the whole bag went down.

### What this means for the app

1. **The calculator is necessary but not sufficient.** It does the chemistry but can't enforce the physics. Future calibration should be a structured `CalibrationEntry` on `InventoryItem` (date, dial, target lb/100 sq ft, actual lb, pass/fail) so the data model itself blocks "log application" until a current-bag calibration exists.
2. **Spreader settings drift between bags.** Even same-product, same-spreader: prill size, humidity, and walk speed move the dial. The seeded `SpreaderSetting` is a starting point, not a gospel — note that explicitly in `SpreaderCalcView`.
3. **Recovery options should live in the app.** The 75-min Quick Run + AM top-off + 12-week aerate block + late-June half-rate strategy is recoverable knowledge that future-me will need next time. It belongs as a structured "Over-application recovery" template attached to `FertApplication`, not buried in a notes field.

### What this means for me (Chase)

- **Do the 100 sq ft test FIRST, every time, every bag.** Even if "the same" product. 5 minutes prevents 12 weeks of damage control.
- **TARE-based weighing is the only honest measurement.** Rely on math, not feel.
- **Mixed precip-rate zones can't be tuned with run-time.** The Z2 strip has been failing for years because of this — I was treating a hardware problem with a schedule. Drop-in MP Rotator nozzles fix it for ~$50 since the bodies are already Hunter Pro-Spray.

---

## SwiftUI helper view-properties aren't automatically @MainActor

**Date:** 2026-04-24

While building `RachioSettingsView`, I hit 9 MainActor isolation errors when helper computed properties (`connectedSections`, `devicePickerSection(preview:)`, `connectSection`, `zoneLinkRow(for:state:)`) and helper methods (`verify()`, `complete(...)`) accessed `store.blob`, `store.rachioSyncing`, `store.rachioLastError`, or called `store.disconnectRachio()` / `store.setRachioZoneLink(...)`.

`var body` on a `View` runs in a MainActor context implicitly, but **helper computed view properties on the same struct do NOT inherit that isolation**. They're plain Swift — no actor annotation unless you add one. So any helper that reads/mutates an `@Observable @MainActor` store either needs its own `@MainActor` annotation, or the whole struct has to be `@MainActor`.

**Fix used:** `@MainActor struct RachioSettingsView: View` (and same for `RachioHistoryView`). One annotation propagates to every method + computed property on the struct; no surgery on individual helpers.

**Evidence this is the right fix:**
- `ScheduleView.rachioMirrorCard` needed `@MainActor @ViewBuilder` because it's a single property — adding it per-property works fine too
- `PropertySettingsView.saveAddress()` uses `@MainActor private func ... async` for the same reason
- `var body` works without annotation because SwiftUI's `View.body` is declared `@MainActor` in the protocol

**Rule of thumb:** if a SwiftUI view touches an `@MainActor` store anywhere outside `body` (helper methods, factory funcs, Button closures that call store methods synchronously), annotate the whole struct `@MainActor`. It's cheaper than chasing isolation errors one at a time.

---

## Keep Rachio DTOs separate from persisted models

**Date:** 2026-04-24

The Rachio API returns a fairly deep JSON tree (`PersonResponse → Device → [Zone, ScheduleRule, FlexScheduleRule]` plus events). First instinct was to just `Codable`-conform those directly and store them in `FairwayBlob`. Instead: `RachioDTO.*` lives in `Services/RachioDTOs.swift` and maps to snapshot types (`RachioZoneSnapshot`, `RachioScheduleSnapshot`, `RachioEventSnapshot`) in `Models/RachioState.swift`.

**Why this is worth the extra layer:**
- If Rachio renames `zoneNumber` → `number`, only the DTO + mapping changes — persisted blobs stay intact.
- The snapshot types carry computed UI helpers (`totalDurationMinutes`, `startTimeLabel`, `statusLabel`, `dayKey`) that have no business being in a wire DTO.
- Tests can decode canned JSON into DTOs and exercise the mapping step (`toSnapshot()`) in isolation — this is exactly what `RachioDecodeTests` does.

**Cost:** ~50 extra lines of near-identical field copying. Worth it.

---

## Google Earth hosted photo URLs are publicly accessible (no OAuth)

**Date:** 2026-04-24

Assumed `earth.usercontent.google.com/...?authuser=0&fife=s{size}` URLs would require Google auth. Tested with a WebFetch — 1.7 MB PNG downloaded successfully with no token. These URLs are share-link CDN endpoints, not API-gated resources.

**Implication:** `tools/import-kml.py` can download all ~69 head photos using `urllib.request` with no credential setup. Substitute `s{size}` → `s1024` in the URL for highest quality (nozzle markings are legible at 1024px).

---

## All numbered KML pins are park-strip heads; all color-named are front-yard heads

**Date:** 2026-04-24

Confirmed from the Google Earth overhead screenshot Chase provided: the 6 "Nth Sprinkler" pins all sit in the narrow park strip at the south edge of the property (between the two sidewalks and the street). The 12 color-named pins (black, green, Black, grey, Blue, blue Sprinkler, etc.) are all in the main front-yard lawn. Zone 3 red pins are in the west side yard.

**Implication for PreviewData.swift:**
- Z2-S7..S18 = front-yard heads (not mixed front/park-strip as plan assumed)
- Z2-S1..S6 = park-strip heads matched by photo-2 visual context

---

## SSL cert errors from Python on macOS — use subprocess/curl instead

**Date:** 2026-04-24

`urllib.request.urlopen()` fails with `CERTIFICATE_VERIFY_FAILED` on macOS when Python is installed without running the system cert installer. Fix: use `subprocess.run(["curl", ...])` which routes through the macOS system keychain and handles SSL transparently. No pip install needed.

---

## Z2-S5 MP Rotator status uncertain — verify in field

**Date:** 2026-04-24

Seed data marks Z2-S5 as `isConfirmed: true` with "MP Rotator (blue cap)" already installed. Photo-1 of the provisionally matched 5th Sprinkler (sidewalk-edge, west-center park strip) shows an EMPTY nozzle slot — no blue cap, just dirt packed into the carrier. This either means:
(a) The 5th Sprinkler is not actually Z2-S5 (matching is wrong)
(b) The MP Rotator was never installed, or was removed
(c) The nozzle cap is hidden under heavy debris

Do not mark Z2-S5 `isConfirmed: true` in the updated seed until Chase physically verifies in field.

---

## Lat-order KML pin matching is wrong — use photo-2 visual context

**Date:** 2026-04-24

Planned to match "1st Sprinkler" → Z2-S1 by sorting pins N→S and aligning with seed head index. Photo 2 of "1st Sprinkler" disproved this: it shows park-strip geometry (narrow grass between two sidewalks), but Z2-S1 seed description is "NE corner front yard near driveway." These are physically different locations.

**Corrected rule:** For the 6 numbered KML pins (1st–6th Sprinkler), determine which seed head they correspond to by examining photo 2 (placement shot showing surrounding context). Visual anchors: Z2-S5 has a distinctive MP Rotator blue cap; Z2-S6 is buried in an erosion pit.

**For the 12 color-named pins (Z2-S7..S18):** simple lat-descending sort → sequential label. No seed match needed.

---

## Park strip = highest-risk grass on the property

**Date:** 2026-04-23

Concrete heat both sides + dog traffic + wind tunnel + narrow profile + (until now) mixed precip rates = the strip is the canary for any application or schedule mistake. Burn-check sweeps have to explicitly include it; "Z2" alone undersells the risk. The HANDOFF + CHANGELOG should always call out park strip separately when Z2 work is in flight.

---

## Photo evidence beats seed assumptions — let the data correct itself

**Date:** 2026-04-24

The original seed for Z2-S5 said `isConfirmed: true`, "MP Rotator (blue cap) already installed." That was a planning artifact, not a field observation. Photo-1 of the provisionally matched 5th Sprinkler showed an empty Hunter Pro-Spray nozzle slot packed with dirt — no MP Rotator, no blue cap, no spray nozzle of any kind.

Two ways to react: (a) treat the seed as canonical and rationalize the photo away ("maybe wrong head matched"), or (b) treat the photo as ground truth and update the seed (`isConfirmed: false`, nozzle "TBD — slot empty"). Picked (b). The seed exists to mirror reality; if reality contradicts it, the seed is the bug.

Same correction pattern hit Z2-S1: seed said "Brass adjustable", photo-1 showed Rain Bird VAN yellow with a ~4 ft radius print on the cap. Updated seed to reflect what the camera saw.

**Rule:** When a photo and a seed value disagree, update the seed and add a note explaining what changed and why. Don't silently override; future-me needs the breadcrumb.

---

## Don't rename data directories until matching is field-confirmed

**Date:** 2026-04-24

Was tempted to rename `docs/heads/Z2-MATCH-1st/`..`Z2-MATCH-6th/` to `docs/heads/Z2-S1/`..`Z2-S6/` once the provisional matching looked solid. Stopped because:

1. Matching is provisional. Z2-S5 anomaly already showed the matching could be wrong.
2. `git mv` after the fact is one command per dir; trivial cleanup.
3. Renaming pre-confirmation forces a second rename if Chase's field check shifts the mapping — that's a destructive thrash through git history.
4. `photoPaths` as data tolerates both names — strings are cheap, future updates are an `Edit` away.

Kept the `Z2-MATCH-Nth/` names; `phase0Z2Heads()` photoPaths point at them. Z2-S7..S18 + H3-1..H3-5 already had final names from the import script (KML pin names → label-based dirs), so no provisional naming was needed there.

**Rule:** When directory naming encodes a hypothesis (here, "1st Sprinkler IS Z2-S1"), wait for confirmation before locking it in. Reversible names beat clean names if the data underneath is still settling.
