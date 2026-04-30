# Session Start — Job Search HQ (2026-04-29)

> Paste this at the start of any new Claude Code chat to resume with full context.
> Say: "Read CLAUDE.md and HANDOFF.md first, then this prompt."

---

## Journey so far

- **v1 (2026-03-23)** — Initial build: pipeline tab with stage badges, contacts tab, master profile modal, base resume, dark theme
- **v2 (2026-03-23)** — AI Tools tab: tailor resume (PM/AE tracks), cover letter, apply kit, find jobs, LinkedIn tools
- **v3 (2026-03-23)** — Daily Focus tab with 5 ADHD-friendly work blocks, Resources tab with certifications and ground rules
- **v4 (2026-03-23)** — Deployed to Vercel at job-search-hq.vercel.app
- **v5 (2026-03-23)** — Wellness Tracker integration (cross-app session logging)
- **v6** — Interview prep modal: 5 AI-generated questions per stage, saved to prepNotes
- **v7** — Data backup (dated JSON export, folder persistence on Chrome/Mac)
- **v8** — Error handling, error boundaries, restore UI, API key safety migration
- **v8.1 (2026-03-24)** — Supabase sync live (shared project with Wellness, app_key='job-search')
- **v8.2 (2026-03-24)** — Auth fix: corrected Supabase project, redirect allowlists
- **v8.3 (2026-04-03)** — Email OTP login for iPhone PWA persistence
- **v8.4 (2026-04-12)** — Sales Navigator bookmarklet, enhanced contact model (type, outreach status, source, company intel), stats bar + filters
- **v8.5 (2026-04-13)** — Action Queue, next step due dates/types, URL paste quick-capture, outreach scenario chips, JOB/HQ logo
- **Wave 2 (2026-04-13)** — Company intel view, "Who should I message today", cadence nudges, structured prep framework, STAR story bank, win/loss analytics
- **v8.6** — Removed in-browser Anthropic API; Apply Tools = copy prompts only; stage-specific prep templates
- **Chrome Extension (2026-04-13)** — MV3: LinkedIn profile/job capture, Action Queue badge
- **v8.7 (2026-04-18)** — Wave 3: logo redesign (outline HQ), debrief log, velocity dashboard, mock interview mode
- **v8.8 (2026-04-18)** — Wave 4 #1: Weekly Review panel + coaching brief prompt
- **v8.9 (2026-04-18)** — Wave 4 #2: Draft Message context (ContactCard navigates to AI tab pre-selected)
- **v8.10 (2026-04-20)** — Wave 4 #3: Outreach cadence timeline per contact
- **v8.11 (2026-04-20)** — Wave 4 #4: Offer comparison side-by-side with best-in-column highlights
- **v8.12 (2026-04-20)** — Wave 4 #5: Email forward parsing (regex parser + pre-filled modals)
- **v8.13 (2026-04-20)** — Wave 4 #6: PWA share target. Confidence Bedrock wave: direction committed (IC/SE at payments cos), Kassie urgency layer, Wins Log, Direction Tracker, IC resume template, voice footer on all prompts
- **v8.14 (2026-04-23)** — Daily Flow Option A: Today's 5 queue + Outreach Autopilot
- **v8.15** — TargetCompanyBoard
- **v8.16 (2026-04-26)** — Daily Flow Options B+C: Discovery Sprint + Apply Wizard (7-step modal)
- **v8.17 (2026-04-26)** — Daily Flow Option E: Morning Launchpad (3-stage soft-gated daily flow wrapping Discover + Apply + Outreach)
- **v8.18 (2026-04-26)** — Gmail Inbox Feed: server-side OAuth, AES-256-GCM encrypted refresh token, heuristic classifier (recruiter/ats_update/interview_invite/linkedin), InboxPanel on Focus tab with one-click triage actions
- **2026-04-28** — Gmail Forge x JSHQ fully verified: trigger active, JobSearch label exists, 3-pass match logic deployed, LinkedIn social split

---

## Still needs action

- GCP OAuth env vars not yet set on Vercel (`REACT_APP_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GMAIL_TOKEN_ENC_KEY`, `SUPABASE_SERVICE_ROLE_KEY`). Without them the InboxPanel renders but Connect Gmail fails.
- Send test emails (recruiter, ATS reject, Calendly, LinkedIn alert) labeled JobSearch and exercise all InboxPanel actions end-to-end after env vars are configured.

---

## Job Search HQ state at a glance

| Field | Value |
|-------|-------|
| Version | v8.18 |
| URL | https://job-search-hq.vercel.app |
| Storage key | `chase_job_search_v1` (data) + Supabase row `app_key='job-search:gmail'` (encrypted refresh token) |
| Stack | React CRA + inline styles (`s` object) + Supabase sync + Chrome MV3 extension + Vercel serverless (`api/`) |
| Linear | [Job Search HQ](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d) |
| Last touch | 2026-04-28 |

---

## Key files for this session

| File | Purpose |
|------|---------|
| portfolio/job-search-hq/CLAUDE.md | App-level instructions |
| portfolio/job-search-hq/HANDOFF.md | Session state + notes |
| portfolio/job-search-hq/src/constants.js | ALL data models, enums, styles, helpers (no React) |
| portfolio/job-search-hq/src/App.jsx | Shell: state, load/save, modals, tab routing, inbox handlers |
| portfolio/job-search-hq/src/tabs/FocusTab.jsx | Morning Launchpad, InboxPanel, Kassie urgency, daily blocks |
| portfolio/job-search-hq/src/tabs/PipelineTab.jsx | Application cards, stage bar, offer compare, URL/JD paste |
| portfolio/job-search-hq/src/inbox/classifier.js | Gmail message classifier (recruiter/ats/interview/linkedin) |

---

## Suggested next actions (pick one)

1. Set up GCP OAuth env vars on Vercel and run the full InboxPanel verification flow with real test emails
2. Build the Huntr-style extension expansion (Indeed, Glassdoor, Greenhouse, Lever, Workday, Ashby content scripts)
3. Add Discovery Sprint v2 polish: 15-min countdown timer, sprint completion tracking in dailyActions
