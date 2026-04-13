# Roadmap — Wellness Tracker

## Now

- [x] Supabase sync + email OTP (iOS PWA)
- [x] Unified **W + sunrise** branding — Clarity-family palette; web `public/` + `manifest.json` + `docs/BRANDING.md` + [HANDOFF.md](HANDOFF.md); iOS `AppIcon` + [../wellness-tracker-ios/HANDOFF.md](../wellness-tracker-ios/HANDOFF.md)
- [x] Native iOS — local check-in app (`portfolio/wellness-tracker-ios`; no cloud sync)
- [ ] Vercel root directory: `portfolio/wellness-tracker` after monorepo migration

## Next

- [x] **UI palette parity (web):** `src/theme.js` `T` tokens aligned to portfolio BASE token set (`#0f1117` bg, `#161b27` surface, `#1f2937` border, `#f3f4f6` text, `#6b7280` muted); DM Sans font (2026-04-13)
- [ ] **iOS palette parity:** align `ClarityPalette.swift` in `clarity-ui` to same BASE tokens — see [`docs/design/IOS_THEME_ALIGNMENT_HANDOFF.md`](../../docs/design/IOS_THEME_ALIGNMENT_HANDOFF.md)
- [ ] Split oversized tabs (`TrackerTab`, `HistoryTab`) per portfolio ROADMAP
- [ ] Wellness iOS Phase 2+ — tab bar, richer history, export, parity with web modals/tabs (when scoped)

## Later

- [ ] Shared UI package across portfolio (optional)

## Project tracking

[Linear — Wellness Tracker](https://linear.app/whittaker/project/wellness-tracker-36f4fb10e0e7)
