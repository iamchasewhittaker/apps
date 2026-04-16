# App branding — Clarity Command

> **Filled copy** of the monorepo template. Session prompts: *"Follow `docs/BRANDING.md`"* — do not paste full icon rules into every chat.
> **Source template:** [`docs/templates/PORTFOLIO_APP_BRANDING.md`](../../../docs/templates/PORTFOLIO_APP_BRANDING.md)
> **Icon handoff (any Clarity app):** [`docs/templates/SESSION_START_CLARITY_IOS_LOGOS.md`](../../../docs/templates/SESSION_START_CLARITY_IOS_LOGOS.md) -- Design index [`docs/design/README.md`](../../../docs/design/README.md)

### Clarity iOS suite (sibling apps — each has `docs/BRANDING.md` + `AppIcon`)

| App | Glyph (shipped) |
|-----|-----------------|
| **Check-in** | Horizon + checklist tick + pill |
| **Triage** | Nested chevron |
| **Time** | Clock + progress arc |
| **Budget** | Stacked coins |
| **Growth** | Sprout |
| **Command** | Interim: programmatic tile + gold chevron (`tools/generate_app_icon.py`) — replace with final chevron-in-shield when designed |

---

## App identity

| Field | Value |
|-------|--------|
| **Display name** | Clarity Command |
| **Repo path** | `portfolio/clarity-command-ios/` |
| **Stack** | SwiftUI iOS 17 + `ClarityUI` |
| **Bundle ID** | `com.chasewhittaker.ClarityCommand` |
| **Storage key** | `chase_command_ios_v1` |
| **Primary ritual** (center glyph concept) | Daily accountability — morning commit + evening score; command/authority motif (chevron-in-shield, military star, or crossed flags) |

---

## Visual system

### Color palette

| Token | Hex | Usage |
|-------|-----|-------|
| **Gold accent** | `#c8a84b` | Primary action buttons, tab highlights, progress indicators |
| **Gold light** | `#d4b85c` | Hover/pressed states, subtle highlights |
| **Gold dark** | `#a08838` | Shadows, borders on gold elements |
| `ClarityPalette.bg` | `#0f1117` | App background (shared via ClarityUI) |
| `ClarityPalette.surface` | `#161b27` | Card/section backgrounds |
| `ClarityPalette.border` | `#1f2937` | Dividers, card edges |
| `ClarityPalette.text` | `#f3f4f6` | Primary text |
| `ClarityPalette.muted` | `#6b7280` | Secondary/caption text |

Gold accent is defined in `CommandPalette.swift` (app-local) — not in shared ClarityUI. All other tokens come from `ClarityPalette` in the shared package.

### Clarity iOS

**Shared technical spec:** [`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`](../../../docs/design/CLARITY_IOS_APP_ICON_SPEC.md)

| Checklist | Done |
|-----------|------|
| `AppIcon.appiconset/AppIcon.png` — **1024x1024**, opaque | [x] interim (regenerate via `tools/generate_app_icon.py`) |
| `Contents.json` — `"filename": "AppIcon.png"` on universal iOS slot | [x] |
| Icon uses shared shell + unique center glyph per spec | [ ] interim glyph — revise to final Command mark |
| `AccentColor.colorset` aligned with gold accent | [x] |
| Wide mockup in `docs/design/` | [ ] |

**App-specific asset paths:**

| Asset | Path |
|-------|------|
| Shipped icon | `ClarityCommand/Assets.xcassets/AppIcon.appiconset/AppIcon.png` |
| Design references | `docs/design/` (TBD) |

---

## Voice & naming

| Rule | Value |
|------|-------|
| User-visible product name | Clarity Command |
| Motto | "For Reese. For Buzz. Forward — no excuses." |
| Tone | Urgent, faith-driven, military-inspired accountability |
| Words to avoid in UI | "app", "software", internal codenames |

---

## Related monorepo docs

| Doc | Use when |
|-----|----------|
| [`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`](../../../docs/design/CLARITY_IOS_APP_ICON_SPEC.md) | Drawing or exporting **any** Clarity-family iOS icon |
| [`docs/design/README.md`](../../../docs/design/README.md) | Index of design specs |
| [`docs/templates/SESSION_START_APP_CHANGE.md`](../../../docs/templates/SESSION_START_APP_CHANGE.md) | Starting a single-app AI session |
| [`docs/templates/SESSION_START_CLARITY_IOS_LOGOS.md`](../../../docs/templates/SESSION_START_CLARITY_IOS_LOGOS.md) | **Clarity iOS** — fix / iterate **one** launcher (suite shipped; name app in chat) |
| [`docs/ios-app-starter-kit/README.md`](../../../docs/ios-app-starter-kit/README.md) | Planning docs order before code |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-04-14 | Initial `BRANDING.md` from template; gold palette documented; suite table updated with Command row. |
