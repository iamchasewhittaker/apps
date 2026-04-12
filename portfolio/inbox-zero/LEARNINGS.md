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

## Amazon: Notification, not Receipt

**Decision:** `amazon.com` is filtered as Notification (not Receipt) because it catches orders, shipping, AND account alerts. Spend Clarity can isolate receipt emails using `from:amazon.com label:Notification subject:(order OR shipped)`.
