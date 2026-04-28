# Roadmap — Wellness Tracker

## Now

- [x] Supabase sync + email OTP (iOS PWA)
- [x] Unified **W + sunrise** branding — Clarity-family palette; web `public/` + `manifest.json` + `docs/BRANDING.md` + [HANDOFF.md](HANDOFF.md); iOS `AppIcon` + [../wellness-tracker-ios/HANDOFF.md](../wellness-tracker-ios/HANDOFF.md)
- [x] Native iOS — check-in + tabs (`portfolio/wellness-tracker-ios`; optional Supabase + `wellness-daily` for Clarity Command)
- [ ] Vercel root directory: `portfolio/wellness-tracker` after monorepo migration

## Next

- [x] **UI palette parity (web):** `src/theme.js` `T` tokens aligned to portfolio BASE token set (`#0f1117` bg, `#161b27` surface, `#1f2937` border, `#f3f4f6` text, `#6b7280` muted); DM Sans font (2026-04-13)
- [x] **iOS palette parity (Clarity-family apps):** `clarity-ui/Sources/ClarityUI/Theme/ClarityPalette.swift` + `funded-ios/Funded/Theme/ClarityTheme.swift` aligned to BASE tokens (shipped 2026-04-13, commit `91a58f6`); `clarity-command-ios/.../CommandPalette.swift` inherits via `ClarityPalette`. Wellness Tracker iOS deliberately keeps `WellnessTheme.swift` (cream paper / sage / terracotta) — not a token-parity candidate. See [`docs/design/IOS_THEME_ALIGNMENT_HANDOFF.md`](../../docs/design/IOS_THEME_ALIGNMENT_HANDOFF.md).
- [x] Split `TrackerTab` into `src/tabs/tracker/` (13 sub-components; orchestrator ~12 KB, down from 78 KB monolith)
- [x] Portfolio text logo — WELLNESS/TRACK (`public/logo.svg`, `public/favicon.svg`, PNG assets)
- [ ] Split `HistoryTab` (58 KB) into analytics, export, AI summary sub-components
- [ ] Wellness iOS Phase 2+ — tab bar, richer history, export, parity with web modals/tabs (when scoped)

## Later

- [ ] Shared UI package across portfolio (optional)

## Project tracking

[Linear — Wellness Tracker](https://linear.app/whittaker/project/wellness-tracker-36f4fb10e0e7)
