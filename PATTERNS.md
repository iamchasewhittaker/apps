# Patterns — Personal Code Cookbook

> Reusable recipes discovered while building the portfolio.
> Organized by technology. Each pattern has a name, when to use it, and a working example.
> Source: the app where it was first used or best demonstrated.
>
> See also: `identity/patterns.md` (one-liner behavioral rules from Idea Kitchen sessions).

---

## React

### Flatten early, filter late
**When:** A data structure has optional child arrays (e.g., YNAB split transactions with `subtransactions[]`) that every consumer must handle.
**Recipe:** Flatten once at the data-entry boundary into a uniform shape. All downstream code (filters, groupBy, list rendering) operates on the flat list. No repeated branching logic.
**Example:** `portfolio/clarity-budget-web/lib/aggregations.ts` — `flattenSpendLines(txs, mappings)` emits one `SpendLine` per subtransaction.
**Learned:** 2026-04-20

### Modal-callback chaining (onAfterSave)
**When:** Action A opens Modal 1, whose save should open Modal 2 pre-filled, whose save triggers a side-effect.
**Recipe:** Add `onAfterSave(savedItem)` to the modal config object. Call site composes the chain; modals stay agnostic. Example: inbox "Save Contact + App" chains ContactModal → AppModal → markInboxActioned.
**Example:** `portfolio/job-search-hq/src/App.jsx` — inbox handler composes `setContactModal({ onAfterSave: (c) => setAppModal({ onAfterSave: (a) => markInboxActioned(...) }) })`.
**Learned:** 2026-04-26

### Extension imports need authenticated shell
**When:** Chrome extension or URL import triggers (`?importContact=...`) while login screen is showing.
**Recipe:** Consume imports in `useEffect` gated on `session` ready + `hasLoaded`, strip query/hash after via `replaceState`. Don't process imports before auth resolves.
**Example:** `portfolio/job-search-hq/src/App.jsx` — import handler.
**Learned:** 2026-04-13

### Model changes with normalization helpers
**When:** Restructuring a data field (e.g., `prepNotes` string → sectioned object) for existing users.
**Recipe:** Add `normalizeXxx(legacy)` that hydrates old shape into new shape so historical data remains visible. Run on load.
**Example:** `portfolio/job-search-hq/src/constants.js` — `normalizeApplication(app)` hydrates `prepNotes` into `roleAnalysis` section.
**Learned:** 2026-04-13

---

## Supabase

### Separate row for secrets (never in sync blob)
**When:** Storing OAuth tokens, API keys, or PII alongside regular app data.
**Recipe:** Create a dedicated `user_data` row with its own `app_key` (e.g., `'clarity_budget_credentials'`, `'job-search:gmail'`). Never store secrets in the main blob that round-trips through localStorage.
**Why:** Blob round-trips to localStorage + Supabase daily; secrets would be backed up alongside non-sensitive data, visible to XSS scope.
**Example:** `portfolio/clarity-budget-web/lib/supabase-server.ts`, `portfolio/job-search-hq/api/gmail/exchange.js`.
**Learned:** 2026-04-26

### Migration tracker repair
**When:** `supabase db push` says "up to date" but REST API returns 404 for a table that should exist.
**Recipe:** `supabase migration repair --status reverted <id1> [<id2>]` then `supabase db push`. Always probe a table via REST after push to verify.
**Example:** `portfolio/clarity-budget-web/LEARNINGS.md` (2026-04-24 entry).
**Learned:** 2026-04-24

### Preserve user-owned columns on upsert
**When:** Upserting third-party sync data but preserving user-set fields (e.g., `linked_payee_id`).
**Recipe:** Pre-fetch existing rows via `.in("token", tokens)`, build `Map<token, value>`, explicitly re-apply preserved values to the upsert payload. One extra round-trip; eliminates "did upsert reset that column?" question.
**Example:** `portfolio/clarity-budget-web/api/sync/privacy/route.ts` — Privacy.com sync.
**Learned:** 2026-04-25

### Schema first, doc second
**When:** Documenting database columns or API shape.
**Recipe:** Always check `supabase/migrations/0001_init.sql` (authoritative source) before trusting HANDOFF doc. HANDOFF can drift; migration is truth.
**Example:** Clarity Budget Web — prevented naming mismatches (`flag_type` vs actual `type` column).
**Learned:** 2026-04-28

---

## Swift / SwiftUI

### decodeIfPresent in extensions (never struct body)
**When:** Adding any new field to a Codable struct in any iOS app.
**Recipe:** Custom `init(from:)` in an **extension**, use `decodeIfPresent` with default value. Never put the init in the struct body — that suppresses the memberwise initializer. Always write a backward-compat test.
**Example:** `portfolio/fairway-ios/FairwayTests/FairwayBlobTests.swift` — `testV1BlobDecodesIntoV2WithDefaults`.
**Learned:** 2026-04-25

### DTO namespace isolation for third-party APIs
**When:** Decoding third-party API responses (Rachio, Open-Meteo, etc.) that shouldn't reshape persisted models.
**Recipe:** Create `XxxDTO.*` namespace in `Services/XxxDTOs.swift`, map to snapshot types in `Models/XxxState.swift`. If API renames a field, only DTO + mapping changes; persisted blobs stay intact; tests exercise mapping in isolation.
**Example:** `portfolio/fairway-ios/Services/RachioDTOs.swift` → `Models/RachioState.swift`.
**Learned:** 2026-04-24

### @MainActor on view methods touching store
**When:** Helper private methods (e.g., `submit()`, `lockIn()`) call `@MainActor`-isolated store methods.
**Recipe:** Mark each helper `@MainActor`. View `body` is implicitly MainActor, but standalone methods are not. Alternative: annotate the whole struct `@MainActor` if most methods need it.
**Error message:** "call to main actor-isolated instance method in a synchronous nonisolated context"
**Example:** `portfolio/unnamed-ios/` — CheckFormView, SortView helpers.
**Learned:** 2026-04-25

### Idempotent migration guards
**When:** Backfilling a new field for existing users (not just new installs).
**Recipe:** Two-step: (1) populate in PreviewData for fresh installs; (2) add `applyPhaseNMigrationIfNeeded()` that backfills via lookup, guarding on `isEmpty` to avoid overwriting user-entered data.
**Example:** `portfolio/fairway-ios/` — FairwayStore.swift zone/head migrations.
**Learned:** 2026-04-25

### Hand-crafted pbxproj: 4-step new file pattern
**When:** Adding a new Swift file to a hand-crafted Xcode project (no xcodegen).
**Recipe:** Edit (1) PBXBuildFile, (2) PBXFileReference, (3) PBXGroup children array, (4) PBXSourcesBuildPhase files array. Use `grep` on existing UUIDs and increment.
**Example:** `portfolio/unnamed-ios/Unnamed.xcodeproj/project.pbxproj`.
**Learned:** 2026-04-25

---

## Tailwind / CSS

*(No entries yet — add the first one after something surprising happens.)*

---

## Vercel / Deploy

### Monorepo CLI deploy: rootDirectory doubling
**When:** Running `vercel --prod` from a monorepo subdirectory with `rootDirectory` configured.
**Recipe:** Always run from monorepo root with temp `.vercel/project.json` pointing at correct project ID, or rely on GitHub auto-deploy. CLI appends rootDirectory on top of cwd, doubling the path.
**Example:** `portfolio/clarity-budget-web/LEARNINGS.md` (2026-04-27 entry).
**Learned:** 2026-04-27

### Hobby plan cron: once-per-day limit
**When:** Setting up Vercel cron on Hobby plan.
**Recipe:** Cron frequency limited to `0 6 * * *` (once daily). For ad-hoc runs, expose a manual `/api/cron/backfill` endpoint. Upgrade to Pro for higher frequency.
**Example:** `portfolio/clarity-budget-web/vercel.json`.
**Learned:** 2026-04-27

---

## AI Integration

### LLM allowlist filter for hallucinated IDs
**When:** Using LLM output that references real IDs (category IDs, user IDs, enum values).
**Recipe:** After Zod validation (shape), check IDs against a `Set<string>` of valid values from the real data source. Zod validates structure, not semantics — hallucinated UUIDs pass Zod and would corrupt data.
**Example:** `portfolio/clarity-budget-web/lib/categorize/logic.ts` — `classifySuggestion` checks against valid YNAB category set.
**Learned:** 2026-04-26

### Idempotency via prompt_hash for LLM re-runs
**When:** Cron or batch job processes the same items through LLM repeatedly.
**Recipe:** Hash (system + user prompt) per batch, check if `prompt_hash` matches existing suggestion row. If match, reuse and skip LLM call. Second run: $0.02 → $0.
**Example:** `portfolio/clarity-budget-web/lib/categorize/run.ts`.
**Learned:** 2026-04-26

### Vercel AI Gateway string routing
**When:** Using Vercel AI Gateway instead of direct OpenAI SDK.
**Recipe:** `model: "openai/gpt-4o-mini"` (string) in AI SDK; `lib/ai/gateway.ts` wrapper encapsulates gateway decision. Model switch = one-line string change; gateway adds observability + retries + failover.
**Example:** `portfolio/clarity-budget-web/lib/ai/gateway.ts`.
**Learned:** 2026-04-26

---

## Architecture / General

### Derive state, don't persist it
**When:** A computed value (daily progress, filter counts, stage) can be derived from existing persisted data.
**Recipe:** Write a pure function that derives the value. No new schema, no migration, no drift. State that resets daily isn't state — it's a date comparison.
**Example:** `portfolio/job-search-hq/src/constants.js` — `getLaunchpadProgress()` derives from `dailyActions` + `applications`.
**Learned:** 2026-04-26

### Day-of-year rotation helper
**When:** Daily content rotation across cards/widgets that should be consistent within a day.
**Recipe:** Anchor at Jan 1, subtract, divide by ms-per-day, mod array length. One helper for all cards prevents disconnected rotation math.
**Example:** `portfolio/job-search-hq/src/constants.js` — `getDailyDiscoveryQueries(now)`.
**Learned:** 2026-04-26

### Heuristic classifiers vs LLM for low-volume features
**When:** Processing <50 items/day for a single user (email triage, log categorization).
**Recipe:** Regex patterns + sender-domain rules + confidence scoring. LLM cost + latency unjustified at this scale. Review-first queue means false positives are low-risk.
**Example:** `portfolio/job-search-hq/src/inbox/classifier.js`.
**Learned:** 2026-04-26

### Identity folder as cross-app source of truth
**When:** Multiple apps need the same personal data (strengths, voice, career direction).
**Recipe:** Single `identity/` folder at repo root. Apps mirror a minimal slice via constants exports. Duplication rots; one source doesn't.
**Example:** Root `CLAUDE.md` points at `identity/`; Job Search HQ mirrors via `constants.js`.
**Learned:** 2026-04-21

### `server-only` module isolation for testing
**When:** Code needs Supabase service client or decryption (server-only) but also needs unit tests.
**Recipe:** Pure helpers in separate file without `import "server-only"`, re-export from server module. Vitest tries to import helpers; `server-only` package throws if imported from test.
**Example:** `portfolio/clarity-budget-web/lib/categorize/run.ts` (server-only) re-exports from `lib/categorize/logic.ts` (test-safe).
**Learned:** 2026-04-26
