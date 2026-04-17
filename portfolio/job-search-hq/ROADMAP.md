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
- [ ] Post-interview debrief log (`interviewLog` array on application)
- [ ] Mock interview mode in Apply Tools tab (would use copy-prompts or deferred in-app AI)
- [ ] Application velocity dashboard (weekly targets + trend line)

## Deferred — in-app LLM (intentional)

**Removed in v8.6:** browser `fetch` to `api.anthropic.com`, `callClaude`, and API key UI. Rationale: no user API key in the client; use external assistants with HQ as system of record.

**Possible re-entry (pick one later):**

- Server-side proxy (Vercel Function) with your key in env — never exposed to the browser.
- OAuth / marketplace integration if Anthropic or another provider offers a hosted widget.
- Bring-your-own-key behind a security review and explicit opt-in (still not ideal for a PWA).

Until then: **Apply Tools** = copy prompts + paste results; **Find Jobs** = deep links to LinkedIn / Indeed / Google.

## Wave 3 — Execution order (current recommendation)

1. ~~Stage-specific prep templates~~ **Done (v8.6)** — static templates + external brief
2. Post-interview debrief log
3. Application velocity dashboard
4. Mock interview mode (copy-prompt based or revisit deferred AI)

### Wave 3 #2 — delivered scope (v8.6)

- Stage preset selector in prep modal: `phone_screen`, `interview`, `final_round` (`PREP_STAGE_PRESETS` in `src/applyPrompts.js`).
- "Fill empty fields from template" merges templates without wiping user text.
- "Copy external prep brief" builds markdown for an external assistant; user pastes structured JSON or prose back into section textareas.
- Optional field `prepStageKey` on applications for last template choice.
- iOS `JobApplication` includes `prepStageKey` for blob parity.

## Release readiness + dependencies

- App status: **go** for v8.6 shipped scope.
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
- [ ] Apply Tools "Draft Message" context: pre-fill contact name/company/role when navigating from ContactCard

## Project tracking

[Linear — Job Search HQ](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d)
