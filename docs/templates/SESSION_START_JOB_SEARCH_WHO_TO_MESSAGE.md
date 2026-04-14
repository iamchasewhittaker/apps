# Session Start — Job Search HQ: "Who should I message today?"

> **Status:** Shipped as **Wave 2 #2** (2026-04-13). For current focus and next tasks, read **`portfolio/job-search-hq/HANDOFF.md`** and **`ROADMAP.md`**.

Paste this into a new chat and say: *"Read CLAUDE.md and HANDOFF.md first."*

---

```
Read CLAUDE.md and HANDOFF.md first, then portfolio/job-search-hq/CLAUDE.md and portfolio/job-search-hq/HANDOFF.md.

Defaults: use `CLAUDE.md` — "update docs" = app + root unless overridden below.
Docs scope override (optional): [default app+root | app-only | handoff-only]

Goal: Build the "Who should I message today?" feature — Wave 2 item #2 — at portfolio/job-search-hq/.

## What to build

Add a prioritized outreach queue widget to FocusTab. It should surface the single most actionable networking move for today, ranked by a clear priority order.

### Priority queue logic (computed, no new data fields):

Rank contacts by urgency, highest first:

1. **Follow-up overdue** — outreachStatus = "sent", outreachDate ≥ 7 days ago, no reply yet → "Follow up with [name] at [company] — sent 7 days ago"
2. **Interview / active application, no HM contact** — application stage is "Interview" or "Final Round" and no contact linked with type "hiring_manager" → "Connect with someone at [company] — you have an interview and no insider"
3. **Replied but no meeting booked** — outreachStatus = "replied", no meeting scheduled → "Schedule a call with [name] — they replied"
4. **Warm lead (contact, no application)** — have a contact at a company, haven't applied → "Apply to [company] — you know [name] there"
5. **No outreach in 14+ days** — lastContact or outreachDate older than 14 days, relationship not dead → "Check in with [name] — 14 days of silence"

### Widget design:

- Placed on FocusTab below the Action Queue block (before the daily focus blocks)
- Title: "Networking Moves" with a count badge (e.g. "3")
- Show top 3 items max; each item is one line with name, company, and a short reason
- Each item has a "→ Draft" button that navigates to AITab (setTab("ai")) and a "✓ Done" button that marks outreachStatus = "sent" or increments a follow-up (update contact inline)
- Collapse the section if the queue is empty (0 items)

### Files to modify

- `src/tabs/FocusTab.jsx` — add the Networking Moves section
- `src/constants.js` — add style tokens for the widget rows (nmRow, nmName, nmReason, nmActions)
- No changes to App.jsx data model — queue is computed from existing contacts + applications

### Props available on FocusTab

FocusTab already receives: `applications`, `contacts`, `setAppModal`, `setPrepModal`, `setTab`
It does NOT currently receive `saveContact` — thread it from App.jsx (same pattern as ContactsTab).

### Patterns to follow

- Computed queue lives inside FocusTab as a `useMemo` (depends on contacts + applications)
- Style tokens in `s` object in constants.js
- "✓ Done" inline updates use `saveContact` (same pattern as ContactsTab's `updateStatus`)
- Keep widget under ~60 lines in FocusTab

## Verify

cd portfolio/job-search-hq && npm start (port 3001)
- Widget shows when contacts exist with actionable state
- Collapses/hides when queue is empty
- "→ Draft" navigates to AI tab
- "✓ Done" updates the contact in state (persists after tab switch)
- Action Queue still works (no regression)

## When done

Update CHANGELOG [Unreleased], ROADMAP (mark Wave 2 item #2 done), HANDOFF, root ROADMAP Change Log, root HANDOFF State.
```
