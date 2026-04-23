# SESSION_START — RollerTask Tycoon (Vite PWA) Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.
> Note: This is the retired Vite PWA — superseded by `rollertask-tycoon-web` (CRA). Archived at `portfolio/archive/roller-task-tycoon/`. Document as retired.

---

**Mode:** Retroactive documentation — RollerTask Tycoon Vite PWA is retired and archived.
**App:** RollerTask Tycoon (Vite PWA)
**Slug:** roller-task-tycoon-vite
**One-liner:** Retired Vite PWA tasks-and-points tracker — Win95 chrome aesthetic, Supabase sync via `app_key = roller_task_tycoon_v1`; superseded by the CRA standalone app `rollertask-tycoon-web`.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The app is archived; all decisions are historical.

---

## What to produce

All six STEP 6 artifacts (downloadable panels, not code blocks in chat). Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/roller-task-tycoon-vite` (marked retired)
2. **BRANDING.md** — Win95 chrome aesthetic, retro gamification; note superseded branding
3. **PRODUCT_BRIEF.md** — distill from context below; frame as a retired iteration
4. **PRD.md** — reflect the retired Vite scope; link to `rollertask-tycoon-web` as the successor
5. **APP_FLOW.md** — document the task → complete → points → ledger flow (archived version)
6. **SESSION_START_roller-task-tycoon-vite.md** — stub only

Output paths: `portfolio/archive/roller-task-tycoon/docs/` (note: archive path, not portfolio/)

---

## App context

**Status:** Archived — retired and superseded
**Archive path:** `portfolio/archive/roller-task-tycoon/`
**Retired on:** 2026-04-20 (approximate; replaced by CRA standalone)
**Superseded by:** `portfolio/rollertask-tycoon-web/` (CRA, `chase_hub_rollertask_v1`)

**Stack (historical):**
- Vite PWA (not CRA) — `VITE_*` env vars + `import.meta.env` (not `REACT_APP_*`)
- `<style>` in `index.html` (no shared `s` object — predates CRA portfolio standard)
- Supabase sync: `app_key = 'roller_task_tycoon_v1'` — historical rows may still exist in shared Supabase project

**What this app was:**
A Vite-based PWA for tracking tasks and earning points. Win95 chrome aesthetic — taskbar-style interface, retro window chrome. Points = "park cash." Supabase sync was live. Split into a dedicated CRA app (`rollertask-tycoon-web`) when the architecture was standardized across the portfolio.

**Key historical data:**
- `app_key = 'roller_task_tycoon_v1'` — historical Supabase rows under this key may still exist
- Env prefix: `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (not `REACT_APP_*`)
- Do NOT use this app as a reference for current portfolio conventions

**Brand system (historical):**
- Win95 / retro chrome aesthetic — taskbar, window chrome, 3D button bevels
- Park/tycoon gamification: park cash, attractions
- Superseded by the cleaner CRA brand (ROLLER amber / TASK white bold)

---

## App context — HANDOFF.md (historical)

**Status:** Archived
**Focus:** No active development. Retired 2026-04-20.
**Successor:** `portfolio/rollertask-tycoon-web/` — CRA, cleaner brand, same core concept

**Why retired:**
- Vite + `import.meta.env` diverged from the CRA + `REACT_APP_*` portfolio standard
- Win95 aesthetic didn't match the broader portfolio brand direction
- CRA standalone (`rollertask-tycoon-web`) provides cleaner, better-branded replacement
