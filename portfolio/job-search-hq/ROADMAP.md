# Roadmap — Job Search HQ

## Shipped

- [x] **iOS companion (v0.1)** at `../job-search-hq-ios/` — local-first SwiftUI shell + brand tooling; device install path documented 2026-04-15 (shared Linear: [Job Search HQ](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d))
- [x] Supabase sync + email OTP (v8.3)
- [x] Vercel monorepo root directory fix (v8.3)
- [x] Sales Navigator bookmarklet + in-app import flow (v8.4)
- [x] Contact model: type, outreach status, source, company intel fields (v8.4)
- [x] Stats bar + filter chips on ContactsTab (v8.4)
- [x] Logo: "JOB / HQ" mark, favicon.svg, PWA icons (v8.5)
- [x] Action Queue on Focus tab — overdue tasks, stale contacts, prep reminders (v8.5)
- [x] Next step due dates + types on application cards (v8.5)
- [x] URL + optional JD paste quick-capture on Pipeline tab (v8.6; replaces URL-only AI parse)
- [x] Outreach scenario chips on Apply Tools (v8.5; tab renamed v8.6)
- [x] **v8.6 — No in-browser Anthropic API.** Apply Tools uses copy-to-clipboard prompts for external assistants; interview prep modal uses stage templates + optional external prep brief.

## Wave 2 — Shipped

- [x] Company intel view on Contacts tab — group by company, warm leads, ghost rows, pre-fill AppModal (2026-04-13)
- [x] "Who should I message today?" prioritized list on Focus tab (2026-04-13)
- [x] Outreach cadence suggestions on ContactCard (day 3, day 7 follow-up nudges) (2026-04-13)
- [x] Structured prep framework — replace freetext prepNotes with sections (company research, role analysis, STAR stories, questions to ask) (2026-04-13)
- [x] STAR story bank — reusable competency stories; copy-prompt for external drafting (2026-04-13; prompt-only v8.6)
- [x] Win/loss analytics — bar chart of applications by final stage outcome (2026-04-13)

## Wave 3 — Later

- [x] Chrome Extension MVP: popup capture for LinkedIn profiles (contact) + job postings (JD + apply URL), badge count for overdue items (2026-04-13)
- [x] **Stage-specific prep templates (WHI-24)** — static presets for Phone screen, Interview, Final Round; fill empty section fields; optional `prepStageKey` on application; "Copy external prep brief" for ChatGPT/Claude (v8.6)
- [x] **Post-interview debrief log** — `interviewLog[]` on each app, `DebriefModal`, AppCard badge (v8.7)
- [x] **Mock interview mode** — `MockInterviewPanel` in AITab, 5 scenario presets (v8.7)
- [x] **Application velocity dashboard** — `VelocityDashboard` in FocusTab, weekly target + trend line (v8.7)

## Deferred — in-app LLM (intentional)

**Removed in v8.6:** browser `fetch` to `api.anthropic.com`, `callClaude`, and API key UI. Rationale: no user API key in the client; use external assistants with HQ as system of record.

**Possible re-entry (pick one later):**

- Server-side proxy (Vercel Function) with your key in env — never exposed to the browser.
- OAuth / marketplace integration if Anthropic or another provider offers a hosted widget.
- Bring-your-own-key behind a security review and explicit opt-in (still not ideal for a PWA).

Until then: **Apply Tools** = copy prompts + paste results; **Find Jobs** = deep links to LinkedIn / Indeed / Google.

## Wave 3 — Complete (v8.7)

All Wave 3 items shipped 2026-04-18. Wave 4 is next.

### Wave 3 delivered scope (v8.7)

- **Debrief log:** `interviewLog[]` on each application; `DebriefModal` (round type, impression, confidence 1–5, strengths, gaps, red flags, key questions); AppCard badge shows count.
- **Velocity dashboard:** `VelocityDashboard` in FocusTab; `getWeeklyVelocityData()` in constants; weekly target + trend line.
- **Mock interview:** `MockInterviewPanel` in AITab; `mockInterviewQuestions.js` with 5 scenarios (PM behavioral, PM situational, AE demo, leadership, STAR).

### Wave 3 #2 — delivered scope (v8.6)

- Stage preset selector in prep modal: `phone_screen`, `interview`, `final_round` (`PREP_STAGE_PRESETS` in `src/applyPrompts.js`).
- "Fill empty fields from template" merges templates without wiping user text.
- "Copy external prep brief" builds markdown for an external assistant; user pastes structured JSON or prose back into section textareas.
- Optional field `prepStageKey` on applications for last template choice.
- iOS `JobApplication` includes `prepStageKey` for blob parity.

## Release readiness + dependencies

- App status: **go** for v8.7 shipped scope.
- Keep these dependencies healthy:
  - Supabase email OTP template includes `{{ .Token }}`.
  - Vercel root directory remains `portfolio/job-search-hq`.
  - Vercel env vars include `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`.
  - Lockfile remains Node 20 compatible for CI (`npm ci` + `npm run build`).
  - Chrome extension capture remains subject to LinkedIn DOM changes (known external dependency).

## Wave 4

- [x] **Weekly Review prompt** — `WeeklyReviewPanel` in AITab; stat cards (apps/interviews/contacts/active pipeline this week); `buildWeeklyReviewPrompt()` in `applyPrompts.js`; copy coaching brief for ChatGPT/Claude (v8.8)
- [x] **Apply Tools "Draft Message" context** — `draftContact` state in App.jsx; ContactCard → ContactsTab passes contact; AITab useEffect pre-selects contact in LinkedIn → Connection Request sub-tab (v8.9)
- [x] **Outreach cadence timeline per contact** — `outreachLog[]` on each contact; `OutreachTimeline` on ContactCard; modal entry form + delete; card status dropdown appends on change; legacy `outreachDate`/`outreachStatus` seeded into one-entry log on load (v8.10)
- [x] **Offer comparison side-by-side mode** — `offerDetails` per app; `OfferModal` (comp + terms + notes, live total preview); `OfferCompareView` with best-in-column highlights; 💰 Offer button on AppCard; collapsible "Offer comparison (N)" section on Pipeline (v8.11)
- [x] **Email forward parsing** — `parseRecruiterEmail()` in constants.js (regex heuristics); 📧 Email Parse sub-tab in Apply Tools; editable extracted fields → pre-filled ContactModal + AppModal (v8.12)
- [x] **PWA share target (mobile URL sharing)** — `share_target` in manifest.json (GET, title/text/url params); minimal `public/sw.js` + registration in index.js; `shareTarget=1` URL-param handler in App.jsx pre-fills AppModal with shared URL + title (v8.13)

## Confidence Bedrock wave — Shipped (v8.13, 2026-04-21)

- [x] **Direction committed** — Implementation Consultant / Sales Engineer at payments-adjacent companies. AE at payments SaaS = backup. Source of truth: `/Users/chase/Developer/chase/identity/direction.md`.
- [x] **Direction + Strengths + Friend Feedback in ProfileModal** — three collapsible read-only panels reading `DIRECTION`, `STRENGTHS_SUMMARY`, `FRIEND_FEEDBACK`, `FRIEND_FEEDBACK_CONSENSUS`.
- [x] **Kassie urgency layer on FocusTab** — UrgencyHeader (Day-N since Visa), DailyMinimums (5 apps + 3 outreach + rest floor, Sunday-aware), KassieCard (rotating excerpts, per-day dismiss), DirectionSplit (IC/SE/AE/Other counts + response rates), WinsLog (auto + manual).
- [x] **Wins Log** — `wins: []`, `blankWin()`, `normalizeWins()`, `WIN_TYPES`; auto-logged on stage progression, debrief entry, outreachStatus → replied. `autoLogged` flag distinguishes auto from manual.
- [x] **Direction Tracker** — `track` field on every app (IC/SE/AE/Other), `getDirectionSplit()` helper. Market-feedback mechanism, not deliberation.
- [x] **RESUME_TEMPLATE_IC** as default — merchant-live implementation hero; portfolio work owns the 14-month gap.
- [x] **Voice + direction footer in every AI prompt** — `VOICE_DIRECTION_FOOTER` in `applyPrompts.js` appended to tailor-resume, cover-letter, apply-kit, connect, follow-up, STAR, interview-prep prompts.
- [x] **IC/SE mock interview scenarios + Strength Answer Hooks** — "Implementation Consultant — Payments" and "Sales Engineer — Dev Tools" (6 qs each); 1-sentence opener per strength.
- [x] **Networking & Informational Interviews resource section** — script, target-company list, First Round Review reference, follow-up rhythm.

## Deferred — next wave (captured 2026-04-21)

Chase can greenlight any of these in a follow-up session.

- [ ] Huntr-style extension expansion — generic content scripts for Indeed, Glassdoor, Greenhouse, Lever, Workday, Ashby, Wellfound.
- [ ] AI API re-add (secondary, not primary) — improve copy-paste first (one-click copy-all, section anchors, prompt history), then optional API toggle in Settings with fallback prompt view always accessible.
- [ ] Email / LinkedIn notification feed — Gmail OAuth or forward-to-alias; unified inbox of recruiter pings, application updates, interview invites inside HQ. Extends v8.12 email-parse.
- [ ] MBA Recruiting Workbook — parse Chase's Google Sheet, fold useful sections into Resources tab or a new Reference tab.
- [ ] Shipyard public "About Chase" page — surface direction + strengths + friend feedback on the portfolio hub.
- [ ] Per-app CLAUDE.md voice-brief references — 1-line pointer in each portfolio app's CLAUDE.md so Claude sessions pick up Chase's voice automatically.
- [ ] LinkedIn profile rewrite — reconcile `~/Downloads/dreamy-orbiting-rabin.md` draft (written for Hybrid SE/AE) with the IC/SE frame.
- [ ] Bookmarklet polish — expand beyond LinkedIn profiles to job postings across boards.
- [ ] Wins → Shipyard bridge — "Chase shipped N wins this week across apps" on the portfolio hub.
- [ ] Kassie's actual quotes — paste into `chase/identity/kassie-notes.md` when Chase is ready; also his "tool quotes" about Job Search HQ itself.

## Daily Flow Automation — Deferred options (captured 2026-04-21)

Option A (Today's 5 queue + Outreach Autopilot) shipped in v8.14. The remaining automation options are deferred below.

- [ ] **Option B — Discovery Sprint panel** — time-boxed 15-min panel on Focus tab; rotates through `JOB_SEARCH_QUERIES` daily; "Open all searches" button opens LinkedIn + Indeed + Google in tabs with that query; quick-capture strip (paste URL + company/title → one-click Interested entry); DIRECTION.primaryCompanies checklist showing applied vs. untouched. Pairs with Option A to keep the queue full.
- [ ] **Option C — Application Assembly Line** — single-screen guided wizard: Step 1 select Interested app → Step 2 confirm/paste JD → Step 3 copy tailor prompt → step 4 copy cover prompt → Step 5 open apply URL + mark Applied → Step 6 auto-log action + set follow-up date → Step 7 "Next →" resets for next app. Progress bar: "2/5 done today."
- [ ] **Option E — Morning Launchpad (full package)** — replaces daily blocks section with a linear step-by-step launchpad; wires together Discovery Sprint → Today's 5 Queue → Outreach Autopilot into one guided ~80-min daily flow; each step auto-logs daily actions as you complete items; resets daily. Build incrementally: ship A+D first (done), then B+C, then wire into launchpad.

## Project tracking

[Linear — Job Search HQ](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d)
