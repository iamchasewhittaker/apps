# SESSION_START — Job Search HQ Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Job Search HQ already exists and is shipped.
**App:** Job Search HQ
**Slug:** job-search-hq
**One-liner:** AI-assisted job search cockpit — pipeline tracking, contact CRM, interview prep, STAR story bank, and a Chrome MV3 extension for one-click LinkedIn capture; deployed at job-search-hq.vercel.app.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. Decisions are made and the app is live.

---

## What to produce

All six STEP 6 blocks. Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/job-search-hq`
2. **BRANDING.md** — palette, typography, voice (see Brand System below)
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect actual V1 shipped scope; defer waves 3+ to V2
5. **APP_FLOW.md** — document the primary flow as-built
6. **SESSION_START_job-search-hq.md** — stub only

Output paths: `portfolio/job-search-hq/docs/`

---

## App context — CLAUDE.md

**Version:** v8.13 (Confidence Bedrock wave)
**Storage key:** `chase_job_search_v1`
**URL:** https://job-search-hq.vercel.app
**Entry:** `src/App.jsx`
**Stack:** React CRA + inline styles (`s` object in `constants.js`) + Supabase sync (LIVE) + Chrome MV3 extension

**What this app is:**
An AI-assisted job search cockpit managing the full pipeline from application tracking to interview prep, with a contact CRM, STAR story bank, AI-powered drafting tools, and a Chrome MV3 extension for one-click LinkedIn capture. Everything needed to run a disciplined, high-output search lives in one app — pipeline stages, weekly review rhythm, prep templates, and job search queries.

**Architecture:**
- `constants.js` owns ALL styles (`s.*`), data helpers, AI call wrapper — no React
- Tabs are dumb (props only, no persistent state); `App.jsx` is the shell
- Supabase sync is live — `pull()` on load, `push()` on every save; email OTP auth
- Chrome MV3 extension in `extension/` — LinkedIn capture → HQ badge

**Tabs:**
- FocusTab — daily focus blocks, Kassie urgency header, Day-N counter, daily minimums, direction tracker, wins log
- PipelineTab — application pipeline + stage bar + URL/JD paste quick-capture
- ContactsTab — contacts list with By Company view, warm lead badges, ghost rows
- AITab — Apply Tools: copy prompts, STAR bank, email parse panel, job search links
- ResourcesTab — resources grid + backup/restore

**Key shipped features (v8.13):**
- Action queue + next step dates/types
- By Company view on ContactsTab (warm lead badges, ghost rows, LinkedIn search links)
- "Who should I message today?" prioritized outreach widget
- Email forward parsing → pre-filled Contact/App modals
- Offer comparison side-by-side
- Outreach cadence timeline per contact
- Draft Message contact nav
- Weekly Review tab
- Mock interview mode + debrief log + velocity dashboard
- Wins Log (auto + manual)
- Direction Tracker per application (IC / SE / AE / Other)
- Kassie urgency layer (Day-N counter, daily minimums, rotating excerpts)
- Profile: Strengths + Friend Feedback + Direction panels
- Chrome MV3 extension (LinkedIn → HQ import, Action Queue badge)

**Brand / voice:**
- Deep navy palette; JOB/HQ logo (outline, deep blue)
- Voice: warm and direct, short sentences, no em-dashes, no hype. Strengths show through (Harmony / Developer / Consistency / Context / Individualization) — never name-dropped.
- Direction: Implementation Consultant / Sales Engineer at payments-adjacent companies (Stripe, Adyen, Checkout.com, Finix, Rainforest Pay). AE backup.

---

## App context — HANDOFF.md

**Version:** v8.12
**Branch:** main
**URL:** job-search-hq.vercel.app
**Focus:** Wave 4 #5 shipped — email forward parsing (`parseRecruiterEmail()` regex parser; `EmailParsePanel` component; "email" sub-tab in AITab)
**Next:** Wave 4 #6 — PWA share target (mobile URL sharing)
**Last touch:** 2026-04-20

**Wave 3 complete (v8.7):** Logo redesign, debrief log, velocity dashboard, mock interview mode.
**Wave 4 progress:** #1 weekly review ✅ · #2 draft message context ✅ · #3 outreach cadence ✅ · #4 offer comparison ✅ · #5 email parse ✅ · #6 PWA share target (next)
