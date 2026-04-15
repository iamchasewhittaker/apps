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
- [x] URL paste quick-capture on Pipeline tab (v8.5)
- [x] Outreach scenario chips on AI Tools (v8.5)

## Wave 2 — Shipped

- [x] Company intel view on Contacts tab — group by company, warm leads, ghost rows, pre-fill AppModal (2026-04-13)
- [x] "Who should I message today?" prioritized list on Focus tab (2026-04-13)
- [x] Outreach cadence suggestions on ContactCard (day 3, day 7 follow-up nudges) (2026-04-13)
- [x] Structured prep framework — replace freetext prepNotes with sections (company research, role analysis, STAR stories, questions to ask) (2026-04-13)
- [x] STAR story bank — reusable competency stories, AI-assisted drafting from resume (2026-04-13)
- [x] Win/loss analytics — bar chart of applications by final stage outcome (2026-04-13)

## Wave 3 — Later

- [x] Chrome Extension MVP: popup capture for LinkedIn profiles (contact) + job postings (JD + apply URL), badge count for overdue items (2026-04-13)
- [ ] Stage-specific prep templates (Phone Screen vs Interview vs Final Round)
- [ ] Post-interview debrief log (`interviewLog` array on application)
- [ ] Mock interview mode in AI Tools tab
- [ ] Application velocity dashboard (weekly targets + trend line)

## Wave 3 — Execution order (current recommendation)

1. Stage-specific prep templates (next ship target)
2. Post-interview debrief log
3. Application velocity dashboard
4. Mock interview mode

### Wave 3 #2 scope — stage-specific prep templates

- Add a stage preset selector in prep flows: `phone_screen`, `interview`, `final_round`.
- Generate different question emphasis and prep prompts per stage.
- Keep current structured sections (`companyResearch`, `roleAnalysis`, `starStories`, `questionsToAsk`) so existing data remains compatible.
- Ensure legacy `prepNotes` migration behavior remains unchanged.
- Ship with manual smoke validation: App card prep button → modal generate/regenerate → save sections → Focus/Pipeline indicators.

### Follow-on sequencing rationale

- **Debrief log after templates:** capture outcome quality per stage while the prep context is still fresh.
- **Velocity dashboard after debrief log:** use both application stage flow and debrief signal quality for better trend visibility.
- **Mock interview mode last:** depends on stabilized stage templates + debrief data to generate higher-quality simulations.

## Release readiness + dependencies

- App status: **go for current v8.5 shipped scope** (no code-level blockers documented).
- Keep these dependencies healthy:
  - Supabase email OTP template includes `{{ .Token }}`.
  - Vercel root directory remains `portfolio/job-search-hq`.
  - Vercel env vars include `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`.
  - Lockfile remains Node 20 compatible for CI (`npm ci` + `npm run build`).
  - Chrome extension capture remains subject to LinkedIn DOM changes (known external dependency).

## Wave 4 — Ideas

- [ ] Outreach cadence timeline per contact (visual touchpoint history)
- [ ] Offer comparison side-by-side mode
- [ ] Weekly review prompt with auto-populated stats
- [ ] Email forward parsing (paste recruiter email → extract contact + job)
- [ ] PWA share target (mobile URL sharing)
- [ ] AITab "Draft Message" context: pre-fill contact name/company/role when navigating from ContactCard

## Project tracking

[Linear — Job Search HQ](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d)
