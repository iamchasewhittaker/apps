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

## Park strip = highest-risk grass on the property

**Date:** 2026-04-23

Concrete heat both sides + dog traffic + wind tunnel + narrow profile + (until now) mixed precip rates = the strip is the canary for any application or schedule mistake. Burn-check sweeps have to explicitly include it; "Z2" alone undersells the risk. The HANDOFF + CHANGELOG should always call out park strip separately when Z2 work is in flight.
