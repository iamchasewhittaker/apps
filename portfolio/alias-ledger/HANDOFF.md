# Handoff: Hide My Email Alias Tracker → MVP Playbook

## Context

Chase uses Apple's Hide My Email to generate per-company `@icloud.com` aliases for job applications and signups. The goal is to track which alias went to which company so when spam arrives on an alias, he knows exactly who leaked or sold his data.

A standalone HTML prototype was built at `alias-tracker.html` (sibling to this doc). It's working, designed, and tested in-browser. Your job: **integrate it as a feature/section inside `~/Developer/portfolio/my-mvp-playbook.html`**, which is the single source of truth for Chase's project tracking.

## What the feature does

- Logs each Hide My Email alias against: company, channel (LinkedIn / Indeed / direct / recruiter / referral / etc.), date, status, notes
- Three statuses: `active`, `burned` (started receiving spam), `retired`
- Filter chips (All / Active / Burned / Retired)
- Stats header: active count, burned count, total
- "Generate Alias in Shortcuts" button — deep-links to the iOS Shortcut via `shortcuts://run-shortcut?name=New%20Hide%20My%20Email` (the name is configurable at the top of the script; see `SHORTCUT_NAME` constant)
- Burn flow: prompts for spam type, timestamps, moves to burned state. Restore also supported.
- Copy, Edit, Delete per row
- JSON export
- Keyboard shortcuts: `Esc` closes modal, `Cmd/Ctrl+N` opens new-alias modal
- All data stored in `localStorage` under key `hme_alias_tracker_v1`

## Data model

```js
{
  id: string,              // uid
  alias: string,           // e.g. 'random.words.123@icloud.com'
  company: string,
  channel: string,         // from enum in the <select>
  notes: string,
  status: 'active' | 'burned' | 'retired',
  created: ISO8601 string,
  burnedAt?: ISO8601 string,
  burnReason?: string
}
```

## Integration instructions for Claude Code

### Step 1 — Read the playbook first
Before writing any code, read `~/Developer/portfolio/my-mvp-playbook.html` end-to-end. Identify:
- Existing navigation / section structure (tabs? accordion? routed views?)
- CSS variable names and color tokens — **use them, don't introduce new ones**
- Component conventions (vanilla JS? React? custom web components?)
- localStorage key naming pattern — match it
- Typography choices — match them
- How other features handle lists, modals, toasts, filters

### Step 2 — Translate, don't paste
The prototype uses its own CSS variables (`--bg`, `--surface`, `--accent: #ff5e9c`, etc.). **Map these onto the playbook's existing tokens.** Specifically:
- `--accent` (pink) should probably map to the playbook's existing accent/brand color rather than introducing pink if it doesn't exist there. The pink was a nod to the Hide My Email icon color — optional to preserve.
- Do not duplicate font imports if the playbook already loads fonts.
- Do not introduce a new modal system if the playbook has one — reuse it.
- Do not add a separate toast system if the playbook has notifications — reuse.

### Step 3 — Placement
Add this as a new section in the playbook. Candidate locations, in order of likelihood:
1. Under an existing "Job Search" area if one exists
2. As a new top-level section if job search is not yet represented
3. As a utility section alongside other personal tools

Name the section something like **"Hide My Email Tracker"** or **"Alias Ledger"** — match the playbook's naming vibe.

### Step 4 — Storage namespacing
The prototype uses localStorage key `hme_alias_tracker_v1`. If the playbook has a storage prefix convention (e.g. `mvp_*`), rename to `mvp_hme_aliases_v1` or whatever matches. **Do not clobber existing data** — check for conflicts.

### Step 5 — Accessibility / RP considerations
Chase has Retinitis Pigmentosa (central vision OK, peripheral/night vision impaired). The prototype already handles this:
- High contrast text (`--text: #f2f2f5` on `--bg: #0d0d0f`)
- No information conveyed by color alone (status has both color AND text label AND a dot)
- Status badges are uppercase and bordered, not subtle color tints
- Font sizes stay >= 13px for data, 15px for body
- Focus states are visible (2px accent outline)

**Preserve these properties** when translating to the playbook's styles. If the playbook's existing style is lower contrast, flag it but don't dim this feature to match.

### Step 6 — The Shortcut deep-link
The button `openShortcut()` uses `shortcuts://run-shortcut?name=New%20Hide%20My%20Email`. Confirm with Chase what he named the Shortcut in iOS; expose `SHORTCUT_NAME` as a configurable constant near the top of the integrated code. On desktop this link will do nothing — consider showing a hint like "Open on iPhone to run" on non-iOS user agents, or leaving the button enabled and silent (it's harmless).

### Step 7 — Don't skip the audit trail
Chase's memory notes that the playbook tracks audit history. If the playbook has an audit/changelog pattern, log alias events (created, burned, restored, deleted) into it. If not, skip — don't invent one.

## Files

- `alias-tracker.html` — working standalone prototype (reference implementation)
- `HANDOFF.md` — this doc

## Testing checklist

- [ ] Create an alias via "Log Alias" — appears in table
- [ ] Burn it — prompts for reason, moves to burned, line-through applied
- [ ] Filter chips work
- [ ] Edit via pencil/edit — fields pre-populate
- [ ] Copy button copies the alias to clipboard
- [ ] Export JSON downloads a dated file with correct data
- [ ] Delete confirms before destroying
- [ ] Stats header updates after every action
- [ ] Empty state shows when no aliases exist
- [ ] Data persists on page reload
- [ ] Mobile layout (≤640px) drops channel and date columns
- [ ] `shortcuts://` URL fires on iOS Safari

## Notes to Chase

- The Shortcut button assumes your Shortcut is named exactly `New Hide My Email`. Rename the constant if yours is different.
- If you want the burn flow to be less intrusive than `prompt()`, a future enhancement is a proper burn modal — the prototype uses `prompt()` to keep the code tight.
- Future extension worth considering: a weekly digest view — "aliases burned this month" grouped by company / channel — that becomes real intel on which sites to avoid.
