# Changelog

## [Unreleased] — 2026-04-30 — Glass redesign: 3-font system + 80% surface glass (v8.18 polish)

Shipyard-parity visual upgrade. Cards go from nearly-invisible 5% white fills to 80% surface opacity frosted glass. Typography upgraded to a 3-font system matching Shipyard: Instrument Sans (body), Big Shoulders Display (page titles + stat numbers), DM Mono (uppercase labels + code blocks). Zero regressions — all changes flow through `tokens.js` + the `s` styles object.

### Changed
- **`src/tokens.js`** — 4 token changes: `card` `rgba(255,255,255,0.05)` → `rgba(14,26,62,0.80)`, `cardSubtle` `rgba(255,255,255,0.03)` → `rgba(14,26,62,0.50)`, `border` `rgba(59,130,246,0.12)` → `#1A2A50` (Shipyard dimmer), `modalBg` opacity 0.95 → 0.92. Cascades to ~40+ uses automatically.
- **`src/constants.js`** — Google Fonts import switched from DM Sans to Instrument Sans + Big Shoulders Display + DM Mono (single combined URL). `s.root.fontFamily` → Instrument Sans. ~25 style keys updated: Big Shoulders Display added to `headerTitle`, `focusCountNum`, `statNum`; DM Mono added to all 12 uppercase label keys (`sectionLabel`, `aqLabel`, `urgencyBadge`, `zoneLabel`, `inboxKindBadge`, etc.) and all monospace keys (`resultText`, `baseResumePreview`). Letter-spacing normalized to `0.08em` on all label keys.
- **`src/index.css`** — body font-family updated to Instrument Sans.
- **`src/App.jsx`** — 4 `'DM Sans'` references → `'Instrument Sans'`. SVG HQ logomark `fontFamily` → Big Shoulders Display. `pageTitle` + `logoText` → Big Shoulders Display. `navLabel` → DM Mono. Auth screen titles → Big Shoulders Display; auth labels → DM Mono.
- **`src/tabs/FocusTab.jsx`** — 3 inline label styles → DM Mono, letterSpacing normalized.
- **`src/tabs/AITab.jsx`** — stat number → Big Shoulders Display; monospace textarea → DM Mono.
- **`src/tabs/ContactsTab.jsx`** — bookmarklet label → DM Mono; code display → DM Mono.
- **`src/components/OfferModal.jsx`** — 3 label styles → DM Mono; total comp number → Big Shoulders Display.
- **`src/components/OfferCompareView.jsx`** — TH_LABEL `fontFamily` → DM Mono, `letterSpacing` px → em; total comp cells → Big Shoulders Display.
- **`src/components/OutreachTimeline.jsx`** — `headerLabel` → DM Mono.
- **`src/components/ProfileModal.jsx`** — resume textarea `"monospace"` → DM Mono.

### Files cascading automatically (no edits needed)
PipelineTab, ResourcesTab, AppCard, AppModal, ContactCard, ContactModal, InboxPanel, InboxItem, Field, AIResult, PrepModal, DebriefModal, ApplyWizardModal — all pick up glass + border changes via `T.card`/`T.border` tokens.

---

## [Unreleased] — 2026-04-30 — Glass-card token sweep (v8.18 polish)

Zero raw hex/rgba colors remain in `src/` outside of `src/tokens.js`. Mechanical refactor — no visual changes.

### Changed
- **`src/tokens.js`** (created) — single source of truth for every color in the app. ~60 named tokens organized by role (core, accent, success, warning, danger, purple, gold, kassie, area-specific, computed). Aligned with Shipyard's nautical token vocabulary where possible.
- **`src/constants.js`** — `import { T } from "./tokens"`. All raw colors in data arrays (`STAGE_COLORS`, `CONTACT_TYPES`, `OUTREACH_STATUSES`, `DIRECTION_TRACKS`, `WIN_TYPES`, `DEBRIEF_IMPRESSIONS`, `OUTREACH_EVENT_TYPES`, `INBOX_KINDS`, `FOCUS_BLOCKS[].tagColor`, `RESOURCES[].color`), helper functions (`nextStepUrgency`, `getPriorityTone`, `getOutreachCadenceNudge`), the entire `s` styles object (~280 lines), and the `css` template literal all replaced with `T.*` references. Compound border strings converted to template literals.
- **`src/App.jsx`** — auth screens (`authInputStyle`, `authBtnStyle`, `LoginScreen`, `SetPasswordScreen`), `sidebarStyles`, and loading screen all tokenized. Loading screen gradient switched from raw hex to `T.bgGradient`.
- **`src/ErrorBoundary.jsx`** — added `import { T }` and replaced 3 raw colors.
- **`src/tabs/FocusTab.jsx`** — ~90 replacements: Kassie card purple cluster, urgency ternaries, DirectionSplit, WinsLog, DailyActionCounter, MorningLaunchpad stages.
- **`src/tabs/AITab.jsx`** — ~40 replacements: mock interview, scenario chips, stat boxes, STAR bank.
- **`src/tabs/ContactsTab.jsx`** — ~30 replacements: SalesNavGuide, stats bar, company intel.
- **`src/tabs/ResourcesTab.jsx`** — ~12 replacements: Chrome extension guide, backup section.
- **`src/components/OfferCompareView.jsx`** — removed local `GREEN`/`GREEN_BG` constants; ~30 replacements.
- **`src/components/ProfileModal.jsx`**, **`DebriefModal.jsx`**, **`ApplyWizardModal.jsx`**, **`AppCard.jsx`**, **`OfferModal.jsx`**, **`ContactModal.jsx`**, **`InboxPanel.jsx`**, **`PrepModal.jsx`**, **`ContactCard.jsx`**, **`OutreachTimeline.jsx`** — fully tokenized.
- **`docs/BRANDING.md`** — palette table updated to actual Command Blue + token sweep values; "Command Blue" heading; token-name column added; Shipyard alignment column; rule added: no raw hex/rgba outside `src/tokens.js`.
- Build: clean, 186.87 kB gzipped (unchanged — refactor only).

### Verified clean
- `grep -rn '#[0-9a-fA-F]\{3,8\}' src/ --include='*.js' --include='*.jsx' | grep -v tokens.js` → empty
- `grep -rn 'rgba(' src/ --include='*.js' --include='*.jsx' | grep -v tokens.js` → empty
- `src/shared/ui.jsx` intentionally untouched (app-agnostic defaults, separate palette intent)

---

## [Unreleased] — 2026-04-29 — Command Blue redesign mockup + HQ monogram logo

### Design
- **`design/mockup-focus.html`** — standalone HTML mockup showing the Focus tab with Command Blue treatment. Applies the same readability upgrades from Shipyard's redesign (glass cards, 14px text floor, 44px touch targets, `backdrop-blur` surfaces) while keeping JSHQ's blue `#3b82f6` accent instead of Shipyard's gold. Layout uses a 240px left sidebar matching Shipyard's nav pattern. Sections: urgency header (Day 438), Kassie card, Morning Launchpad (3 stages), Gmail Inbox + Action Queue split-hero, daily action counters, pipeline summary with stage pills.
- **`design/logo-concepts.html`** — 6 SVG logo concepts at 3 sizes (sidebar icon, app icon blue bg, app icon dark bg) plus sidebar lockup preview: Crosshair, HQ Monogram, Compass Rose, Signal, Launchpad, Command Shield. **HQ Monogram selected** — bold typographic "HQ" filling the entire icon (DM Sans 800, `font-size: 38` in 48px viewport).
- **Design direction documented in plan:** `~/.claude/plans/show-me-what-a-buzzing-flask.md` — Command Blue token mapping, mockup section breakdown, differences from Shipyard.

### Notes
- No code changes to the app — design evaluation only. Implementation would convert the `s` styles object in `constants.js` to match the mockup tokens.
- Mockup uses Inter font (Google Fonts CDN); actual app uses DM Sans. Font choice would be finalized during implementation.

---

## [Unreleased] — 2026-04-29 — Gmail OAuth activation complete ✅ (v8.18 live)

Activation checkpoint: All four env vars configured on Vercel, OAuth flow validated end-to-end, InboxPanel pulling live Gmail data. Chase successfully connected to Gmail and saw 2 LinkedIn notifications in the inbox (Crunchbase hiring + Ameer Hamza opportunity).

- **Fixed OAuth flow:** removed bogus `codeVerifier` from browser request body (popup mode doesn't use PKCE); made it optional in server code so future PKCE-based flows can coexist
- **Fixed env var whitespace:** added `.trim()` to all environment variable reads in `src/inbox/oauth.js`, `api/gmail/exchange.js`, `api/gmail/refresh.js`, `api/_lib/crypto.js`, and `api/_lib/supabase.js` to prevent silent failures from trailing newlines on Vercel
- **Improved error messaging:** error detail extraction now surfaces Google's actual rejection reason (e.g., `redirect_uri_mismatch`) instead of generic `token_exchange_failed`
- **Vercel deployment:** all four env vars (`REACT_APP_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GMAIL_TOKEN_ENC_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) added to production + preview scopes; production-only secrets correctly scoped
- **Testing:** live OAuth popup → authorization code → server-side token exchange → encrypted Supabase storage → auto-refresh on expiry ✓; InboxPanel connected state ✓; Gmail inbox sync running ✓

## [Unreleased] — 2026-04-28 — Inbox setup polish + Gmail Forge end-to-end verified

- **`src/components/InboxPanel.jsx`** — `SetupGuide()` callout updated: references `healthCheck_jobSearch` (no trailing underscore — renamed in Gmail Forge so it shows in the Apps Script Run dropdown). Manual filter steps stay in place for non-Forge users.
- **Gmail Forge verified end-to-end:** trigger active, `JobSearch` label created, 3-pass `matchRules_()` deployed, LinkedIn social split confirmed. JSHQ InboxPanel will populate on next matching job email.
- **Why:** JSHQ uses `labelIds=<JobSearch>` in Gmail API calls — the label must exist and be applied by Forge for emails to surface here.
- **Companion changes in [gmail-forge/CHANGELOG.md](../gmail-forge/CHANGELOG.md)** — 3-pass match refactor, LinkedIn social → Notification split, `healthCheck_jobSearch` rename, label created, XML re-imported.

## [Unreleased] — 2026-04-28 — Inbox setup polish for Gmail Forge users

- **`src/components/InboxPanel.jsx`** — `SetupGuide()` now opens with a green "Using Gmail Forge?" callout that tells the user the `JobSearch` label is created and applied automatically every 5 min and points them at `healthCheck_jobSearch_()` for verification. Manual filter steps stay in place for users without Gmail Forge. Build clean (+162 B gzipped).
- **Why:** JSHQ uses `labelIds=<JobSearch>` in Gmail API calls, and Gmail Forge's `auto-sort.gs` already labels matching ATS / LinkedIn senders + (new this session) interview-keyword subjects. The pasted manual filter instructions implied users had to do this themselves — confusing for the primary user.
- **Companion change in [gmail-forge/CHANGELOG.md](../gmail-forge/CHANGELOG.md)** — added `subjectPatterns` to the `JobSearch` rule, wired subject matching in `matchRules_()`, added `JobSearch` to the Gemini prompt, added a `healthCheck_jobSearch_()` diagnostic, and bumped XML filter count 70 → 73.

## [Unreleased] — 2026-04-26 — Gmail Inbox Feed (v8.18)

Closes the deferred next-wave item "Email / LinkedIn notification feed." HQ now pulls a Gmail label, classifies recruiter pings / ATS updates / interview invites / LinkedIn notifications, and surfaces them as a triage queue on Focus tab. Read-only — replies still happen in Gmail. Token exchange runs server-side so `client_secret` never enters the browser.

### Added
- **`api/gmail/exchange.js`, `api/gmail/refresh.js`, `api/gmail/disconnect.js`** — Vercel serverless functions wrapping Google's OAuth code-exchange + refresh. Validate the caller via the Supabase access-token JWT, encrypt the Google refresh token with AES-256-GCM via `api/_lib/crypto.js`, store at rest in a separate Supabase `user_data` row keyed `app_key='job-search:gmail'` (never written to localStorage). `api/_lib/supabase.js` is the server Supabase client (service-role) with helpers for read/write/delete of that row.
- **`src/inbox/oauth.js`** — Browser GIS loader. Lazy-loads `accounts.google.com/gsi/client`, runs `initCodeClient` in popup mode with `access_type: offline` + `prompt: consent` to ensure refresh tokens. Caches `access_token` in module memory only; auto-refreshes within 5 min of expiry; throws `code: "reconnect_required"` on Google `invalid_grant` so the panel can prompt re-consent.
- **`src/inbox/gmailClient.js`** — Browser Gmail REST client (CORS-enabled, no server hop). `findLabelId`, `listLabeledMessages`, `fetchMessage` with full MIME walk + base64url decode. Returns parsed `{ from: {name,email,domain}, subject, snippet, bodyText, bodyHtml, headers }`.
- **`src/inbox/classifier.js`** — Heuristic classifier returning `{ kind, confidence, parsed }`. Branches: `linkedin` (sender domain), `ats_update` (sender domain match against `ATS_SENDER_DOMAINS` — Greenhouse / Lever / Workday / Ashby / SmartRecruiters / Jobvite / BambooHR / Workable / Recruitee / iCIMS / Taleo / SuccessFactors), `interview_invite` (calendar attachment OR subject keyword + scheduling URL — Calendly / GoodTime / x.ai / ChiliPiper / SavvyCal / cal.com / Zoom Scheduler), `recruiter` (delegates to existing `parseRecruiterEmail` when ≥3 of name/email/company/role are extractable from a non-personal-provider domain). ATS sub-kinds: `auto_reject` / `application_received` / `assessment` / `next_step` with suggested target stage.
- **`src/inbox/syncInbox.js`** — Orchestrator. `runInboxSync({ existingInbox, labelName })` ensures a token, lists labeled messages, fetches + classifies any not already known by `gmailMessageId`, returns `{ newItems, labelMissing }`.
- **`src/components/InboxPanel.jsx`** — Focus-tab panel mounted between `MorningLaunchpad` and `TargetCompanyBoard`. States: not-connected → "Connect Gmail" CTA + collapsible setup guide listing the Gmail filter rules; connected → header (`📬 Inbox · N pending` + `gmail-address · synced 2m ago` + ↻ Refresh + Disconnect), top 5 pending items, "+N more" tail; label-missing → guidance row; reconnect-required → inline error.
- **`src/components/InboxItem.jsx`** — Single notification card. Action buttons by kind: recruiter → Save Contact + App / Save Contact / Snooze 24h / Dismiss; ats_update.next_step → Bump <Company> → <Stage> / Open application; ats_update.auto_reject → Mark <Company> rejected; interview_invite → Schedule + open prep (creates app if no match); linkedin.inmail → Save Contact; linkedin.* → Dismiss.
- **`inbox: []`** added to `defaultData` in `constants.js`. New helpers: `INBOX_KINDS`, `INBOX_STATUSES`, `inboxKindMeta(kind)`, `normalizeInboxItems(items)`, `isInboxPending(item, now)`, `matchAppFromInboxItem(item, applications)` (case-insensitive, alphanumeric-only company match against parsed.company → from.name → from.domain). Tokens added to `s`: `inboxPanel`, `inboxHeader`, `inboxTitle`, `inboxSub`, `inboxActions`, `inboxRefreshBtn(+Spin)`, `inboxConnectBtn`, `inboxDisconnect`, `inboxEmpty`, `inboxIntro`, `inboxItem(+Top|Title|Time|Subject|Snippet|Actions)`, `inboxKindBadge`, `inboxBtn(Primary|Secondary|Dismiss)`, `inboxError`, `inboxSetupGuide(+Title)`.
- **App.jsx inbox handlers**: `mergeInboxItems` (idempotent on `gmailMessageId`), `dismissInboxItem`, `snoozeInboxItem(id, hours)`, `inboxOpenContact`, `inboxOpenContactAndApp`, `inboxBumpStage`, `inboxOpenAppEdit`, `inboxSetInterview`, `markInboxActioned`. Modal config now accepts an optional `onAfterSave` callback that fires once after the existing `saveContact`/`saveApp` commits — used by inbox actions to mark items actioned + auto-log wins (`type: "response", source: "app:<id>" | "contact:<id>", autoLogged: true`).

### Configuration (one-time, per-machine)
- New env: `REACT_APP_GOOGLE_CLIENT_ID` (browser-safe), and server-only `GOOGLE_CLIENT_SECRET` + `GMAIL_TOKEN_ENC_KEY` (32-byte base64) + `SUPABASE_SERVICE_ROLE_KEY`. Add via `vercel env add` for production + preview. `.env.example` updated.
- GCP: new "Job Search HQ" project, enable Gmail API, OAuth consent External (Testing) with `chase.t.whittaker@gmail.com` as test user, OAuth Web client with redirect URIs `http://localhost:3001` + `https://job-search-hq.vercel.app`.
- Gmail: create label `JobSearch`, add filters from senders: `linkedin.com`, `greenhouse.io`, `hire.lever.co`, `myworkday.com`, `ashbyhq.com`; subject contains `interview OR schedule OR availability`. Setup-guide panel inside HQ documents this.

### Architecture decisions
- **Token storage:** Refresh token encrypted at rest in Supabase via AES-256-GCM (`GMAIL_TOKEN_ENC_KEY`); access token in browser memory only. Tokens never serialized to localStorage. Same RLS gate as `chase_job_search_v1` but a separate row (`app_key='job-search:gmail'`) so the row is never spread into the data blob and is revocable independently.
- **Browser-side fetch, server-side exchange:** Token exchange + refresh require `client_secret` (Google Web Application client type), so they live in `api/gmail/*`. Email fetching uses Gmail's CORS endpoints directly with the access token — no per-fetch server hop.
- **Review-first:** Nothing creates a Contact / Application / wins entry until Chase clicks the action button. Confidence threshold can be tuned post-ship if false positives bite.
- **Cross-device:** `inbox` array rides along in `chase_job_search_v1`, so when Job Search HQ iOS Phase 2 sync ships, actioned items + wins flow to iPhone for free.

### Notes
- Build clean, +8.73 kB gzipped (176.38 → 185.11 kB). No data-shape break; `normalizeInboxItems` defaults missing fields.
- Verified end-to-end via dev preview: panel renders the not-connected CTA between MorningLaunchpad and TargetCompanyBoard; setup-guide toggle expands the filter list; no console errors. Real Gmail-connected flow (the four-message classifier smoke test from the plan's verification) requires the GCP setup steps above and will be verified post-deploy.
- Pre-existing dev-mode quirk noted: `useState(defaultData)` + StrictMode double-effect can briefly write defaults to localStorage during the load→save race on reload. Pre-dates v8.18, unchanged here, doesn't affect production. Worth a follow-up to move the load into a `useState(() => loadInitial())` lazy initializer.

---

## 2026-04-26 — Daily Flow Option E: Morning Launchpad (v8.17)

Wires A + B + C + D into one soft-gated 3-stage daily flow at the top of the Focus tab. The math: Discover 15 min + Apply 50 min + Outreach 15 min = ~80 min from "open the app" to "daily floor cleared." Replaces the prior pattern of hunting through 16 stacked sections to figure out where to start.

### Added
- **`getLaunchpadProgress(applications, dailyActions, now)`** in `constants.js` — derives the 3-stage state from existing data (no new persistence). Stage targets: Discover ≥1 Interested job (flow trigger), Apply ≥`DAILY_MINIMUMS.applications` daily actions, Outreach ≥`DAILY_MINIMUMS.outreach` daily actions. Returns `{ stages, activeKey, allDone, totalMinutes, isSunday }`. `activeKey` = first stage where `!done`. Sunday returns rest mode.
- **`MorningLaunchpad` component** in `FocusTab.jsx` (mounted between `KassieCard` and `TargetCompanyBoard`). Header: "🚀 Morning Launchpad · ~80 min" + 3-dot stage strip + "✓ Day cleared" pill. Each stage renders as a `launchpadStage` panel: active = full nested UI, done = collapsed checkmark + summary, future = collapsed goal-label preview. All stage headers are clickable to override the active key — soft gating, not hard locks.
- **`OutreachSprint` sub-component** — Stage 3 body. Top 3 from `buildOutreachPriorityList` with Copy Prompt + **✓ Mark Sent** + Edit + Open App buttons per row. The new ✓ Sent button calls `addDailyAction("outreach", "Messaged ${name} at ${company}")` so the 3-per-day outreach floor can be cleared inside the launchpad. Sent state persists per-day via `chase_js_outreach_sent_${date}` localStorage entries — survives reload, auto-resets next day.
- **17 launchpad style tokens** in `s.*` (`launchpad`, `launchpadHead`, `launchpadTitle`, `launchpadStripe`, `launchpadDot` + `Active` + `Done`, `launchpadCleared`, `launchpadStage` + `Active` + `Done`, `launchpadStageHeader`, `launchpadStageBadge` + `Active` + `Done`, `launchpadStageBody`, `launchpadRest`, `launchpadRestTitle`, `outreachSentRow`, `outreachBtnSent`).

### Changed
- **`FocusTab.jsx`** — replaced standalone `<DiscoverySprint />` + `<TodaysQueue />` mounts with a single `<MorningLaunchpad />` that renders both internally as Stage 1 and Stage 2 bodies. The full "Who should I message today?" outreach list at the bottom of the tab stays unchanged for browsing — Stage 3 of the launchpad is the compact top-3 sprint.
- **`TodaysQueue`'s ✓ Applied shortcut** — now also calls `addDailyAction("application", ...)` (with a guard so it's idempotent if the app is already Applied). Pre-v8.17 only `ApplyWizardModal.markApplied` logged the daily action, which meant the shortcut moved an app to Applied but didn't tick the daily floor counter. Stage 2 progress was previously unreachable via the shortcut alone.

### Notes
- No data-shape changes, no migration. Pure additive UI + one bugfix.
- Build: zero warnings, +2.0 kB gzipped (176.34 → 176.38 kB).
- Verified end-to-end via preview: Discover stage active by default → AppModal save flow with pre-filled URL/Company/Title → Stage 1 collapses to "1 job queued · 15 min" + Stage 2 activates with TodaysQueue inside. Sunday branch verified separately (today is Sunday 2026-04-26 — the rest card renders cleanly).
- Email/LinkedIn notification feed stays on the deferred next-wave list.

---

## 2026-04-26 — Daily Flow Options B + C: Discovery Sprint + Apply Wizard (v8.16)

Pairs with v8.14 Today's 5: Discovery Sprint fills the daily Interested queue, the Apply Wizard drains it. Removes the last manual hand-off in hitting the 5-applications-per-day floor.

### Added
- **`getDailyDiscoveryQueries(now)`** in `constants.js` — deterministic day-of-year rotation through `JOB_SEARCH_QUERIES` (9 queries). Returns `{ today, next, todayIdx, nextIdx, total }`. Same pattern `KassieCard` uses, so today's query is stable for the whole day.
- **`DiscoverySprint` component** on Focus tab (between `KassieCard` and `TodaysQueue`) — three pieces: (1) today's rotating query in a callout, (2) "🚀 Open all searches" launches LinkedIn / Indeed / Google in three tabs (reuses `JOB_SEARCH_EXTERNAL_LINKS` from `applyPrompts.js`), (3) Quick-capture strip (URL + Company + Title) → opens `AppModal` pre-filled with `stage: "Interested"`. Optional "↻ Skip to next" button to flip the rotation manually.
- **`ApplyWizardModal.jsx`** — single-screen 7-step modal that walks one Interested app to Applied. Steps: Confirm → JD paste → Copy tailor prompt → Copy cover prompt → Open apply URL + Mark Applied → Auto-log + 7-day follow-up date → Reset for next Interested app. Mark Applied calls `saveApp` (stage = Applied, `appliedDate` = today, `nextStepDate` = +7d, `nextStepType` = `follow_up`) and `addDailyAction("application", ...)`. Counter "Today: N/5" reads `data.dailyActions`. Reuses `buildTailorResumePrompt` and `buildCoverLetterPrompt` from `applyPrompts.js` — voice + direction footer is already baked into both.
- **6 style tokens for Discovery Sprint** + **9 style tokens for Apply Wizard** in `s.*` (`s.discoverySprint`, `s.discoveryQueryBox`, `s.discoveryOpenAll`, `s.discoveryCaptureGrid`, …, `s.wizModal`, `s.wizProgressTrack`, `s.wizProgressFill`, `s.wizStepLabel`, `s.wizCta`, `s.wizCtaCopied`, `s.wizFooter`, `s.wizDoneBadge`, `s.wizCounter`).

### Changed
- **TodaysQueue's "Apply Kit ↗" button** → **"🚀 Apply"** button. Opens the in-place wizard via new `setApplyWizard` shell prop instead of routing to the AI tab + Apply Kit. Falls back to the old behavior if `setApplyWizard` is missing.
- **`App.jsx`** — new `applyWizard` shell state, `<ApplyWizardModal />` render alongside `<DebriefModal />` / `<OfferModal />`, `setApplyWizard` threaded into `<FocusTab />` → `<TodaysQueue />`.
- **`FocusTab.jsx`** — imports `getDailyDiscoveryQueries` + `JOB_SEARCH_EXTERNAL_LINKS`, mounts `<DiscoverySprint />` between `KassieCard` and `TodaysQueue`, accepts `setApplyWizard` prop.

### Notes
- No data-shape changes, no migration. Pure additive UI.
- Build: zero warnings, +2.87 kB gzipped.
- Verified end-to-end: Discovery quick-capture → Interested app → 🚀 Apply → wizard step 1–5 → Mark Applied → step 7 reset → Today's floor counter increments → close cleanly.
- Email/LinkedIn notification feed (Gmail OAuth or forward-to-alias) stays on the deferred next-wave list. Bigger lift; revisit after v8.16 lands.

---

## [Unreleased] — 2026-04-21 — Confidence Bedrock wave (v8.13)

Committed direction: **Implementation Consultant / Sales Engineer at payments-adjacent companies** (Stripe, Adyen, Checkout.com, Finix, etc.). AE at payments SaaS is the documented backup, not the lead. Source of truth for direction, strengths, and voice lives in `/Users/chase/Developer/chase/identity/`.

### Added
- **`RESUME_TEMPLATE_IC`** — new primary resume template. Leads with merchant-live implementation wins (Authorize.Net onboarding, 98% integration resolution, SOPs adopted by team) + "Independent Portfolio Work — Next.js + Supabase apps Feb 2025 – present" to own the 14-month gap. `defaultData.baseResume` now points here. `RESUME_TEMPLATE_AE` kept as backup, `RESUME_TEMPLATE_PM` as legacy.
- **Direction / Strengths / Friend Feedback in `ProfileModal`** — three collapsible read-only panels mirroring `chase/identity/`. Reads `DIRECTION`, `STRENGTHS_SUMMARY`, `FRIEND_FEEDBACK`, `FRIEND_FEEDBACK_CONSENSUS` from constants.
- **Kassie urgency layer on `FocusTab`** — (1) `UrgencyHeader` "Day N since Visa" reading `LAYOFF_DATE`; (2) `DailyMinimums` card with 3 progress bars (5 applications / 3 outreach / rest floor) that stays red until all three hit target, Sunday-aware; (3) `KassieCard` rotating through `KASSIE_EXCERPTS` deterministically by day-of-year, per-day dismissal via `chase_js_kassie_dismiss_v1` localStorage key; (4) `DirectionSplit` card showing IC/SE/AE/Other counts + response rates from `getDirectionSplit(applications)`; (5) `WinsLog` card showing last 5 wins with manual "Log a win" button.
- **Wins Log data model** — `wins: []` in `defaultData`, `blankWin()`, `normalizeWins()`, `WIN_TYPES = ['response', 'progression', 'daily_target', 'manual']` in constants. Auto-logged in `App.jsx`: `saveApp` on stage progression (Phone Screen+) and new interview-log entries; `saveContact` on `outreachStatus → replied`. `autoLogged: true` distinguishes auto from manual.
- **Direction Tracker** — `track: "IC" | "SE" | "AE" | "Other"` on every application (default IC). `getDirectionSplit(applications)` helper returns per-track counts + response rates. Powers market-feedback card on Focus tab.
- **`VOICE_DIRECTION_FOOTER` in `applyPrompts.js`** — voice + direction rules (no em-dashes, no rule-of-threes, no hype, no consultant phrasing; lean into 5 strengths without naming them; gap narrative for the 14-month Next.js/Supabase stretch). Appended to every drafting prompt: tailor resume, cover letter, apply kit, connect, follow-up, STAR draft, interview prep.
- **5 strength-anchored `STAR_COMPETENCIES`** — "Conflict reduction (Harmony)", "Coaching & enablement (Developer)", "Consistency & fairness (Consistency)", "Pattern recognition (Context)", "Tailored communication (Individualization)".
- **Mock interview scenarios** — "Implementation Consultant — Payments" (6 qs: enterprise merchant onboarding, integration crisis, post-launch handoff, webhook diagnosis) and "Sales Engineer — Dev Tools" (6 qs: developer-led discovery, POC scoping, whiteboarding, technical objections, AE/CS partnership).
- **`STRENGTH_ANSWER_HOOKS`** in `mockInterviewQuestions.js` — 1-sentence opener per strength for when the interviewer asks "what are you best at?" without forcing the CliftonStrengths label.
- **Networking & Informational Interviews resource section** — top of `RESOURCES` in constants. Script, payments-adjacent target list, First Round Review reference, follow-up rhythm, placeholder slots for blogs/channels Chase will curate.

### Changed
- **Apply Tools resume type toggle** — IC/AE/PM (was PM/AE). IC is the default. Tailor prompt `rulesByType` maps IC → merchant-live implementation framing, AE → consultative inbound SaaS, PM → legacy project lifecycle.
- **Profile resume template buttons** — "🧭 Load IC / SE Template (primary)", "💼 Load AE Template (backup)", "📋 Load PM Template (legacy)".
- **Profile placeholders** — `targetRoles` → "Implementation Consultant, Sales Engineer, Solutions Consultant"; `targetIndustries` → "Payments, Fintech, Dev Tools, B2B SaaS"; `notes` → "Implementation and payments background. Strongest at merchant onboarding, integration troubleshooting, SOPs. Remote only. Targeting Implementation Consultant / Sales Engineer at payments-adjacent companies; AE at payments SaaS is the backup."
- **`JOB_SEARCH_QUERIES`** (if present) — Implementation-Consultant-led: "Implementation Consultant payments remote", "Solutions Engineer payment gateway remote", "Sales Engineer fintech implementation remote", "Technical Account Manager payments remote", "Implementation Specialist Stripe OR Adyen OR Checkout.com", "Solutions Consultant merchant onboarding remote". 2 AE queries kept as backup.

### Why
Chase re-interviewed under performance-coach framing this session. Energy signals (Implementation / Maker / Coach) point to IC/SE, not AE. Kassie's letter (2026-04-21) adds the urgency floor — direction committed in this session, not next; daily minimums non-negotiable; wins tracked so forward motion is visible to him and to her. Plan file: `~/.claude/plans/users-chase-downloads-performance-coach-toasty-steele.md`.

---

## [Unreleased] — 2026-04-20 — Wave 4 #6: PWA share target (v8.13)

### Added
- **`public/sw.js`** — minimal service worker (install + activate lifecycle); registers the app with the browser so the Web Share Target API is honored.
- **Service worker registration** in `src/index.js` — registers `/sw.js` on page load.
- **`share_target` in `public/manifest.json`** — GET action at `/` with `title`, `text`, `url` params; enables "Share to Job Search HQ" in mobile share sheets when the PWA is installed.
- **`shareTarget=1` URL-param handler in `App.jsx`** — mirrors the existing `importJob=1` pattern; opens AppModal pre-filled with the shared URL (jobUrl) and title; clears params from the URL after consuming.

---

## [Unreleased] — 2026-04-20 — Wave 4 #5: Email forward parsing (v8.12)

### Added
- **`parseRecruiterEmail(rawText)`** in `constants.js` — pure client-side regex parser; extracts name (From header + signature), sender email (prefers non-personal-provider domains), company (email domain → company name + "at Company" override), recruiter role ("I'm a X at"), job title (phrase patterns), LinkedIn URL, and ATS/job posting URL. No LLM call, runs instantly offline.
- **📧 Email Parse sub-tab** in Apply Tools — paste raw recruiter email (headers + body), click Parse, review editable extracted fields (name, email, company, role, job title, LinkedIn URL, job posting URL), then one-click "💼 Save as Contact" (opens pre-filled ContactModal → Contacts tab) or "📋 Add Application" (opens pre-filled AppModal → Pipeline tab).

### Changed
- `AITab.jsx` — added "email" to sub-tab array; new `EmailParsePanel` component (local function at bottom of file); `emailRaw` + `emailParsed` state.
- `App.jsx` — threads `setAppModal`, `setContactModal`, `setTab` to `<AITab />` so email-parse actions can open modals and navigate tabs.

---

## [Unreleased] — 2026-04-20 — Wave 4 #4: Offer comparison side-by-side (v8.11)

### Added
- **Structured offer details per application** — new `offerDetails` object on every app: `receivedDate`, `baseSalary`, `bonusTarget`, `bonusType` (target / guaranteed / discretionary), `signOnBonus`, `equity`, `equityNotes`, `ptoWeeks`, `benefitsNotes`, `startDate`, `decisionBy`, `location`, `remoteFlex`, `notes`. Backwards-compatible: `normalizeApplication` seeds a blank `offerDetails` on existing apps loaded from localStorage/Supabase.
- **`OfferModal.jsx`** — per-app offer editor (Compensation + Offer terms + Notes sections; live "Total comp estimate" preview block). Mirrors `DebriefModal.jsx` structure and opens from the card's 💰 Offer button.
- **`OfferCompareView.jsx`** — side-by-side compare table for Offer-stage apps. Empty state, single-offer card fallback, and 2+ offers responsive table with "best in column" green highlights (`#22c55e` / `#0f2b1a`) on Base, Bonus, Sign-on, Equity, PTO, and Total comp. "Edit" button per column reopens `OfferModal`.
- **`computeOfferTotal(offer)`** — annualized total = `base + bonusTarget + equity + signOnBonus/4`; returns `null` when base is missing so the UI shows `—`.
- **`getOfferCompareRows(offerApps)`** — normalized rows sorted by total desc with `null` totals last.
- **`blankOfferDetails()`**, **`normalizeOfferDetails(o)`**, **`offerDetailsHasContent(o)`**, **`formatCurrency(n)`** helpers in `src/constants.js`.

### Changed
- `blankApp()` — now includes `offerDetails: blankOfferDetails()`.
- `AppCard.jsx` — when `stage === "Offer"`, renders a 💰 Offer button after Debrief (`"💰 Offer ●"` when any details are filled).
- `PipelineTab.jsx` — new collapsible "💰 Offer comparison (N)" section above Win/Loss Analytics; auto-expands when N ≥ 2. `onOffer` threaded to both active and archived `AppCard` invocations.
- `App.jsx` — new `offerModal` state + `OfferModal` render next to `DebriefModal`; `setOfferModal` passed to `PipelineTab`.

### Docs
- `CLAUDE.md` — version bump v8.10 → v8.11; added `offerDetails` to the Data Shape block.
- Root `CLAUDE.md` — Documentation Auto-Update Rule extended with step 8 (Linear heartbeat comment) and step 9 (Shipyard sync via `pnpm --filter shipyard sync-projects`) so every modified-app session syncs external trackers, not just when Chase says "update linear".

### Notes
- Ships with same Chrome extension + Supabase sync path; `offerDetails` rides inside the existing app blob (no schema change).
- Out of scope: multi-currency / tax-adjusted comp math, editing from the compare table directly, iOS parity — follow-on tickets.

---

## [Unreleased] — 2026-04-20 — Wave 4 #3: Outreach cadence timeline (v8.10)

### Added
- **Per-contact outreach timeline** — every contact now carries an `outreachLog[]` history of touchpoints. New `src/components/OutreachTimeline.jsx` renders a compact vertical list on `ContactCard` (colored type dot + date + type label + method + notes), default 4 visible with "Show all (N)" toggle, empty state "No touchpoints yet".
- **`OUTREACH_EVENT_TYPES`** (sent/replied/meeting/intro_made/note, each with color token) and **`OUTREACH_METHODS`** (linkedin/email/phone/in_person/other) in `src/constants.js`.
- **`blankOutreachEntry()`** + **`normalizeOutreachLog()`** helpers; mirror the Wave 3 `interviewLog[]` pattern.
- **`normalizeContact()`** — new helper run in `hydrateState` that seeds a single migration entry from legacy `outreachDate` + `outreachStatus` when `outreachLog` is empty, so existing contacts show their last known touch without manual re-entry.
- **Modal entry form** in `ContactModal.jsx` — Date / Type / Method grid + Notes textarea + "+ Add entry" button; existing entries list (newest first) with delete (🗑) per row.
- **Quick-log on status change** — `updateStatus` in `ContactsTab.jsx` now appends an `outreachLog` entry whenever the card's status dropdown moves to a meaningful status (not "none", not same as previous). Method inferred from `contact.source` (default "linkedin"). One change = one log entry, no extra UI.

### Changed
- `blankContact()` — added `outreachLog: []`.
- `ContactCard.jsx` — `<OutreachTimeline />` mounted between `outreachDate` metadata and the cadence nudge warning.

### Notes
- `buildOutreachPriorityList` and `getOutreachCadenceNudge` continue to read the `outreachDate` / `outreachStatus` rollups — both are maintained on every quick-action, so day-3/day-7 nudges and Focus-tab ordering are unchanged. Future pass can make them read from `outreachLog[last]` once useful.

---

## [Unreleased] — 2026-04-18 — Wave 4 #2: Draft Message context (v8.9)

### Added
- **Apply Tools "Draft Message" context** — clicking "✍️ Draft Message" on any ContactCard now navigates directly to Apply Tools → LinkedIn → Connection Request with that contact pre-selected. No more manually hunting for the contact after switching tabs.
- `draftContact` state in `App.jsx`; `onDraftMessage(contact)` prop on `ContactsTab`; `useEffect` in `AITab` that fires on `draftContact`, sets sub-tabs (`linkedin` / `connect`), and pre-selects the contact via `setConnectContact`.

---

## [Unreleased] — 2026-04-18 — Wave 4 #1: Weekly Review + normalizeApplication fix (v8.8)

### Added
- **Weekly Review tab** in Apply Tools (`AITab.jsx`) — new "📊 Weekly Review" sub-tab; `WeeklyReviewPanel` component shows stat cards (apps submitted / interviews logged / contacts touched / active pipeline, all scoped to last 7 days), pipeline snapshot by stage, and a "Copy weekly review prompt" button.
- **`buildWeeklyReviewPrompt(data)`** in `src/applyPrompts.js` — builds a markdown coaching brief pre-filled with real pipeline data (stage breakdown, active roles, this-week stats, debrief summaries, contacts outreached); paste into ChatGPT or Claude for a weekly coaching review.

### Fixed
- **`normalizeApplication`** (`src/constants.js`) — added `interviewLog: normalizeInterviewLog(app.interviewLog)` so apps loaded from localStorage/Supabase have their debrief log fully hydrated on startup, consistent with how `prepSections` is handled.

### Docs
- `ROADMAP.md` — Wave 3 items (debrief, velocity, mock interview) checked off with v8.7 notes; Wave 3 Complete section added; app status updated to v8.7.
- `CLAUDE.md` — version bumped v8.6 → v8.7.

---

## [Unreleased] — 2026-04-18 — Wave 3: Logo + Debrief + Velocity + Mock Interview (v8.7)

### Logo redesign
- **Outline logo** — `public/logo.svg` and `public/favicon.svg` updated to deep blue (`#1d4ed8`) background with white stroke-only "HQ" lettering (fill: none, stroke: #ffffff). Clean at all sizes; matches portfolio bright-bg standard.
- Two HTML mockup files generated for design review before committing: `design/logo-mockup.html` (11 color/gradient options) and `design/logo-mockup-2.html` (style variants: solid/outline/gradient/shadow).
- iOS `tools/generate_brand_assets.py` updated: `BG = (0x1D, 0x4E, 0xD8)`, `BAND = (0x1E, 0x40, 0xAF)`; outline effect rendered via `fill=BG + stroke_fill=WHITE` (Pillow doesn't support fill="none" natively).

### Post-interview debrief log (A1)
- Added `interviewLog: []` to `blankApp()` in `src/constants.js`.
- New constants: `DEBRIEF_ROUND_TYPES` (phone_screen / technical / on_site / panel / final / other), `DEBRIEF_IMPRESSIONS` (positive/neutral/negative with color tokens).
- New helpers: `blankDebriefEntry()`, `normalizeInterviewLog()`.
- New `src/components/DebriefModal.jsx` — per-round entry form (date, interviewer, round type, impression buttons, confidence 1–5, strengths/gaps/redFlags/keyQuestions/notes); entry history with inline edit + delete; saves on each action via `onSave`.
- `AppCard.jsx` updated: "📋 Debrief" button added; shows count badge when entries exist.
- `App.jsx` wired: `debriefModal` state, `setDebriefModal` passed to `PipelineTab`, `DebriefModal` rendered.
- `PipelineTab.jsx` updated: `setDebriefModal` prop + `onDebrief` on both active and archived AppCards.

### Weekly velocity dashboard (A2)
- Added `weeklyTarget: 5` to default `profile` object in `src/constants.js`.
- New helper: `getWeeklyVelocityData(applications, weeksBack=8)` — Monday-aligned ISO weeks, current week flagged.
- `FocusTab.jsx` updated: new `VelocityDashboard` component — inline SVG bar chart (8 bars), dashed target line, current week highlight, editable weekly target (calls `saveProfile`), stats row (this wk/target, 4-wk avg, best).
- `App.jsx` updated: `profile` + `saveProfile` threaded to `FocusTab`.

### Mock interview mode (A3)
- New `src/mockInterviewQuestions.js` — `MOCK_INTERVIEW_SCENARIOS` (5 scenarios: Behavioral/STAR, Situational, Implementation/CS, Payments Domain, Role Fit); 6–7 questions each.
- `AITab.jsx` updated: new "🎤 Mock Interview" sub-tab; `MockInterviewPanel` component — scenario selector, question card, answer textarea, copy-feedback-prompt button, next/restart, session log with completed Q&A.

### Removed / changed (v8.6)

- **In-browser Anthropic API removed** — no `callClaude`, no API key modal, no `fetch` to `api.anthropic.com`. Apply Tools (`AITab.jsx`) uses **copy-to-clipboard prompts** (`src/applyPrompts.js`) for external assistants; users paste results back into text areas for their records.
- **Interview prep modal** — stage presets (Phone screen / Interview / Final round), "Fill empty fields from template", "Copy external prep brief"; optional `prepStageKey` on applications. iOS `JobApplication` includes `prepStageKey` for JSON parity.
- **Pipeline quick-add** — URL + optional JD textarea (replaces URL-only Claude parse).
- **Find Jobs** — opens LinkedIn / Indeed / Google search in a new tab (no in-app search API).
- Legacy `apiKey` field stripped from saved blob on load if present.

### Updated (2026-04-14)
- **Logo: "JOB SEARCH" spelled out** — updated `public/logo.svg` label from "JOB" to "JOB SEARCH" (font-size 50, letter-spacing 6); bold white "HQ" remains the dominant anchor; `rx="96"` rounded corners per portfolio template. Regenerated `logo512.png`, `logo192.png`, `apple-touch-icon.png`. Verified live at [job-search-hq.vercel.app](https://job-search-hq.vercel.app) (HTTP 200) and `npm run build` clean on Node 20.

### Added (2026-04-15)

- **iOS companion (v0.1 scaffold):** new Xcode project at `../job-search-hq-ios/` — SwiftUI + ClarityUI, web-shaped `Codable` blob, Focus / Pipeline / Contacts / More tabs; see that folder’s `README.md` and `docs/SYNC_PHASE2.md` for Phase 2 sync.
- **iOS companion — brand + device QA:** reproducible `AppIcon` / `Logo` via `../job-search-hq-ios/tools/generate_brand_assets.py`; Debug build + `xcrun devicectl device install app` verified on physical iPhone (see iOS `HANDOFF.md` / `README.md`). **Linear:** track under [Job Search HQ](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d).

### Added (2026-04-14)
- **Cross-app navigation (WHI-40):** `AppNav` bar below header links to Wellness and Clarity Hub — uses shared `resolveAppUrl` for canonical-origin URL resolution
- **Shared UI component:** added `src/shared/ui.jsx` (copy of `portfolio/shared/ui.jsx`) — `Card`, `NavTabs`, `AppNav`, `resolveAppUrl`
- **Shared sync.js update:** synced `src/shared/sync.js` to canonical (comment-only drift fix)
- **Shared auth bootstrap:** added `src/shared/auth.js` — canonical-host redirect (`apps.chasewhittaker.com/job-search`), session key consolidation, OTP `emailRedirectTo`
- **Refactored sync:** `src/shared/sync.js` + `src/sync.js` export app identity + `emailRedirectTo`; `App.jsx` uses shared `emailRedirectTo`
- **Auth diagnostics:** `REACT_APP_AUTH_DEBUG` flag enables `local_mode_no_auth`, `initial_session`, `state_change` events
- **Env template:** `.env.example` updated with `REACT_APP_AUTH_CANONICAL_ORIGIN` and `REACT_APP_AUTH_APP_PATH`
- **Supabase / Vercel:** Site URL + redirect allowlist set to canonical origin; auth env vars set in Vercel production

### Fixed (2026-04-14)
- **Favicon/logo white corners:** removed `rx` rounded corners from `favicon.svg` and `logo.svg`; regenerated `logo192.png`, `logo512.png`, `apple-touch-icon.png`; regenerated `favicon.ico` — solid `#0f1117` fill covers full square

### Planning / readiness
- Added a Wave 3 execution sequence in `ROADMAP.md`: prep templates → debrief log → velocity dashboard → mock interview mode.
- Added a release-readiness dependency checklist in `ROADMAP.md` and `HANDOFF.md` (OTP template, Vercel root/env, Node 20 lockfile/CI discipline, LinkedIn DOM dependency note for extension).
- Updated `HANDOFF.md` State with a readiness checkpoint confirming **go** for current v8.5 shipped scope and no active code-level blockers.

### Documentation
- Synced Job Search HQ and portfolio docs with v8.5 shipped scope: `CLAUDE.md`, `README.md`, `AGENTS.md`, `HANDOFF.md`, `PROJECT_INSTRUCTIONS.md`, `MASTER_PROJECT_FRAMEWORK.md`, `MVP-AUDIT.md`, `docs/ARCHITECTURE.md`, `docs/LEARNING.md`, `docs/templates/SESSION_START_JOB_SEARCH_*.md`, root `CLAUDE.md` / `ROADMAP.md` app table; `APP_META` version comment in `src/App.jsx`.

### Chrome extension — Wave 3 #1 (MVP)
- Added `extension/` — Manifest V3 package: popup actions to import **LinkedIn profile → new contact** and **LinkedIn job → new application** (opens Job Search HQ with `importContact` / `importJob` query or `#importJob=` JSON for long JDs).
- Added `extension/background.js` with page scrapers injected via `chrome.scripting.executeScript`; optional app origin stored in `chrome.storage.local` (`hqOrigin`) for local dev (`http://localhost:3001`).
- Added `extension/content-jobhq-bridge.js` — on HQ tab only, recomputes Focus **Action Queue** count and sets toolbar badge via `chrome.action.setBadgeText` (poll + `storage` listener).
- **App:** URL imports (`importContact`, `importJob`, `#importJob=`) now run **after auth session is ready** so modals appear when logged in; `source=chrome_extension` supported.
- **ContactModal:** new source chip **Chrome ext**.
- **ResourcesTab:** short pointer to `extension/README.md`.
- **Docs:** `CLAUDE.md` file tree lists `extension/` (see also Documentation entry above).
- Verified: `npm run build` (compiled successfully).

### Pipeline — Wave 2 #6: win/loss analytics
- Added `getOutcomeAnalytics(applications)` helper in `src/constants.js` to compute closed-outcome totals and percentages for Offer / Rejected / Withdrawn stages.
- Added Pipeline analytics section in `src/tabs/PipelineTab.jsx` with horizontal bar chart rows for final-stage outcomes.
- Added lightweight analytics style tokens in `src/constants.js` for consistent dark-theme rendering.
- Test verification:
  - `npm run build` (compiled successfully)
  - `npm test -- --watchAll=false --passWithNoTests` (no tests found, exits 0)

### AI Tools — Wave 2 #5: STAR story bank
- Added STAR story bank data model in `src/constants.js` (`starStories`) with helper utilities: `blankStarStory()`, `normalizeStarStories()`, and competency presets.
- Added `saveStarStories()` flow in `src/App.jsx` and threaded it into `AITab`.
- Added new `⭐ STAR Bank` sub-tab in `src/tabs/AITab.jsx` with CRUD for reusable STAR stories (title, competency, situation, task, action, result, takeaway).
- Added AI-assisted STAR drafting from resume/profile context using JSON output parsing into story fields.
- Added copy-ready STAR export per saved story for interview prep reuse.
- Test verification:
  - `npm run build` (compiled successfully)
  - `npm test -- --watchAll=false --passWithNoTests` (no tests found, exits 0)

### Interview Prep — Wave 2 #4: structured prep framework
- Added sectioned prep model in `src/constants.js`: `prepSections` with four fields (`companyResearch`, `roleAnalysis`, `starStories`, `questionsToAsk`) plus helpers for normalization, content checks, and copy formatting.
- Added backwards compatibility migration helpers so legacy `prepNotes` values hydrate into the new structured model without data loss.
- Updated `runInterviewPrep` in `src/App.jsx` to request structured JSON output from Claude and save to `app.prepSections` (legacy `prepNotes` cleared on save).
- Updated `PrepModal` to render editable sectioned fields with `Save Sections`, `Regenerate`, and `Copy all` actions.
- Updated prep status checks in `FocusTab` and `AppCard` to use structured prep helpers instead of freeform `prepNotes`.
- Build verification: `npm run build` (clean compile).

### Contacts — Wave 2 #3: cadence nudges
- Added `getOutreachCadenceNudge(contact, linkedApp)` helper in `src/constants.js` for day 3/day 7 follow-up recommendations based on `outreachStatus: "sent"` and `outreachDate`.
- Updated `ContactCard` to show a contextual cadence banner when follow-up is due, including stage-aware message context when a linked app exists.
- Added **Copy Follow-up Prompt** action to cadence nudges so outreach copy can be generated quickly in AI tools.
- Threaded `showError` through `App.jsx` → `ContactsTab.jsx` → `ContactCard.jsx` for clipboard failure handling.
- Build verification: `npm run build` (clean compile).

### FocusTab — Wave 2 #2: Who to message today
- Added `buildOutreachPriorityList()` in `src/constants.js` to rank contact outreach by status recency, linked active application stage, next-step urgency, hiring signals, and stale touchpoints.
- Added a new "Who should I message today?" widget in `src/tabs/FocusTab.jsx` with deterministic priority ordering, reason/context metadata, and empty-state guidance.
- Added quick actions per ranked contact: **Copy Prompt**, **Edit Contact**, and **Open App** (when a linked active application exists).
- Threaded `setContactModal` and `showError` into FocusTab from `src/App.jsx` to support contact editing and clipboard-failure feedback without new persistent state.
- Build verification: `npm run build` (clean compile).

### Docs
- **`CLAUDE.md`:** CI section — GitHub Actions (`portfolio-web-build.yml`), Node 20, lockfile parity; link to **`docs/templates/SESSION_START_FIX_CI_LOCKFILES.md`**

### Chore
- **Theme alignment:** updated surface color `#1a1f2e` / `#111827` → `#161b27` across `constants.js`, `App.jsx`, and `ContactsTab.jsx` to match shared portfolio BASE token set (see `docs/design/PORTFOLIO_WEB_THEME_HANDOFF.md`)

## [Unreleased] — 2026-04-13 — Company intel view (Wave 2 #1)

### ContactsTab — By Company view
- **View toggle:** "List" | "By Company" buttons above the contact list; default is List (no behavior change on load)
- **Company rows:** group all contacts by `contact.company` (case-insensitive); each row shows company name, contact count + types, replied count
- **Expand/collapse:** click a company row to reveal its ContactCards (same component as list view)
- **Warm lead badge:** if a company has contacts but no active application → amber "Not applied — warm lead!" badge; clicking it opens AppModal pre-filled with the company name
- **Ghost rows:** if an active application has zero contacts at that company → muted dashed row "0 contacts at [company] — find someone ↗" with LinkedIn search link and stage pill
- **Sort order:** warm leads first, then by contact count desc, "Unknown company" last
- **No data changes:** purely computed from existing `contact.company` + `application.company` fields
- New style tokens in `s`: `ciToggleRow`, `ciToggleBtn`, `ciToggleBtnActive`, `ciRow`, `ciRowHeader`, `ciCompanyName`, `ciMeta`, `ciStagePill`, `ciWarmBadge`, `ciGhostRow`, `ciCards`
- `setAppModal` prop threaded from App.jsx to ContactsTab

## v8.4 — 2026-04-12 — Sales Navigator networking upgrade + accessibility

### Sales Navigator integration
- **Bookmarklet:** JavaScript bookmarklet that runs on a Sales Navigator (or regular LinkedIn) profile page — scrapes name, title, company, LinkedIn URL, company size, industry, and hiring signals, then opens the app with everything pre-filled via URL params
- **In-app import flow:** `App.jsx` detects `?importContact=1&...` params on load, pre-fills a new ContactModal with `source: "sales_navigator"`, and cleans the URL so refresh doesn't re-trigger
- **Setup guide:** Collapsible `SalesNavGuide` component in ContactsTab with 6-step bookmarklet install instructions, copyable code block, and tips section

### Enhanced contact model (backwards-compatible)
- New fields added to `blankContact()` with safe defaults: `type` (hiring_manager / recruiter / alumni / other), `outreachStatus` (none / sent / replied / meeting / intro_made), `outreachDate`, `source`, `companySize`, `industry`, `isHiring`
- New constants: `CONTACT_TYPES` and `OUTREACH_STATUSES` arrays with value / label / color
- Existing contacts display correctly with "Other" type and "No Outreach" defaults

### ContactCard improvements
- Color-coded contact type badge next to name
- Outreach status badge in top-right
- Company intel row (industry, size, hiring indicator) when data exists
- Quick-action row: status dropdown (inline update without opening modal) + "Draft Message" button (navigates to AI tab)

### ContactModal improvements
- Contact type chip selector
- Outreach status chip selector
- Outreach date + source (Sales Nav / LinkedIn / Referral / Other) row
- Company Intel section: company size, industry, "currently hiring" checkbox
- App-linking stays at bottom

### ContactsTab improvements
- Stats bar with 5 metrics: total contacts, outreach sent, response rate %, active in 7 days, meetings
- Filter chips for contact type and outreach status (toggle to deactivate)
- Inline status updates via `saveContact` (no modal required)

### Accessibility
- Tips section in SalesNavGuide: changed from near-invisible `#92400e` on `#1c1a0a` to high-contrast `#e5e7eb` on `#1f2937`
- All text in SalesNavGuide bumped from 11–12px to 13–14px; high-contrast colors throughout (`#f3f4f6`, `#d1d5db`, `#e5e7eb`)

### Vercel / infra
- Fixed Vercel deployment: project was connected to wrong GitHub repo (standalone `job-search-hq` instead of monorepo `apps`). Corrected via Vercel REST API — unlinked old repo, set root directory to `portfolio/job-search-hq`, linked to monorepo `iamchasewhittaker/apps`

### ESLint workaround
- Bookmarklet `javascript:` string uses runtime variable interpolation (`const _bm_proto = "javascript"`) to satisfy both `no-script-url` and `no-useless-concat` rules in CI

## v8.3 — 2026-04-03 — Email OTP login (match Wellness / iPhone PWA)

- **Sign-in:** same flow as Wellness Tracker — `signInWithOtp` + `auth.verifyOtp({ type: 'email' })` so the session persists in the home-screen Web app’s `localStorage`
- **Login UI:** code entry step, resend cooldown, change email; shared Supabase project — one account still covers both apps
- **Supabase (dashboard):** same as Wellness — **Magic link** email template must include `{{ .Token }}` for in-app OTP (see Wellness `CLAUDE.md`)
- **Docs / UX:** `CLAUDE.md` cross-ref; login screen hint for link-only emails; portfolio docs updated
- **Chore:** `.claude/launch.json` (port 3001); `.gitignore` keeps only `launch.json` under `.claude/`

## [Unreleased]

- **Monorepo:** path `portfolio/job-search-hq`; README, ROADMAP, AGENTS, `docs/*`; Linear links; master doc path updates.

## v8.5 — 2026-04-13 — Recruiter Wave 1: Action Queue, Next Step Dates, URL Capture, Scenario Chips + Logo

### Logo / branding
- New "JOB / HQ" logo mark: dark rounded square, small blue "JOB" label above bold white "HQ", replacing default React logo
- `public/logo.svg` + `public/favicon.svg` (SVG favicons for crisp rendering at all sizes)
- `public/logo512.png` + `public/logo192.png` regenerated; `index.html` updated to prefer SVG favicon with ICO fallback

### Action Queue (Focus tab)
- Auto-generated priority list at the top of Focus tab, pulling from: overdue/due-today next step dates, active interview stages with no prep notes, contacts who replied (needs response), sent outreach with no reply in 5+ days, applied 14+ days with no response
- Each item shows a colored urgency badge (red = overdue, orange = due today/reply, blue = interview prep needed) and a one-click action button that opens the correct modal or navigates to the right tab
- "All caught up" state shown when queue is empty

### Next Step Dates + Types (Pipeline)
- `nextStepDate` and `nextStepType` fields added to application data model (`blankApp()`)
- `NEXT_STEP_TYPES` enum: Apply, Follow Up, Interview Prep, Send Materials, Thank You Note, Negotiate, Other
- `nextStepUrgency()` helper computes color/label from due date
- AppModal: new "Due Date" + "Step Type" fields below Next Step text
- AppCard: urgency badge (Overdue/Due Today/In Xd) appears next to next step text when a due date is set
- Existing apps load without breaking — new fields default to empty string

### URL Paste Quick-Capture (Pipeline)
- Paste any job posting URL → AI extracts title, company, and full JD text → pre-fills the new application modal
- Only shown when API key is configured
- Uses `callClaude` with 2000 token limit; graceful fallback if parsing fails (opens modal with URL pre-filled)
- Enter key triggers parse

### Outreach Scenario Chips (AI Tools tab)
- Connection Request: 4 scenario chips (Cold Outreach, Post-Application, Alumni/Mutual, Recruiter) — click to fill context textarea
- Follow-up: 4 scenario chips (No Reply, Post-Interview, After Rejection, Reconnect)
- Active chip highlighted in blue; user can still edit the textarea after selecting
- Chips export as `CONNECT_SCENARIOS` + `FOLLOWUP_SCENARIOS` constants

## v8.2 — 2026-03-24 — Auth fix: wrong Supabase project

- **Fixed:** `.env` was pointing to a separate Supabase project (`uwlfhxzeeleebjpiimrg`) instead of the shared wellness project — magic links were redirecting to `wellness-tracker.vercel.app` because that project's Site URL was set to the wellness URL
- **Fixed:** Updated `.env` to use wellness Supabase project credentials (`unqtnnxlltiadzbqpyhh`) — both apps now share one project; one magic-link session covers both
- **Fixed:** Added `https://job-search-hq.vercel.app`, `http://localhost:3000`, `http://localhost:3001` to the shared Supabase project's redirect URL allowlist
- **Fixed:** `.env.example` had wrong `VITE_` prefix — corrected to `REACT_APP_` (this is CRA, not Vite)

## v8.1 — 2026-03-24 — Supabase sync live

- Wired Supabase sync using same pattern as Wellness Tracker
- Created `src/sync.js` (APP_KEY = `'job-search'`, `REACT_APP_*` env vars, offline-first fallback)
- Copied `shared/sync.js` as `src/shared/sync.js` — real file copy, not symlink (symlinks break on Vercel since only the app repo is cloned)
- `push()` wired into save useEffect with `_syncAt` stamp; `pull()` wired into load useEffect
- Magic-link auth gate added (same `LoginScreen` pattern as Wellness)
- Same Supabase project as Wellness Tracker — data separated by `app_key = 'job-search'` in shared `user_data` table
- Anthropic API key remains in `localStorage` only — never synced
- Fallback: if `.env` missing, app runs in localStorage-only mode (no crash)

## v8 — Hardening: error handling, error boundaries, restore UI, API key safety

### Task 5 — API key safety
- Updated ApiKeyModal security notice: "Your key is stored locally on this device only and sent directly to Anthropic. It never passes through any server. Do not use this app on shared computers."
- Added migration on load: if API key is found in `chase_job_search_v1` (old location), it is automatically moved to `chase_anthropic_key` and removed from the main data store

### Task 6 — Error handling for Claude API calls
- `callClaude()` now catches network failures and throws `NETWORK_ERROR`, checks HTTP 401 → `AUTH_ERROR`, HTTP 529 → `OVERLOADED` before parsing JSON
- `handleClaudeCall()` routes each error type to a specific user message
- `searchJobs()` updated with the same network/401/529 handling
- Added `showError(msg)` helper that sets a fixed-position red error toast that auto-dismisses after 6 seconds
- Error messages: network error, overloaded (30s retry), 401 clears key + opens ApiKeyModal, other errors show the message from `json.error.message`

### Task 7 — Error boundaries
- Added `ErrorBoundary` class component (same pattern as Wellness Tracker, dark theme)
- Wraps each of the 5 main tabs: Daily Focus, Pipeline, Contacts, AI Tools, Resources
- Shows error message + "Try again" button without crashing the whole app

### Task 8 — Backup restore UI
- Added `restoreData()` function: opens a file picker, parses JSON, validates `{ applications: [] }` shape, `window.confirm()` guard, then writes to localStorage and reloads
- Restore button added next to backup button in Resources tab → Data Backup section
- Button styled in secondary (dark) style to visually distinguish from the backup action

## v7 — Data Backup
- Added 💾 Data Backup block to the Resources tab
- Chrome/Mac: first tap picks a folder (e.g. iCloud "Job Search Backups") — saves there automatically on future taps
- Safari/iPhone: falls back to standard file download
- Saves as job-search-backup-YYYY-MM-DD.json — one dated file per backup, nothing overwritten
- "Change backup folder" link to reset the saved destination
- BACKUP_FOLDER_KEY constant added at top of file (chase_job_search_backup_folder)

## v6 — Interview Prep
- Added 🎯 Prep button on pipeline cards in Phone Screen, Interview, and Final Round stages
- Clicking Prep opens a modal that generates 5 interview questions with talking points
  - Behavioral (STAR format), role-specific/technical sales, company fit, and compensation question types
  - Talking points anchored to real Authorize.Net experience, 98% resolution rate, KPI overachievement
  - If JD is saved on the card, questions are tailored to that specific role
  - If no JD saved, generates based on role title + Chase's background with a warning shown
- Results saved to app.prepNotes — persists in localStorage, viewable anytime without regenerating
- "✓ Interview prep saved" indicator appears on card after first generation
- Regenerate button available inside modal after first generation
- Uses maxTokens: 1500 for full 5-question output

## v5 — 2026-03-23
- Connected to Wellness Tracker (chase_wellness_v1 integration)
  - Added logSessionToWellness() — writes job search session to wellness growthLogs
  - "✓ Done + Log to Wellness" button on every Daily Focus block
  - Minutes auto-estimated per block type (apply=40, research=20, network=20, followup=15, skills=25)
  - Green toast confirmation after logging: "✓ Session logged to Wellness Tracker"
  - WELLNESS_KEY constant references chase_wellness_v1 — must never change
- Added ← Wellness back-link in header pointing to wellness-tracker.vercel.app

## v4 — 2026-03-23
- Deployed to Vercel at job-search-hq.vercel.app
- Added vercel.json for cache busting
- Added public/index.html with no-cache meta tags and PWA meta tags
- Git repo created at github.com/iamchasewhittaker/job-search-hq

## v3 — 2026-03-23
- Added Daily Focus tab (🎯) with 5 ADHD-friendly work blocks
  - Research block (20 min), Application block (30-45 min), Networking block (15-20 min)
  - Follow-up block (15 min), Skill building block (20-30 min)
  - Each block has step-by-step guide + ADHD tip + Mark done toggle
  - Weekly rhythm grid (Mon-Sun)
- Added Resources tab (📚)
  - Certifications: Asana Academy, HubSpot, Google PM Certificate, Jira, Salesforce Trailhead
  - LinkedIn quick wins: Open to Work, About section update
  - Job search ground rules (cap active apps, follow up at 7 days, lead with Authorize.Net, etc.)

## v2 — 2026-03-23
- Added AI Tools tab (✨) with 5 sub-tabs
  - Tailor Resume: PM track (Implementation/CS) and AE track (inbound Account Executive)
  - Cover Letter: 3-paragraph, human-sounding, anchored to Authorize.Net results
  - Apply Kit: one-click tailored resume + cover letter from saved application
  - Find Jobs: web search via Claude API + web_search_20250305 tool
  - LinkedIn: headline + About rewrite, keyword optimizer, connection request, follow-up message
- PM/AE resume type toggle persists across sub-tabs
- Quick-fill JD from saved applications
- Anti-AI writing rules baked into all prompts (no buzzwords, plain verbs only)
- CHASE_CONTEXT and RESUME_TEMPLATE_PM / RESUME_TEMPLATE_AE constants

## v1 — 2026-03-23
- Initial build
- Pipeline tab: application cards with stage badges, stage summary bar, archived collapse
  - Stages: Interested, Applied, Phone Screen, Interview, Final Round, Offer, Rejected, Withdrawn
  - Per-card: company, role, applied date, next step, linked contacts, Apply Kit shortcut
- Contacts tab: recruiter/HM cards linked to applications by appIds array
- Master profile modal: name, email, phone, LinkedIn, location, target roles/industries, achievements, salary target
- Base resume stored in localStorage (two templates: PM track and AE track)
- Anthropic API key stored separately in chase_anthropic_key
- Storage key: chase_job_search_v1
- Dark theme locked
