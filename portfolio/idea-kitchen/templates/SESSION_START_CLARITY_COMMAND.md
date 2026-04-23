# SESSION_START — Clarity Command Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Clarity Command is a stable v1.0 app.
**App:** Clarity Command
**Slug:** clarity-command
**One-liner:** Daily accountability hub — Mission tab, Scoreboard tab, and Settings tab — built on LDS faith and family urgency, with a gold accent and live Supabase sync.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The app is at v1.0; decisions are made.

---

## What to produce

All six STEP 6 artifacts (downloadable panels, not code blocks in chat). Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/clarity-command`
2. **BRANDING.md** — gold accent `#c8a84b`, LDS faith framing, "For Reese. For Buzz." urgency voice
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect v1.0 shipped scope; V2 = real Wellness/Job Search data via Supabase
5. **APP_FLOW.md** — document the Mission → Scoreboard → Settings 3-tab flow
6. **SESSION_START_clarity-command.md** — stub only

Output paths: `portfolio/clarity-command/docs/`

---

## App context — CLAUDE.md

**Version:** v1.0
**Stack:** React CRA + inline styles + localStorage + Supabase sync (live)
**Storage key:** `chase_command_v1`
**URL:** local only (not deployed to Vercel)
**Entry:** `src/App.jsx`

**What this app is:**
A daily accountability hub. Three tabs: Mission (today's priorities, scripture, purpose statement), Scoreboard (daily wins and streaks), and Settings (name, family photo, motivation phrase). Built on LDS faith anchors and family urgency — "For Reese. For Buzz. Forward — no excuses." Gold accent `#c8a84b` throughout.

**Architecture:**
- Single-blob: `App.jsx` owns `chase_command_v1` state
- Tabs receive `blob` + `setBlob` as props — dumb components
- `theme.js` — `T` (colors, gold accent), `loadBlob`/`saveBlob`
- Supabase sync is live but feeds stub data (not yet connected to real Wellness/Job Search blobs)

**Brand system:**
- Gold accent: `#c8a84b`
- Background: deep navy `#0a0f1e`
- Text logo: `CLARITY` (gold label) / `COMMAND` (white bold)
- Voice: direct, mission-driven — "you said you'd do this. did you?"
- Faith context: Book of Mormon, D&C, KJV Bible — scripture quotes in Mission tab

**Relationship to other Clarity apps:**
- Web companion to Clarity Command iOS (`portfolio/clarity-command-ios/`)
- Both apps read from the same Supabase project (`unqtnnxlltiadzbqpyhh`)
- Phase 2: pull live data from Wellness (`chase_wellness_v1`) and Job Search (`chase_job_search_v1`) via Supabase

---

## App context — HANDOFF.md

**Version:** v1.0
**Focus:** Stable. Supabase sync is wired but feeding stub data.
**Last touch:** 2026-04-21

**Next (V2 candidates):**
- Connect Mission tab to real Wellness Tracker data (today's check-in score)
- Connect Scoreboard to real Job Search HQ data (applications, interviews)
- Add weekly review summary view
- Deploy to Vercel once real data is wired
