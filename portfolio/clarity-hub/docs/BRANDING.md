# App branding — Clarity Hub

> Single source for identity + visual rules. Linked from `CLAUDE.md` — do not restate these rules in session prompts.

---

## App identity

| Field | Value |
|-------|-------|
| **Display name** | `Clarity Hub` |
| **Repo path** | `portfolio/clarity-hub/` |
| **Stack** | React CRA · Supabase · Vercel PWA · inline styles |
| **Storage / app keys** | `chase_hub_ynab_v1`, `chase_hub_checkin_v1`, `chase_hub_triage_v1`, `chase_hub_time_v1`, `chase_hub_budget_v1`, `chase_hub_growth_v1`, `chase_hub_rollertask_v1` |
| **YNAB token key** | `chase_hub_ynab_token` (localStorage, never synced) |
| **Primary ritual** | "Desktop companion for all 7 Clarity iOS apps via Supabase sync" |

---

## Visual system — Web (React CRA, inline styles, Vercel PWA)

Uses the **Clarity palette** from `src/theme.js` (`T` tokens):

| Token | Hex | Use |
|-------|-----|-----|
| `T.bg` | `#0f1117` | Page background |
| `T.surface` | `#1a1d27` | Card / tab surface |
| `T.border` | `#2a2d3a` | Dividers, borders |
| `T.text` | `#e8eaf0` | Primary text |
| `T.muted` | `#8b90a0` | Secondary / label text |
| `T.blue` | `#4f8ef7` | Primary accent, active state |
| `T.green` | `#4caf7d` | Success, covered |
| `T.yellow` | `#f5a623` | Warning, partial |
| `T.red` | `#e05a5a` | Error, needs attention |
| `T.purple` | `#9b59b6` | YNAB / finance accent |

**Theme-color:** `#0f1117` (set in `public/index.html`)

**Nav:** Horizontal scrollable tab bar — 8 tabs (YNAB, Check-in, Triage, Time, Budget, Growth, Tasks, Settings)

| Checklist | Done |
|-----------|------|
| Dark palette consistent with Clarity iOS app family | ✅ |
| `manifest.json` + `index.html` meta/theme aligned | ✅ |
| Scrollable NavTabs for 8 tabs | ✅ |

---

## Voice & naming

| Rule | Value |
|------|-------|
| User-visible product name | `Clarity Hub` |
| Tab labels | Short, match iOS app names: YNAB, Check-in, Triage, Time, Budget, Growth, Tasks, Settings |
| Words to avoid | Internal codenames, `clarity-hub` kebab in UI text |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-04-13 | Initial `BRANDING.md` from template — scaffold complete |
