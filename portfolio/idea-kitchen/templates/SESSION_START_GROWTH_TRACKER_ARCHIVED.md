# SESSION_START — Growth Tracker (Archived) Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.
> Note: Growth Tracker is archived. Its functionality was merged into the Wellness Tracker GrowthTab. Document as retired.

---

**Mode:** Retroactive documentation — Growth Tracker is archived; merged into Wellness Tracker.
**App:** Growth Tracker
**Slug:** growth-tracker
**One-liner:** Retired standalone growth tracker — 7 growth areas with streaks and history; merged into the GrowthTab of Wellness Tracker on 2026-04-20.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The app is archived; all decisions are historical.

---

## What to produce

All six STEP 6 artifacts (downloadable panels, not code blocks in chat). Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/growth-tracker` (marked archived)
2. **BRANDING.md** — growth/green aesthetic; note superseded by Wellness Tracker brand
3. **PRODUCT_BRIEF.md** — distill from context below; frame as a retired iteration
4. **PRD.md** — reflect the retired standalone scope; note what migrated to Wellness GrowthTab
5. **APP_FLOW.md** — document the 7-area daily check → streak → history flow (archived version)
6. **SESSION_START_growth-tracker.md** — stub only

Output paths: `portfolio/archive/growth-tracker/docs/` (note: archive path, not portfolio/)

---

## App context

**Status:** Archived — retired and merged
**Archive path:** `portfolio/archive/growth-tracker/`
**Retired on:** 2026-04-20
**Merged into:** Wellness Tracker GrowthTab (`portfolio/wellness-tracker/src/tabs/GrowthTab.jsx`)
**Storage key (historical):** `chase_growth_v1`
**Version (historical):** v6

**Note:** No `CLAUDE.md` exists in the archive folder — this context is reconstructed from portfolio-level records.

**What this app was:**
A standalone growth tracker covering 7 growth areas (Physical, Spiritual, Mental, Relational, Financial, Professional, Creative). Daily check — mark areas as done, track streaks, view history. Ran as a separate React app. Merged into Wellness Tracker's GrowthTab when the portfolio was consolidated.

**Why merged:**
Growth tracking is most useful alongside the daily wellness check-in (mood, sleep, meds). Having them in separate apps created friction. The GrowthTab in Wellness Tracker provides the same 7-area tracking inside the app Chase opens first each morning.

**Historical data migration:**
- `chase_growth_v1` localStorage data was preserved in the Wellness blob during merge
- The Wellness GrowthTab reads from `chase_wellness_v1.growthLogs`
- Old standalone `chase_growth_v1` key is orphaned but not deleted

**What migrated to Wellness GrowthTab:**
- 7 growth areas (same fixed list)
- Daily check (mark as done)
- Streak tracking per area
- History view (7-day grid)

**What was NOT migrated (was dropped):**
- Standalone app chrome (separate install, separate icon)
- Any standalone-specific settings

---

## App context — HANDOFF.md (historical)

**Status:** Archived
**Focus:** No active development. Retired 2026-04-20.
**Successor:** Wellness Tracker GrowthTab (`portfolio/wellness-tracker/src/tabs/GrowthTab.jsx`)
