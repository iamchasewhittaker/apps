# HANDOFF — Wellness Tracker (web + iOS)

> Per-app session state. **Monorepo session routine** still uses repo-root [`HANDOFF.md`](../../HANDOFF.md) — update that file’s **State** when you stop, and keep *this* file in sync when work is Wellness-only.

---

## State

| Field | Value |
|-------|--------|
| **Paths** | Web: `portfolio/wellness-tracker/` · Native: [`../wellness-tracker-ios`](../wellness-tracker-ios/) |
| **Focus** | **Branding:** Wellness app mark uses **Clarity family palette** (same RGB tokens as [`YNAB Clarity` `ClarityTheme`](../ynab-clarity-ios/YNABClarity/Theme/ClarityTheme.swift)). *Spend Clarity* is a Python CLI with no logo asset in-repo; palette choice aligns Wellness with the **YNAB Clarity** iOS surface in the receipts + YNAB toolchain. |
| **Assets** | Master: `public/logo-1024.png` · PWA: `public/manifest.json`, `logo192` / `logo512`, `apple-touch-icon`, `favicon-32` · iOS: `wellness-tracker-ios/.../AppIcon.appiconset/AppIcon.png` — see [docs/BRANDING.md](docs/BRANDING.md). |
| **Last touch** | 2026-04-13 — **Theme alignment (web):** `T` tokens updated in `theme.js` (`bg` `#0f1117`, `surface` `#161b27`, `border` `#1f2937`, `text` `#f3f4f6`, `muted` `#6b7280`); Georgia → DM Sans font in `App.jsx`; DM Sans Google Fonts link added to `public/index.html`. Portfolio-wide BASE token sync. |
| **Next** | **iOS theme alignment** — see [`docs/design/IOS_THEME_ALIGNMENT_HANDOFF.md`](../../docs/design/IOS_THEME_ALIGNMENT_HANDOFF.md) for `ClarityPalette.swift` update spec. Then: split `TrackerTab` + `HistoryTab`. |

---

## Quick links

- [CLAUDE.md](CLAUDE.md) · [CHANGELOG.md](CHANGELOG.md) · [ROADMAP.md](ROADMAP.md) · [docs/BRANDING.md](docs/BRANDING.md)
- iOS: [../wellness-tracker-ios/CLAUDE.md](../wellness-tracker-ios/CLAUDE.md) · [../wellness-tracker-ios/HANDOFF.md](../wellness-tracker-ios/HANDOFF.md)

---

## Linear

[Wellness Tracker](https://linear.app/whittaker/project/wellness-tracker-36f4fb10e0e7)
