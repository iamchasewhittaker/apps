# Learnings — Job Search HQ

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

### 2026-04-26 — Gmail OAuth in a browser SPA: keep `client_secret` server-side, fetch client-side
**What happened:** Wiring Gmail OAuth into HQ for v8.18. First instinct was to do everything in the browser — load GIS, run popup, exchange code. Google's "Web application" OAuth client type still requires `client_secret` for the token POST, even with PKCE.
**Root cause:** Two of Google's three SPA flows leak the secret into the bundle: (1) the `initTokenClient` implicit flow returns access tokens directly but no refresh token (re-consent every hour, useless for a daily workflow); (2) embedding `client_secret` in `REACT_APP_*` makes it world-readable on the deployed bundle. The third flow — popup auth code → server exchange — keeps the secret in env and gets a real refresh token.
**Fix / lesson:** Added `api/gmail/exchange.js` + `api/gmail/refresh.js` Vercel functions. `client_secret` lives in `GOOGLE_CLIENT_SECRET` (server-only). Refresh tokens are AES-256-GCM-encrypted with `GMAIL_TOKEN_ENC_KEY` (32-byte base64) before going into a separate Supabase row keyed `app_key='job-search:gmail'`. Browser only ever holds the short-lived access token in module memory — never localStorage. `gmail.googleapis.com` supports CORS so per-message fetches still go browser-direct (no per-fetch server hop).
**Tags:** oauth · security · architecture · vercel-functions

### 2026-04-26 — Modal `onAfterSave` is the cleanest way to chain side-effects after a save
**What happened:** Inbox actions like "Save Contact + App" need to: (1) open ContactModal pre-filled, (2) on save → open AppModal pre-filled with the saved company, (3) on app save → mark the inbox item actioned + auto-log a win. Previously every modal close was hardcoded in App.jsx's onSave handler.
**Root cause:** ContactModal/AppModal know nothing about inbox items, and adding inbox-awareness to every modal would couple them to a feature they shouldn't care about.
**Fix / lesson:** The modal config object now accepts an optional `onAfterSave(saved)` callback. App.jsx's onSave handler runs the existing `saveContact`/`saveApp`, closes the modal, then invokes `onAfterSave` if present. Inbox actions chain three steps: `setContactModal({ ..., onAfterSave: (c) => setAppModal({ ..., onAfterSave: (a) => markInboxActioned(...) }) })`. Modals stay agnostic; the call site composes the chain.
**Tags:** react · architecture · composition

### 2026-04-26 — Heuristic email classifier beats LLM for solo-user volume
**What happened:** When deciding how to bucket Gmail messages into recruiter / ats_update / interview_invite / linkedin / other, the temptation was an LLM call (Claude / Gemini) per message for accuracy.
**Root cause:** HQ's existing v8.6 decision rejected in-app LLM for cost + privacy reasons. Adding it back for inbox classification would rebuild the same complexity (key management, error handling, prompt versioning) for a feature that processes maybe 20 emails/day for one user.
**Fix / lesson:** `src/inbox/classifier.js` is regex + sender-domain rules, mirroring the existing `parseRecruiterEmail` heuristic posture. False-positive cost is bounded because the queue is review-first — nothing creates a Contact / Application until Chase clicks. Confidence scores are tracked but not yet surfaced; if false-positive rate gets annoying, add a confidence-threshold filter before reaching for an LLM.
**Tags:** architecture · simplicity · classifier

### 2026-04-26 — Separate Supabase row for OAuth state, not a column on the data blob
**What happened:** Tempting to put `gmail_email` + encrypted refresh token directly on `chase_job_search_v1` next to applications/contacts.
**Root cause:** That blob round-trips through localStorage → Supabase → localStorage on every save. Tokens would be backed up alongside non-sensitive data, exported during backups, and visible to anyone with localStorage access (XSS scope).
**Fix / lesson:** Tokens live in a separate `user_data` row with `app_key='job-search:gmail'` — same RLS gate, same table, but never spread into the data blob. Server endpoints read/write that row only. Browser sees the access token in memory and the gmail email address (returned in API responses); never the encrypted refresh token. Same pattern works for any future per-user OAuth (Slack, Calendar, etc.).
**Tags:** security · architecture · supabase

### 2026-04-26 — Morning Launchpad: derive stage state from existing data, don't persist a new schema
**What happened:** Option E needed a 3-stage daily flow (Discover → Apply → Outreach) that resets each day. First instinct was a `launchpadStage` field on `data` with date stamping, manual reset on day rollover, etc.
**Root cause:** Adding new persistence creates two sources of truth for daily progress (the new field AND `dailyActions` already counts apps + outreach for `DailyMinimums`). They drift, they need migration paths, they break sync.
**Fix / lesson:** `getLaunchpadProgress(applications, dailyActions, now)` derives stages from existing `dailyActions` (filtered to today) + `applications` Interested count. Active stage = first stage where `!done`. No new field, no migration, no schema change. Reload at midnight, the new day's filter naturally returns zero counts. Per-day "sent" Set persists in `localStorage` keyed by date — small enough that day-rollover cleanup isn't needed.
**Tags:** state · architecture · derive-don't-store

### 2026-04-26 — TodaysQueue ✓ Applied wasn't logging the daily action
**What happened:** While verifying Option E Stage 1 → Stage 2 transitions, noticed clicking "✓ Applied" on a TodaysQueue row moved the app to Applied stage but didn't increment the `0/5` applications counter on `DailyMinimums`. Only `ApplyWizardModal.markApplied` was logging `dailyAction("application", ...)`.
**Root cause:** v8.14's `handleMarkApplied` was a fast shortcut that bypassed the wizard — but it also bypassed the wizard's logging side-effect. So the daily floor was unreachable without the wizard, even though the apps were getting marked Applied.
**Fix / lesson:** Added `addDailyAction("application", ...)` to `handleMarkApplied` with an `app.stage === "Applied"` guard so it's idempotent if the user clicks twice or uses both shortcuts on the same app. Lesson: when adding a "shortcut path" parallel to a "long path" (wizard), audit which side-effects from the long path also belong on the shortcut. Logging counts as a side-effect.
**Tags:** bug · state · ux · daily-actions

### 2026-04-26 — Reuse the day-of-year rotation pattern, don't reinvent it
**What happened:** Building DiscoverySprint, the temptation was to write a `Math.floor(Date.now() / 86400000) % len` for "today's query" rotation. KassieCard already has the right pattern: anchor at Jan 1 of the current year (`new Date(year, 0, 0)`), subtract, divide by ms-per-day, modulo array length. That handles year boundaries, leap years, and time-zone drift consistently across cards.
**Root cause:** Two different rotation calculations on the same day would surface different content out of sync — Kassie quote and Discovery query would feel disconnected.
**Fix / lesson:** Pulled `getDailyDiscoveryQueries(now)` into `constants.js` so the helper is reusable and the math lives in one place. Future rotations (e.g., daily Resource highlight) use the same helper signature.
**Tags:** react · time · ux · architecture

### 2026-04-26 — Wizard modal beats new tab when daily flow is the goal
**What happened:** Apply Wizard (Option C) could have shipped as a new tab (consolidating with Apply Tools) or as an in-place modal. Chose the modal — same pattern as DebriefModal/OfferModal/PrepModal — so the user never leaves Focus tab during their morning routine.
**Root cause:** A new tab fragments the daily flow: Focus → AI tab → back to Focus. Modal stays "on top of" Focus and closes back to it. Less context-switch cost.
**Fix / lesson:** Default to modal when the feature is part of an existing routine on the current tab. Reserve new tabs for distinct workflows that need their own surface (Apply Tools, Pipeline, Contacts). Apply Wizard pairs naturally with TodaysQueue → both live on Focus.
**Tags:** ux · architecture · daily-flow

### 2026-04-21 — Identity folder beats duplicating doctrine in constants
**What happened:** Confidence Bedrock wave needed direction + strengths + friend feedback + Kassie's letter + voice rules surfaced inside Job Search HQ. Temptation was to inline everything into `constants.js`. Instead: source of truth lives at `/Users/chase/Developer/chase/identity/` (direction.md, strengths/, voice-brief.md, friend-feedback.md, kassie-notes.md). `constants.js` mirrors just what the app renders (`DIRECTION`, `STRENGTHS_SUMMARY`, `FRIEND_FEEDBACK`, `KASSIE_EXCERPTS`). Memory (`user_strengths.md`, `project_job_search_direction.md`) points at the identity folder so future Claude sessions pull from one place.
**Root cause:** Cross-app problem — Shipyard, LinkedIn rewrite, other portfolio apps need the same identity data. Duplicating in every app's constants would rot fast.
**Fix / lesson:** Identity data lives once in `chase/identity/`; each app mirrors the minimal slice it renders. Root `CLAUDE.md` points at the folder so any agent session picks it up.
**Tags:** architecture | docs | memory

### 2026-04-21 — Wins Log: auto-logged + manual is the right split
**What happened:** Plan called for auto-logging wins on stage progression, debrief entries, outreach replies, and daily-target hits. Also needed manual "Log a win" for small proofs Chase wants to capture himself. Built both paths with `autoLogged: true` flag so the two are visually distinguishable in `WinsLog` UI.
**Root cause:** Pure-auto wins miss the small stuff Kassie's letter is about ("you can do better" — small proofs that add up). Pure-manual wins require discipline Chase doesn't have in crisis mode. Both paths, clearly separated, is the answer.
**Fix / lesson:** Two data shapes sharing one schema via a boolean flag is lower overhead than separate models. `saveApp`/`saveContact` compare prev vs next and emit wins inside the same `setData` to avoid double-render.
**Tags:** react | state | product

### 2026-04-21 — Per-day dismissal key ≠ boolean
**What happened:** KassieCard needs to be dismissible but resurface the next day. Using a plain boolean in localStorage would make "dismissed" permanent. Solution: `chase_js_kassie_dismiss_v1` stores today's date string — card shows if the stored date ≠ today.
**Root cause:** State that resets daily isn't state, it's a date comparison. Treating it as a boolean would have needed a cleanup effect.
**Fix / lesson:** When UI state is "hide for today," store the date, not a flag. Same pattern already used in `completedBlocks` reset on reload (intentional daily tracker in CLAUDE.md).
**Tags:** react | localStorage | ux

### 2026-04-20 — Regex email parsing: prefer non-personal-provider sender, signature name fallback
**What happened:** Building `parseRecruiterEmail()` — the most important extraction targets (name, company, job title) each needed a prioritized fallback chain because recruiter emails vary wildly in structure.
**Root cause:** No single pattern covers all email formats. "From:" headers have name, but forwarded emails may not. Company name can come from the email domain but personal providers (gmail, yahoo, outlook) aren't company names. Job title appears in subject lines (often abbreviated, e.g. "PM") or in body prose with varying phrasing.
**Fix / lesson:** Layer patterns in priority order: `From:` header first for name, then signature; non-personal-provider domain for company, overridden by "at Company" body phrase; ATS URL patterns for job posting over generic "job/career" URLs. Accept that abbreviated job titles (PM, UX) won't match and make all fields user-editable before saving. 6/7 fields extracted from a realistic Stripe recruiter email in smoke test.
**Tags:** regex · parsing · ux · ai-tools

### 2026-04-20 — `computeOfferTotal` annualizes sign-on to avoid first-year skew
**What happened:** Designing offer comparison, the naive "total comp = base + bonus + equity + signOn" makes the first offer with a big sign-on look better than a higher base over any realistic tenure.
**Root cause:** Sign-on is one-time; base/bonus/equity repeat each year. Adding raw sign-on inflates year 1 and creates bad comparisons once you're looking at "which offer is better long-term".
**Fix / lesson:** `computeOfferTotal(offer)` amortizes sign-on over 4 years (`signOnBonus / 4`) — same horizon equity is already annualized against. Returns `null` when base is missing so the UI falls back to `—` instead of a misleading `$0`. Document the formula directly in `OfferModal`'s preview block so the user sees the math.
**Tags:** data-model · finance · ux

### 2026-04-14 — iOS AppIcon should be full-bleed (no rx); web logo keeps rx
**What happened:** The web `logo.svg` uses `rx="96"` rounded corners per the portfolio template — those are intentional for browser/PWA display. The iOS AppIcon PNG however must be a full-bleed square with no corner radius; Apple applies its own squircle mask at render time.
**Root cause:** Two different rendering contexts: browser shows the SVG rect corners directly; iOS crops with its own mask regardless of what the PNG contains. Putting rx on the AppIcon source wastes the safe area and the mask alignment doesn't match.
**Fix / lesson:** Keep `rx="96"` in `public/logo.svg` (web). For the iOS icon, strip rx before rasterizing: `sed 's/rx="96" //' logo.svg > /tmp/icon.svg && qlmanage -t -s 1024 -o /tmp /tmp/icon.svg`. Copy result to `Assets.xcassets/AppIcon.appiconset/AppIcon.png`.
**Tags:** icons · svg · ios · deploy

### 2026-04-14 — `docs/templates/PORTFOLIO_APP_LOGO.md` is the source of truth for svg attributes
**What happened:** An earlier session removed `rx` rounded corners from the web logo as a "fix", but the portfolio template explicitly requires `rx="96"`. This created a drift between the template and the live file that had to be corrected.
**Root cause:** Logo SVG was edited without checking the canonical template. The template at `docs/templates/PORTFOLIO_APP_LOGO.md` specifies canvas size, rx value, font-family, font-size, letter-spacing, and positioning. Deviating from it causes visual inconsistency across apps.
**Fix / lesson:** Before editing any logo SVG, read `docs/templates/PORTFOLIO_APP_LOGO.md` first. Treat it as the single source of truth — don't remove or change attributes unless you're also updating the template.
**Tags:** icons · svg · tooling · gotcha

### 2026-04-13 — Extension imports need the authenticated shell
**What happened:** Opening Job Search HQ with `?importContact=` while the login screen was showing meant import state never reached the contact/application modals.
**Root cause:** URL import ran on first mount before session was resolved; the main app tree (modals) is not mounted until after Supabase auth.
**Fix / lesson:** Run bookmarklet/extension import consumption in a `useEffect` gated on `session` being ready (and `hasLoaded`), then strip query/hash with `replaceState`.
**Tags:** chrome-extension · supabase · auth · react

### 2026-04-13 — Analytics should use closed outcomes only
**What happened:** Win/loss analytics needed to reflect final outcomes without being skewed by active pipeline stages.
**Root cause:** Including non-final stages in outcome percentages distorts conversion signals and under-represents true offer/reject rates.
**Fix / lesson:** Compute outcome analytics from closed stages only (`Offer`, `Rejected`, `Withdrawn`) and show percentages against that closed total.
**Tags:** analytics · data-model · ux

### 2026-04-13 — JSON-first AI output is more stable for structured editors
**What happened:** STAR story drafting needed to populate multiple editable fields rather than one text blob.
**Root cause:** Freeform AI output requires brittle parsing and slows user edits when each section should remain independently editable.
**Fix / lesson:** Prompt Claude for strict JSON shape and parse into normalized story fields; keep a fallback path for malformed output.
**Tags:** ai · prompts · data-model

### 2026-04-13 — Safer migration path for prep model changes
**What happened:** Interview prep moved from one `prepNotes` string to sectioned prep data, but existing saved apps already had legacy prep text.
**Root cause:** Directly switching fields would hide prior prep content for existing users unless migrated at hydration time.
**Fix / lesson:** Add normalization helpers (`normalizePrepSections`, `normalizeApplication`) and hydrate old `prepNotes` into a section (`roleAnalysis`) so historical prep remains visible.
**Tags:** react · migration · data-model

### 2026-04-13 — Follow-up nudges need explicit status guard
**What happened:** Cadence nudges became noisy unless they only targeted contacts with outreach already sent.
**Root cause:** Day-based follow-up logic without status filtering can surface reminders for contacts who haven't been messaged yet.
**Fix / lesson:** Gate day 3/day 7 nudges behind `outreachStatus === "sent"` plus a valid `outreachDate`, then escalate message tone by threshold.
**Tags:** react · ux · data-model

### 2026-04-13 — Style key collisions trigger ESLint warnings
**What happened:** `npm run build` flagged `no-dupe-keys` after adding new FocusTab outreach styles because `s.outreachBadge` already existed for contact cards.
**Root cause:** The shared `s` style object is large; adding similarly named keys can silently collide until lint/build runs.
**Fix / lesson:** Use feature-specific key names (`outreachCountBadge` vs existing contact `outreachBadge`) and always run a build immediately after adding style tokens.
**Tags:** react · lint · styles

### 2026-04-13 — SVG favicon rendering on macOS
**What happened:** `qlmanage -t -s 512` produces clean PNG renders from SVG files on macOS without needing ImageMagick, rsvg-convert, or any npm packages.
**Root cause:** qlmanage is the Quick Look thumbnail generator — it's on every Mac and handles SVG natively.
**Fix / lesson:** For SVG → PNG conversion in this monorepo, use `qlmanage -t -s <size> -o /tmp <file>.svg && cp /tmp/<file>.svg.png dest.png`. Then `sips -z H W` for resizing.
**Tags:** tooling · icons · svg

### 2026-04-14 — Vercel CLI doubles path when rootDirectory is set + CI kills ESLint warnings
**What happened:** `vercel --prod` from inside `portfolio/job-search-hq/` failed with "path does not exist" — path was being doubled (`portfolio/job-search-hq/portfolio/job-search-hq`). Also, a pre-existing `no-unused-vars` warning in FocusTab caused the Vercel CI build to fail (Vercel sets `CI=true`, which makes CRA treat warnings as errors).
**Root cause:** The Vercel project has `rootDirectory: "portfolio/job-search-hq"` configured for GitHub auto-deploy. Running the CLI from inside that subdirectory appends the rootDirectory on top of the cwd, doubling it. The unused `handleQuickAdd` function was harmless locally but fatal in CI.
**Fix / lesson:** For this project, always run `vercel --prod` from the **monorepo root** (`~/Developer/chase/`) with a temp `.vercel/project.json` pointing at the job-search-hq project ID. Remove the temp file after deploying. And fix all ESLint warnings before deploying — Vercel CI has zero tolerance.
**Tags:** deploy · vercel · lint

### 2026-04-18 — Pillow can't do fill="none" — simulate outline text with fill=BG
**What happened:** Wanted stroke-only ("outline") logo text in the iOS brand asset generator. SVG supports `fill="none" stroke="white"` natively, but Pillow's `ImageDraw.text()` doesn't have a fill=none mode.
**Root cause:** Pillow renders text as filled glyphs; stroke_width just adds an outline around the fill. There's no built-in way to suppress the fill.
**Fix / lesson:** Simulate outline by drawing text with `fill=BG_COLOR` (same as background) and `stroke_fill=WHITE, stroke_width=N`. The letter interior blends with the background, leaving only the white stroke visible. Works well for thick-stroke designs; breaks if there are background gradients or images behind the text.
**Tags:** python · pillow · icons · ios · svg

### 2026-04-18 — HTML mockup files are the right review tool for logo design choices
**What happened:** User wanted to pick a logo color/style without going back and forth on described options.
**Root cause:** Logo aesthetics are subjective — text descriptions of colors don't translate well.
**Fix / lesson:** Generate a standalone `design/logo-mockup.html` file with all options rendered as inline SVG. User picks by visual review before any code is committed. Two rounds (colors first, then styles) worked well. Keep mockup files in `design/` for reference.
**Tags:** design · workflow · svg

### 2026-04-13 — FocusTab needs app/contact data props from App.jsx
**What happened:** FocusTab previously only received `completedBlocks` / `expandedBlock` state. Adding the action queue required passing `applications`, `contacts`, `setAppModal`, `setPrepModal`, `setTab` from App.jsx.
**Root cause:** The queue is derived from live data, not persisted state — it belongs in FocusTab as computed logic.
**Fix / lesson:** Any new feature on FocusTab that reacts to pipeline/contacts data needs those arrays threaded through from App.jsx. The shell owns the data; tabs derive from it.
**Tags:** react · architecture · props
