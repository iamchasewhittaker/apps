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
- [ ] Offer comparison side-by-side mode
- [ ] Email forward parsing (paste recruiter email → extract contact + job)
- [ ] PWA share target (mobile URL sharing)

## Project tracking

[Linear — Job Search HQ](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d)
