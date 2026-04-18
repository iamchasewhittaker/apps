# Handoff — Alias Ledger

## State

| Field         | Value |
|---------------|-------|
| **Status**    | ✅ v1.0 shipped |
| **URL**       | https://alias-ledger.vercel.app |
| **Repo**      | `~/Developer/chase/portfolio/alias-ledger/` — inside `apps.git` monorepo |
| **Branch**    | `main` — auto-deploys to Vercel on push |
| **Last touch**| 2026-04-18 — initial deploy |
| **Next**      | Use it during job apps; upgrade burn flow from `prompt()` to a proper modal when it feels annoying |

---

## What it is

Single-file HTML app (`index.html`) — no build step, no framework, no server. Open at the URL above on any device. Data lives in `localStorage` under `hme_alias_tracker_v1`.

One alias per company. When spam arrives on an alias, you know exactly who leaked or sold your data.

---

## Key constants (top of `<script>`)

```js
const SHORTCUT_NAME = 'New Hide My Email'; // must match your iOS Shortcut name exactly
```

Change this if your Shortcut has a different name.

---

## Features
- Log alias: company, channel, date, notes
- Three statuses: `active`, `burned` (spam started), `retired`
- Burn flow: records spam type + timestamp
- Filter chips, stats header, copy/edit/restore/delete per row
- JSON export
- "Generate Alias" button → `shortcuts://run-shortcut?name=New%20Hide%20My%20Email`
- `Esc` closes modal, `Cmd/Ctrl+N` opens new-alias modal

---

## Resuming work

```
Read portfolio/alias-ledger/CLAUDE.md and HANDOFF.md.

Goal: [describe what you want to change]

Stack: single-file HTML + vanilla JS + localStorage. No build step.
Key: hme_alias_tracker_v1
URL: https://alias-ledger.vercel.app
Auto-deploys on push to main.
```
