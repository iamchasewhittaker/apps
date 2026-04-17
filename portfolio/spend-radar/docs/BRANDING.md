# App branding — Spend Radar

> **Purpose:** Single source for Spend Radar identity + visual rules. Linked from `CLAUDE.md`; do not restate hex codes or geometry in session prompts.

---

## App identity

| Field | Your value |
|-------|------------|
| **Display name** | Spend Radar |
| **Repo path** | `portfolio/spend-radar/` (+ `portfolio/spend-radar-web/` web dashboard) |
| **Stack** | Google Apps Script backend (`.gs`) + CRA web dashboard (`spend-radar-web`) |
| **Bundle ID** *(native only)* | n/a |
| **Storage / app key** | Apps Script Script Properties (`SHEET_ID`, `GMAIL_FORGE_WEB_APP_URL`, `GMAIL_FORGE_TRIGGER_TOKEN`); web dashboard `localStorage` key `chase_spend_radar_web_v1` |
| **Primary ritual** (one short phrase — drives the **center icon glyph**) | "See every recurring charge at a glance" |

---

## Visual system

### Web dashboard (React CRA, inline styles, Vercel)

| Token | Value |
|-------|-------|
| **Accent (primary)** | `#14b8a6` (teal 500) |
| **Accent (hover/active)** | `#06b6d4` (cyan 500) |
| **Background** | `#0b1220` (near-black navy) |
| **Surface** | `#111827` (slate 900) |
| **Border** | `#1f2937` (slate 800) |
| **Text primary** | `#e5e7eb` (slate 200) |
| **Text muted** | `#9ca3af` (slate 400) |
| **Status — Active** | `#34d399` (emerald 400) |
| **Status — Lapsed** | `#fbbf24` (amber 400) |
| **Status — Cancel candidate** | `#f87171` (red 400) |

**Type:** System stack — `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`. No web fonts.

**Reference implementation for portfolio dark palette:** [`portfolio/knowledge-base/`](../../knowledge-base/) — identical layout model (CRA, inline styles, `s` object in `constants.js`).

| Checklist | Done |
|-----------|------|
| Dark palette + components consistent with existing portfolio apps | [ ] |
| `manifest.json` + `index.html` meta / theme aligned with this file | [ ] |
| `public/favicon.svg` — teal/cyan radar-sweep mark | [ ] |

---

### Sheet (Apps Script side)

Apps Script only paints one thing: Audit tab yellow shading for flagged rows.

| Usage | Value |
|-------|-------|
| Audit flag row shading | `#fff8db` (pale yellow) |
| Header row | bold, frozen row 1 |

No other visual rules inside the Sheet — Google's native styling owns the rest.

---

## Voice & naming

| Rule | Value |
|------|-------|
| User-visible product name | Spend Radar |
| Menu label in Sheet | `Spend Radar` |
| Toast prefix | `Spend Radar` (e.g. `"Spend Radar: refreshed 23 subscriptions"`) |
| Words to avoid in UI | `tracker` (too generic), `bills` (we also cover one-offs), `AI` (we don't use AI) |

---

## Related monorepo docs

| Doc | Use when |
|-----|----------|
| [`docs/templates/PORTFOLIO_APP_BRANDING.md`](../../../docs/templates/PORTFOLIO_APP_BRANDING.md) | Source template this file was copied from |
| [`portfolio/wellness-tracker/docs/BRANDING.md`](../../wellness-tracker/docs/BRANDING.md) | Clarity palette reference (darker variant) |
| [`portfolio/knowledge-base/`](../../knowledge-base/) | Matching dashboard layout pattern |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-04-16 | Initial `BRANDING.md` — teal/cyan accent, dark navy surface |
