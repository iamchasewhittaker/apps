# Alias Ledger — Claude Instructions

## Project
Chase's Hide My Email alias tracker. One alias per company — when spam arrives, you know exactly who leaked or sold the data. Single-file HTML app, `localStorage`-only, no build step.

- **Owner:** chase.t.whittaker@gmail.com
- **URL:** https://alias-ledger.vercel.app
- **Primary file:** `index.html` — open directly in browser or via Vercel URL
- **Storage key:** `hme_alias_tracker_v1`
- **Shortcut constant:** `SHORTCUT_NAME` near top of the `<script>` block — must match the iOS Shortcut name exactly

---

## What This App Is

A single-file HTML tool for tracking Hide My Email aliases — one alias per company — so when spam arrives you know exactly who leaked the data. Supports three statuses (active, burned, retired), filter chips, copy/burn/delete actions, JSON export, and a deep-link button to iOS Shortcuts for generating new aliases.

## What it does
- Logs each Hide My Email alias: company, channel, date, status, notes
- Three statuses: `active`, `burned` (spam started), `retired`
- Filter chips, stats header, copy/edit/burn/delete per row, JSON export
- "Generate Alias" button deep-links to iOS Shortcuts: `shortcuts://run-shortcut?name=New%20Hide%20My%20Email`
- Keyboard shortcuts: `Esc` closes modal, `Cmd/Ctrl+N` opens new-alias modal

## Data model
```js
{
  id: string,
  alias: string,           // e.g. 'random.words.123@icloud.com'
  company: string,
  channel: string,         // Direct site | LinkedIn Easy Apply | Indeed | ZipRecruiter | Recruiter outreach | Referral / warm intro | Newsletter / signup | Other
  notes: string,
  status: 'active' | 'burned' | 'retired',
  created: ISO8601,
  burnedAt?: ISO8601,
  burnReason?: string
}
```

---

## Accessibility (RP)
Chase has Retinitis Pigmentosa. Always preserve:
- High contrast: `--text: #f2f2f5` on `--bg: #0d0d0f`
- Status conveyed by text + dot, not color alone
- Font sizes ≥ 13px for data, ≥ 15px for body
- Visible focus rings (2px accent outline)

---

## Related
- `../job-search-hq/` — job search tracking (sister tool)
