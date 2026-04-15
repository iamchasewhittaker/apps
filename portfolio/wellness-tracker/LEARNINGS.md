# Learnings — Wellness Tracker

> Mistakes, fixes, and "aha" moments captured from real sessions.
> **AI tools:** read this at session start alongside CLAUDE.md for project-specific gotchas.
> **Chase:** append an entry any time something goes wrong or clicks.

---

## Format

### YYYY-MM-DD — Short title
**What happened:** 1-2 sentences describing the problem or discovery.
**Root cause:** Why it happened — the non-obvious part.
**Fix / lesson:** What was done, or what to do differently next time.
**Tags:** gotcha | react | git | deploy | supabase | python | api | ...

---

## Entries

### 2026-04-15 — ROADMAP can drift from actual file structure
**What happened:** ROADMAP.md listed “Split TrackerTab” as pending, but the split was already fully done — `src/tabs/tracker/` had 13 sub-components and the orchestrator was down to ~12 KB.
**Root cause:** The split was done in a prior session but the ROADMAP wasn't updated at that time.
**Fix / lesson:** Always verify file structure before marking roadmap items as todo. `ls src/tabs/tracker/` takes 2 seconds and avoids planning around already-done work.
**Tags:** roadmap, docs, monorepo

### 2026-04-15 — devicectl install fails with Index.noindex path
**What happened:** `find ~/Library/Developer/Xcode/DerivedData -name “WellnessTracker.app”` returned the `Index.noindex/Build/Products/` path first, which is not a valid bundle for install.
**Root cause:** Xcode maintains an index cache in `Index.noindex/` with `.app` stubs that look like real builds but lack `Info.plist` bundle metadata.
**Fix / lesson:** Always use the explicit path `DerivedData/<scheme>/Build/Products/Debug-iphoneos/<App>.app` — never rely on `find` to pick the right one. Hardcode or grep for `Build/Products/` specifically.
**Tags:** xcode, ios, devicectl, deploy

### 2026-04-15 — Vercel CLI doubles path when root dir is set in project settings
**What happened:** Running `vercel --prod` from `portfolio/wellness-tracker/` failed with path error: `~/Developer/chase/portfolio/wellness-tracker/portfolio/wellness-tracker does not exist`.
**Root cause:** Vercel project settings have root directory set to `portfolio/wellness-tracker` (relative to repo root). The CLI prepends the CWD to that setting, doubling the path.
**Fix / lesson:** For monorepo subdir projects, use `git push origin main` to trigger auto-deploy via the GitHub connection — don't run `vercel --prod` from inside the subdir. The GitHub → Vercel integration handles root directory resolution correctly.
**Tags:** vercel, deploy, monorepo

### 2026-04-12 — “Spend Clarity logo” has no repo asset
**What happened:** Wellness branding was asked to match Spend Clarity; Spend Clarity is a Python CLI with no checked-in logo raster.
**Root cause:** Product naming overlap (“Clarity” family vs Spend Clarity CLI).
**Fix / lesson:** Document palette source as **YNAB Clarity** `ClarityTheme.swift` in `docs/BRANDING.md` and Spend Clarity `HANDOFF.md`; regenerate Wellness mark from those tokens.
**Tags:** branding, docs, monorepo
