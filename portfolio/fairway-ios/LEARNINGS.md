# Fairway iOS — Learnings

## Seeding audit data into PreviewData is NOT enough — you also need a store migration

**Date:** 2026-04-25

When a new field is added to a Codable struct AND the intent is to pre-populate it for existing users (not just new installs), two things are required:

1. **PreviewData**: populate the field in every seed helper so fresh installs get it.
2. **FairwayStore migration**: a new `applyPhaseNXxxMigrationIfNeeded()` that backfills the field for any existing blob where it decoded as the default (`""`, `false`, `nil`).

Without step 2, existing users always see the default (empty observation, no badge, "No audit data for this head") even though `decodeIfPresent` correctly prevented a crash.

**Pattern:**
```swift
for zi in blob.zones.indices {
    for hi in blob.zones[zi].heads.indices {
        guard blob.zones[zi].heads[hi].targetField.isEmpty else { continue }
        let value = PreviewData.lookup(for: blob.zones[zi].heads[hi].label)
        guard !value.isEmpty else { continue }
        blob.zones[zi].heads[hi].targetField = value
        changed = true
    }
}
```

The guard on `isEmpty` makes it idempotent — field-entered data (non-empty) is never overwritten by a migration.

## KML reimport workflow — separate "ingest" from "wire up app"

**Date:** 2026-04-25

When swapping in a bigger KML (23 → 41 pins, 2 new zones), the cleanest split is:
1. **Tooling + on-disk state first** (Python script, photo folders, manifest). No Swift edits in the same session.
2. **Hand off the kickoff prompt** that re-states what's already on disk so the next chat doesn't re-run `import-kml.py` (which is already idempotent, but a long photo download anyway).
3. **App-side seed/migration in the next session** — much shorter context, and you can paste the final label table from sprinklers.json at the top.

Why split: the first half is shell + Python and produces ~50 photo downloads. By the time the dust settles you've burnt through enough context that the Swift edits get sloppy. Each half also has different verification needs — half 1 verifies via `ls docs/heads/`, half 2 verifies via `xcodebuild test`.

**Idempotency invariant for the import script:** the legacy folder migration step (`H3-{1..5}/` → `Z3-S{7..11}/`) uses `Path.rename()` only when the target doesn't exist. Re-running the script after the rename is a complete no-op (it skips the rename, then skips the photo downloads). This is the safe-to-re-run-anytime guarantee that lets you defer the Swift work without anxiety.

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

## Migration function naming — watch for collision with existing async counterparts

**Date:** 2026-04-25

`applyPhase1PropertyMigrationIfNeeded()` (async, geocoding) already lived at `FairwayStore.swift:110` when it was time to add the Phase 1 zone migration. Both follow the same numbered-phase naming pattern, making a silent name collision very easy to introduce.

**Fix:** Used the parallel suffix `applyPhase1ZoneMigrationIfNeeded()` — unambiguous when both are visible together. The convention is now: Phase + context suffix (Zone, Property, etc.) + `MigrationIfNeeded`.

**Rule for future migrations:** before naming a new `applyPhaseN*` function, `grep -n "applyPhase" FairwayStore.swift` first. If any same-phase function exists, distinguish with a context suffix.

---

## Photo counts per head vary — always read the manifest

**Date:** 2026-04-25

Assumed 3 photos per head based on the Z2 carousel convention, but `sprinklers.json` showed variance: `Z3-S1 = 2`, `Z3-S2 = 4`, `Z3-S11 = 4`, all others = 3. Hardcoding `photo-1.jpg / photo-2.jpg / photo-3.jpg` for every head would have produced broken path references for those three.

**Fix:** Read `docs/heads/sprinklers.json` `photo_paths` arrays per label and used the exact count. For the migration test, verified the exact counts again before writing assertions.

**Rule:** Never assume uniform photo counts. Source all `photoPaths` arrays from the manifest, not from "what the normal case looks like."

---

## Preserve UUID when reseeding a zone from PreviewData

**Date:** 2026-04-25

`ZoneData.id` is a `var UUID`. `PreviewData.zone4()` creates a fresh `UUID()` every call. If the migration just writes `blob.zones[z4Idx] = PreviewData.zone4()`, any cross-references that store the old UUID (Rachio zone links, future sub-zone refs) break silently.

**Fix:** Capture `let preservedID = zone.id` before calling `PreviewData.zone4()`, then immediately write `fresh.id = preservedID` before assigning the new zone into the blob array.

**Rule:** Any migration that replaces a whole struct with a fresh seed must explicitly re-stamp the original `id` onto the replacement.

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


---

## 2026-04-25 — Closure-based initializer trick for inline audit data in PreviewData

When seeding a large number of structs (41 heads) where each needs a lookup call (`auditData(for:)`) alongside other parameters, Swift doesn't allow calling a static function mid-array-literal cleanly. Two patterns that work:

1. **Immediately-invoked closure** for individually-named heads: `{ let a = auditData(for: "Z2-S1"); return HeadData(..., auditObservation: a.obs) }()`
2. **Array map** for heads defined from a specs array: declare a `[(label, ...)]` tuple array, then `.map { ... let a = auditData(for: $0.label); return HeadData(...) }`.

The map pattern is strictly cleaner and preferred for large batches. The closure trick is OK for 1-6 individually-shaped heads.

---

## 2026-04-25 — Photo audit confidence levels inform blocked-head action wording

When the `HeadAuditSheet` needs to show a human-readable action for "BLOCKED" heads, the action text comes from pattern-matching the `auditObservation` string rather than from a separate enum. This avoids a new data model type for what amounts to a display string. The pattern:

```swift
if head.auditObservation.contains("erosion pit") { return "Dig out head + raise with swing-pipe extender" }
if head.auditObservation.contains("mud") { return "Dig out head completely, clean cap, re-photo" }
```

Works fine for the current set. If blocked-head action logic gets more complex, migrate to an `auditAction: String` field on `HeadData` (populated in `auditData(for:)` alongside observation + confidence).

---

## ⚠️ Swift Codable: synthesized init(from:) does NOT use property defaults — APPLIES TO EVERY IOS APP

**Date:** 2026-04-25

When you add a new field to a `Codable` struct with a Swift default value, e.g.:
```swift
var photoPaths: [String] = []
var observations: [LawnObservation] = []
```
Swift's synthesized `init(from: Decoder)` requires those keys to exist in the JSON. If they're absent (any blob saved before you added the field), decoding throws `keyNotFound` and the app crashes on launch for existing users.

**Fix — always do this when adding a field to any Codable model:**
```swift
extension MyStruct {        // ← extension, NOT struct body (see below)
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        newField = try c.decodeIfPresent([T].self, forKey: .newField) ?? []
        // ... decode all other fields with decodeIfPresent where appropriate
    }
}
```

**Critical: put `init(from:)` in an extension, not the struct body.** Any `init` declared inside the struct body suppresses Swift's synthesized memberwise initializer. Downstream callsites like `HeadData(label:, headType:, nozzle:, ...)` break with "extra arguments" compile errors. Moving the same init to an extension avoids the suppression — both the custom decoder and the memberwise init coexist.

**What this caught in Fairway (2026-04-25):**
- `HeadData.photoPaths` (added 2026-04-24) — any user who had saved app data before this field existed would crash on launch.
- `FairwayBlob.observations` / `.waterRuns` / `.fertApplications` — same. Every existing user blob was a v1 blob without these keys.

**How to prevent in future sessions:** Before shipping any new Codable field:
1. Check if the struct has an existing custom `init(from:)` extension — if yes, add the new field there with `decodeIfPresent`.
2. If no custom decoder exists yet, add one in an extension, decoding all fields, new ones with `decodeIfPresent`.
3. Write a test: save a blob WITHOUT the new field key, reload, assert the field equals its default. See `testV1BlobDecodesIntoV2WithDefaults` and `testHeadDataMissingGeoFieldsDecodes` in `FairwayBlobTests.swift` for the pattern.

---

## 2026-04-25 — xcodebuild pipe exits mask real exit code

**Date:** 2026-04-25

```bash
xcodebuild test ... 2>&1 | tail -200   # ← WRONG — tail's exit code is always 0
```

Even if `xcodebuild` fails (EXIT:1, tests failing), the pipe reports `tail`'s exit code. The command appears to succeed. Use:

```bash
xcodebuild test ... 2>&1; echo "EXIT:$?"   # ← correct — xcodebuild's exit code printed explicitly
```

This applies to any long-running build or test command you want to check after piping to `tail` or `grep`.

---

## 2026-04-25 — iOS 17.2 runtime DMG (shared across all iOS apps)

**The iOS 17.2 simulator runtime DMG unmounts on every reboot.**
actool (invoked by every `xcodebuild` call, even for device targets) looks up the runtime at:
`/Library/Developer/CoreSimulator/Volumes/iOS_21C62/Library/Developer/CoreSimulator/Profiles/Runtimes/iOS 17.2.simruntime`
If the DMG is not mounted, actool fails with a runtime-not-found error and the build fails.

Run this once per session before any `xcodebuild` call:
```bash
sudo hdiutil attach \
  /Library/Developer/CoreSimulator/Images/B3B0953C-8EEB-4DF1-8149-B9770CC90CC7.dmg \
  -mountpoint /Library/Developer/CoreSimulator/Volumes/iOS_21C62 \
  -readonly -noverify
```

The SDK plist patch (`iPhoneSimulator17.2.sdk SystemVersion.plist ProductBuildVersion = 21C62`) is **persistent** — no re-run after reboot. Only the DMG mount is needed each session. Full diagnostic trail: `portfolio/unnamed-ios/LEARNINGS.md` (2026-04-24 and 2026-04-25).
