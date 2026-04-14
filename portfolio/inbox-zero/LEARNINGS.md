# Inbox Zero — Learnings

> Gotchas, fixes, and non-obvious decisions. Read at session start.

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

**Decision:** Keep Route A available permanently with `CLASSIFIER_MODE=RULES_ONLY`. This lets Inbox Zero run with deterministic rules + sender logging even when API keys are missing, budgets are paused, or model output quality is in question.

---

## Chrome MV3: service workers have no DOM

**Gotcha:** The background script in Manifest V3 runs as a service worker. No `document`, no `window`, no `localStorage`. Use `chrome.storage.sync` for settings and message passing to communicate with the content script.

---

## Gmail label search: hyphens replace spaces

**Rule:** When searching by label in Gmail, spaces in label names become hyphens. `label:Cold Email` → `label:Cold-Email`. The Apps Script search query and Chrome extension tab queries must use hyphenated versions.
