# Changelog

> ⚠️ RETIRED — 2026-03-23
> All 7 growth areas have been merged into the Wellness Tracker as the 🌱 Growth tab (v15).
> Data now lives under `growthLogs` in `chase_wellness_v1`.
> This app is no longer actively developed. Do not deploy new versions.
> Active app: https://wellness-tracker.vercel.app

## [Unreleased]

- Monorepo: app source moved to `portfolio/archive/growth-tracker/` (`~/Developer/chase`). Linear project set to **Canceled** with archive path.

---

## v6 — 2026-03-19
- Added Learning Claude as a 7th tracked area (tag: AI / Tools)
  - Milestones: Prompt engineering practiced, Built or improved an artifact, Learned a new capability, Read docs / release notes, Used Claude in a real workflow, Explored a new use case, Taught or shared a technique
- Added "Background" multi-select chip picker to log panel
  - Options: Nothing / Quiet, Music, Endel, Podcast, YouTube, TV / Movie, Other
  - Saves as `bg: []` array on each log entry — backward compatible with old logs
  - Background tags shown in recent sessions history cards

## v5 — framework doc + instructions updated
- GROWTH_TRACKER_INSTRUCTIONS.md updated with audit.sh docs and deploy workflow
- MASTER_PROJECT_FRAMEWORK.md updated

## v1 — Initial build
- Six areas: Come Follow Me, Book of Mormon, GMAT, Job search, AI learning, Project mgmt
- Session logging with minutes slider, milestone chips, notes
- Streak tracking with color coding (gray / green / amber / teal)
- Weekly bar chart, stats row, recent sessions with area filter
- Toast notification on save
- localStorage persistence under chase_growth_v1
