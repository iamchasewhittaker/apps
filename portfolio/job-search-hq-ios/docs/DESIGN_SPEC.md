# Job Search HQ iOS — design spec (Figma-aligned)

Canonical engineering + branding tables live in [`BRANDING.md`](BRANDING.md). This document locks **information architecture**, **screen inventory**, **design tokens for Figma**, and **hero flows** so design and code stay aligned.

## V1 scope (locked)

See [`SCOPE_V1.md`](SCOPE_V1.md) for bundle ID, deferred features, and Chrome extension stance.

## Information architecture

Bottom tab bar (iPhone, portrait), four tabs:

| Tab | Purpose | Primary web analogue |
|-----|---------|----------------------|
| **Focus** | Daily blocks checklist (read-only steps + ADHD tips from web `DAILY_BLOCKS`) | Focus tab |
| **Pipeline** | Applications list, stage filter, add/edit in sheet | Pipeline tab |
| **Contacts** | Contacts list, add/edit in sheet | Contacts tab |
| **More** | Profile summary, storage key reminder, “About / sync” copy | Resources + profile entry |

**Out of v1:** AI tools tab (no on-device Claude), full Resources backup UI (Phase 1 uses local blob only; export can follow), Chrome extension (native iOS has no parity).

## Screen inventory (Figma frames)

1. **Shell** — `TabView` with four roots; system tab icons + labels.
2. **Focus — root** — Scroll of block cards (title, emoji, time, tag pill, numbered steps, ADHD tip in muted callout).
3. **Pipeline — root** — Navigation stack; list of `ApplicationRow` (company, title, stage chip, next-step date if set); FAB or toolbar “Add”; empty state.
4. **Pipeline — application editor** — Sheet: company, title, stage `Picker`, dates, URL, notes (scroll); Save / Cancel.
5. **Contacts — root** — List rows (name, company, outreach status); Add; empty state.
6. **Contacts — editor** — Sheet: name, company, role, email, LinkedIn, notes, outreach fields (subset matching web).
7. **More — root** — Profile headline + key fields read-only; version string; link row “Data stays on this device until Supabase sync (Phase 2)”.
8. **System** — Dark mode only; error inline text (no toast infra required for v1).

## Design tokens (Figma variables → Swift)

Map Figma variables to `JSHQTheme` in code (see `Theme/JSHQTheme.swift`).

| Semantic | Hex | Use |
|----------|-----|-----|
| `jshqBackground` | `#0f1117` | Screen background (web parity) |
| `jshqSurface` | `#1a1d27` | Cards, sheets |
| `jshqBorder` | `#2a2d3a` | Hairlines |
| `jshqTextPrimary` | `#e5e7eb` | Body, titles |
| `jshqTextMuted` | `#9ca3af` | Secondary |
| `jshqAccentBlue` | `#3b82f6` | Primary actions, pipeline |
| `jshqAccentPurple` | `#8b5cf6` | Networking / future AI |
| `jshqAccentGreen` | `#10b981` | Positive |
| `jshqAccentAmber` | `#f59e0b` | Warnings, interviews |
| `jshqAccentRed` | `#ef4444` | Destructive, rejected |

**Typography:** Prefer `ClarityTypography` from ClarityUI for dynamic type; use semantic text styles on cards.

**Layout:** `ClarityMetrics.minTapTarget` (44pt) for tappable rows; card corner radius 10–12pt to mirror web cards.

## Hero flows (acceptance for v1 UI)

1. **Add application** — From Pipeline, user opens Add sheet, enters company + title, picks stage, saves → row appears in list; persists across relaunch.
2. **Edit stage** — User opens existing app, changes stage, saves → list reflects stage color/chip.
3. **Add contact** — From Contacts, save → list persists.
4. **Focus** — User reads blocks; no required interaction (informational v1).
5. **More** — User sees profile name from blob; reflects edits from a future profile editor (v1 can show read-only fields from `profile` struct).

## App icon (suite)

Follow repo root [`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`](../../../docs/design/CLARITY_IOS_APP_ICON_SPEC.md). Current asset is a **solid navy placeholder** (`#0B0F1A`); replace with final 1024×1024 glyph before App Store.

## Related

- Web data shape: [`../../job-search-hq/src/constants.js`](../../job-search-hq/src/constants.js) (`defaultData`, `blankApp`, `blankContact`).
- Web branding: [`../../job-search-hq/docs/BRANDING.md`](../../job-search-hq/docs/BRANDING.md).
