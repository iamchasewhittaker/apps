# Learnings — Spend Radar (web)

> Mistakes, fixes, and "aha" moments captured from real sessions.

---

## Format

### YYYY-MM-DD — Short title
**What happened:** 1-2 sentences.
**Root cause:** non-obvious part.
**Fix / lesson:** what to do differently.
**Tags:** csv | cra | deploy | gotcha | ...

---

## Entries

### 2026-04-16 — Published CSV, not `gviz/tq`, for public read-only
**What happened:** Two ways to pull Sheet data as CSV: `/gviz/tq?tqx=out:csv&sheet=NAME` and `File → Share → Publish to web → CSV`. The gviz endpoint requires the Sheet's sharing to be "Anyone with the link can view" — publishing to web uses a pre-rendered snapshot with its own URL.
**Root cause:** gviz URLs also need `&headers=1` and can stall on re-auth redirects when the Sheet's sharing changes.
**Fix / lesson:** Go with **Publish to web** — more stable URL, no re-auth, explicit opt-in for public content. Drawback: republish to refresh (Google snapshots ~5 min cadence).
**Tags:** csv, gotcha

### 2026-04-16 — Tiny CSV parser instead of PapaParse
**What happened:** Tempting to pull PapaParse for ~200KB of dependency to handle quoted fields. Kept it inline.
**Root cause:** Our CSV source is a known tidy Sheet export — no user-pasted CSVs, no weird encoding. A 30-line parser handles quoted fields + escaped quotes, which is everything we hit.
**Fix / lesson:** Stay small — matches portfolio "no unnecessary deps" rule.
**Tags:** cra, deps

### 2026-04-16 — Trailing summary rows leak into CSV
**What happened:** Apps Script writes two bold summary rows (`Monthly est.`, `Yearly est.`) at the bottom of the Subscriptions tab. Those rows flowed into the dashboard and skewed category grouping.
**Root cause:** CSV export treats every row identically; the bold styling doesn't travel.
**Fix / lesson:** Filter in the web app: `r.Service && r.Service !== "Monthly est." && r.Service !== "Yearly est."`. Do the filter in the fetch step so downstream `useMemo`s don't need to care.
**Tags:** csv, gotcha
