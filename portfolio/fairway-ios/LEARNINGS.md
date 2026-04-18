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
