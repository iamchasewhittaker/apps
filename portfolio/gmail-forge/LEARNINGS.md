# Gmail Forge — Learnings

> Gotchas, fixes, and non-obvious decisions. Read at session start.

---

## Job Search HQ uses `labelIds=`, not sender search (Apr 28, 2026)

**What:** JSHQ's InboxPanel calls Gmail API with `labelIds=<JobSearch label id>` ([gmailClient.js:43](../job-search-hq/src/inbox/gmailClient.js)), not a `q:` search. If an email isn't tagged `JobSearch`, JSHQ literally can't see it — no fallback, no sender match.

**Why this matters:** It's tempting to think "we whitelisted greenhouse.io, that's enough." It's not. The whitelist (`shouldNeverSpam=true` in XML) doesn't apply a label. The label only gets applied by `auto-sort.gs` matching the JobSearch rule in `rules.gs`. Both pieces must be in sync, or JSHQ's inbox feed shows zero emails.

**Bonus gap:** Recruiters using personal Gmail (no ATS domain) match no rule. Subject-pattern matching (`subjectPatterns: [/\binterview\b/i, ...]`) added to `rules.gs` to catch them. The matcher was domain/address/toAlias only — extending the schema cost about 10 lines in `auto-sort.gs` `matchRules_()`.

**Diagnose:** Run `healthCheck_jobSearch_()` in the Apps Script editor — logs trigger, label, JobSearch thread count, sample unlabeled inbox.

---

## Gemini prompt was missing `JobSearch` (Apr 28, 2026)

**What:** `auto-sort.gs` `VALID_LABELS` listed `JobSearch` as label index 0, but the Gemini system prompt at the top of `classifyWithGemini_()` only listed 9 labels (no JobSearch). When an unknown sender sent an interview invite, AI classification couldn't return JobSearch even if it wanted to.

**Fix:** Added `JobSearch` to the prompt with a description (ATS platforms, recruiter outreach, interview invites). Added `jobsearch`, `job search`, `job-search` aliases to `normalizeLabel_()` so any common AI variant maps back to the canonical `JobSearch` label name.

---

## macOS case-insensitive filesystem: CLAUDE.md == claude.md

**What happened:** Wrote CLAUDE.md via Bash heredoc while claude.md already existed. macOS treated them as the same file and overwrote the original handoff doc.

**Fix:** On macOS, pick one casing and stick to it. This project uses `claude.md` (lowercase) as the combined CLAUDE.md + handoff doc. Don't create a separate CLAUDE.md — it will collide.

---

## Gmail labels must exist BEFORE importing filters

**Rule:** If `gmail-filters.xml` references a label (e.g., "Security") that doesn't exist in Gmail yet, the import will silently fail to apply that label. Always create labels manually in Gmail first.

**Affected labels to pre-create:** Newsletter, Notification, Receipt, Calendar, Cold Email, FYI, Marketing, Follow-up, To Reply, Actioned, Personal, Security

---

## LinkedIn Messages: don't archive during job search

**Decision:** `messages-noreply@linkedin.com` has `shouldArchive` removed. Recruiter DMs land at this address — archiving them would bury job search leads.

**When job search ends:** Consider re-adding `shouldArchive: true` to keep inbox clean.

---

## ZipRecruiter: domain-level, not address-level

**Problem:** Original filter was `jobalerts@ziprecruiter.com`. Human recruiters (e.g., phil@ziprecruiter.com) and other ZipRecruiter addresses were not caught.

**Fix:** Upgraded to domain-level `ziprecruiter.com` whitelist. All ZipRecruiter addresses now stay in inbox and are never spammed.

---

## Daily report includes all emails (read + unread)

**Preference:** Chase wants both read and unread emails in the daily report — not just unread. Don't add `is:unread` to the Gmail search query.

---

## Reclassifications require confirmed evidence

**Rule:** Do not change Newsletter vs Cold Email filters based on hunches. Track candidate senders in `roadmap/mislabel-audit.md`, then reclassify only after confirming sender pattern from daily report evidence.

**Why:** Keeps `gmail-filters.xml` stable and avoids accidental over-filtering.

---

## Amazon: Notification, not Receipt

**Decision:** `amazon.com` is filtered as Notification (not Receipt) because it catches orders, shipping, AND account alerts. Spend Clarity can isolate receipt emails using `from:amazon.com label:Notification subject:(order OR shipped)`.

---

## Apps Script: keep XML filters as Layer 1

**Decision:** Don't remove the 69 Gmail XML filters when adding the Apps Script. XML filters are server-side and instant (zero latency). The Apps Script is a 5-minute sweep that catches what slips through. Both layers complement each other — the Apps Script is a safety net, not a replacement.

---

## Apps Script: GEMINI_API_KEY goes in Script Properties, not code

**Rule:** Never hardcode API keys in `.gs` files. Use `PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY')`. Script Properties are encrypted at rest and not visible in the code editor to collaborators.

---

## Keep a no-AI fallback mode available

**Decision:** Keep Route A available permanently with `CLASSIFIER_MODE=RULES_ONLY`. This lets Gmail Forge run with deterministic rules + sender logging even when API keys are missing, budgets are paused, or model output quality is in question.

---

## Chrome MV3: service workers have no DOM

**Gotcha:** The background script in Manifest V3 runs as a service worker. No `document`, no `window`, no `localStorage`. Use `chrome.storage.sync` for settings and message passing to communicate with the content script.

---

## Gmail label search: hyphens replace spaces

**Rule:** When searching by label in Gmail, spaces in label names become hyphens. `label:Cold Email` → `label:Cold-Email`. The Apps Script search query and Chrome extension tab queries must use hyphenated versions.

---

## Gemini free tier: limit: 0 when billing project exists

**What happened:** `testRun()` in GEMINI mode hit quota errors on every call with `limit: 0` for the free tier. This means the GCP project tied to the API key has billing enabled, which zeroes out the free tier quota. Pay-as-you-go must be configured to use it.

**Fix options:** (A) Switch `CLASSIFIER_MODE` to `RULES_ONLY` — deterministic, free, works immediately. (B) Enable pay-as-you-go on the GCP project; Gemini Flash is ~$0.075/1M tokens (pennies/month for inbox volume).

**Current state:** Running `RULES_ONLY`. Switch back to `GEMINI` in Script Properties once billing is active.

---

## Apps Script: function dropdown is between Debug button and Run button

**Gotcha:** The Apps Script editor toolbar shows a function name dropdown (not obviously labeled) between the Debug and Run buttons. You must select the target function there before clicking Run — clicking Run without changing it runs whatever function was last selected.

---

## Apps Script: setupTrigger() is idempotent

**Behavior:** `setupTrigger()` checks for an existing `autoSort` trigger before creating one. If a trigger already exists (from a prior session), it logs "Trigger already exists — skipping" and exits cleanly. Safe to run multiple times.

---

## Review Queue: tab is auto-created on first write, not on setup

**Gotcha:** The "Review Queue" sheet tab doesn't exist until the first unknown sender is logged. If the tab is missing, it just means all swept emails matched existing rules — not a bug. The tab appears automatically on the next unmatched sender.

---

## macOS git mv: tracked files keep history; untracked don't auto-follow

**What happened:** `git mv portfolio/inbox-zero portfolio/gmail-forge` successfully tracked the rename in git. However the two `package-lock.json` files still contained `inbox-zero` in their `name` fields — those are regenerated on `npm install`, not worth editing manually.

**Rule:** After a `git mv` rename, run a grep for the old name (excluding `node_modules`, `.git`, `package-lock.json`) to find all stale text references that need manual updates.

---

## Daily report "all emails" ≠ all emails received

**What happened:** The original report prompt searched `after:YYYY/MM/DD` without `in:inbox`, which sounds like "all mail" but Gmail's default search scope still prioritizes inbox. Archived emails were invisible.

**Fix:** Explicitly split into two searches: `after:YYYY/MM/DD in:inbox` and `after:YYYY/MM/DD -in:inbox -in:sent -in:drafts -in:trash -in:spam`. The second query surfaces exactly what the Apps Script auto-archived.

---

## Renaming a project: downstream impact is bigger than it looks

**What happened:** Renaming "Inbox Zero" to "Gmail Forge" touched 48 files across 6 projects (gmail-forge itself, spend-radar, spend-clarity, job-search-hq, funded-ios, portfolio root). Env var keys also needed renaming in two Apps Script files.

**Rule:** Before renaming anything with downstream consumers, run `rg -i "old-name" ~/Developer/chase --glob '!**/node_modules/**' --glob '!**/.git/**'` first to scope the blast radius. Then batch with parallel agents by ownership zone (own-project / root-docs / downstream).

---

## Google-side setup steps (reference for future sessions)

Complete sequence for a fresh Apps Script deployment:
1. Push `.gs` files via `cd apps-script && npx clasp push --force`
2. Open editor: `cd apps-script && npx clasp open`
3. In editor → ⚙️ Project Settings → Script Properties → add: `CLASSIFIER_MODE`, `GEMINI_API_KEY`, `SHEET_ID`, `NEWSLETTER_TO_ALIASES`
4. Function dropdown → `setupTrigger` → Run (accepts Gmail OAuth on first run)
5. Function dropdown → `healthCheck` → Run (verify all green)
6. Function dropdown → `testRun` → Run (live sweep; check Execution log for errors)
7. Check Google Sheet for "New Senders" tab (GEMINI mode) or "Review Queue" tab (RULES_ONLY mode)
