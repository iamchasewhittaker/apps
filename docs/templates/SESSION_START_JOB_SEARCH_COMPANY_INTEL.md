# Session Start — Job Search HQ: Company Intel View

Paste this into a new chat and say: *"Read CLAUDE.md and HANDOFF.md first."*

---

```
Read CLAUDE.md and HANDOFF.md first, then portfolio/job-search-hq/CLAUDE.md and portfolio/job-search-hq/HANDOFF.md.

Goal: Build the Company Intel View — Wave 2 item #1 — at portfolio/job-search-hq/.

## What to build

Add a "By Company" view toggle to ContactsTab. When active, instead of a flat contact list, show contacts grouped by company — with a summary row per company that reveals the contact cards on click.

### Company row shows:
- Company name (bold)
- Contact count + types (e.g. "2 contacts — Recruiter, Alumni")
- Outreach status summary (e.g. "1 replied")
- Linked application badge — if there's a matching application in pipeline, show stage pill (e.g. "Applied", "Interview")
- GAP ALERT: If no linked application exists but you have a contact there → "Not applied — warm lead!" in amber
- MISSING CONTACT: If you have an active application but zero contacts at that company → shown as a ghost row: "0 contacts at Stripe — find someone" in muted text

### Grouping logic (pure computed, no new data fields):
- Group contacts by `contact.company` (case-insensitive, trimmed)
- Match to applications by comparing `contact.company` to `application.company` (same case-insensitive logic)
- "Warm lead" = company appears in contacts, zero matching applications
- "No contact" = company appears in applications, zero matching contacts
- Contacts with blank `company` go into an "Unknown company" bucket at the bottom

### View toggle:
- Add two buttons above the filters: "List" | "By Company"
- "List" = current behavior (no change)
- "By Company" = new grouped view; hides the existing flat list + filters
- Default view: "List" (don't change current behavior on load)

### Interaction:
- Clicking a company row expands it to show its ContactCards (same component already used in list view)
- Clicking a "Not applied" badge opens the AppModal pre-filled with the company name
- "Find someone" links open a LinkedIn search (window.open) for that company

## Files to modify

- `src/tabs/ContactsTab.jsx` — add view toggle + company grouping render
- `src/constants.js` — add style tokens for company rows (ciRow, ciRowHeader, ciGap, ciGhostRow, ciCompanyName, ciBadge)
- No changes to data model — this is purely computed/display

## Patterns to follow

- Computed grouping lives inside ContactsTab as a `useMemo` (not in constants.js — it needs live React state)
- Company rows use the same `s.*` styles as the rest of the tab
- Expanding/collapsing uses local `useState` for the set of open company names
- New AppModal pre-fill: `setAppModal({ mode: "add", app: { ...blankApp(), company: companyName } })`
- ContactsTab already receives `applications` and `setContactModal` props — no new props needed from App.jsx
- Need `setAppModal` prop threaded from App.jsx to ContactsTab (not currently passed — add it)

## Data shape reminder

```js
contact: { id, name, company, role, type, outreachStatus, outreachDate, lastContact, notes, appIds }
application: { id, company, title, stage, nextStepDate, nextStepType, ... }
```

## Verify

cd portfolio/job-search-hq && npm start (port 3001)
- Toggle List ↔ By Company — no crash
- Company rows expand/collapse
- Warm lead badge shows for contacts with no matching application
- Ghost rows show for applications with no contacts
- Pre-fill AppModal works from "Not applied" badge
- Filter chips still work in List view

## When done

Update CHANGELOG [Unreleased], ROADMAP (mark Wave 2 item #1 done), HANDOFF, root ROADMAP Change Log, root HANDOFF State.
```
