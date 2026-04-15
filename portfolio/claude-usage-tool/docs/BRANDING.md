# App branding — Claude Usage Tool

> **Purpose:** One place for **identity + visual rules**. Link here from `CLAUDE.md` instead of repeating specs in chats.

---

## App identity

| Field | Your value |
|-------|------------|
| **Display name** | Claude Usage Tool |
| **Repo path** | `portfolio/claude-usage-tool/` |
| **Stack** | Electron 28 + React 18 + TypeScript + Vite |
| **Bundle ID** | `com.claude-usage-tool` |
| **Storage / app key** | electron-store (user preferences) |
| **Primary ritual** | Glanceable Claude subscription usage from the menu bar |

---

## Visual system

### D) macOS Native (Electron menu bar)

| Checklist | Done |
|-----------|------|
| Tray icon template (macOS native) | [x] |
| App icon (.icns) for dock/Finder | [x] |
| Dark/light mode support in popup | [ ] |

**Existing assets:**
| Asset | Path |
|-------|------|
| App icon (.icns) | `assets/icon.icns` |
| Tray icon | `assets/trayIconTemplate.png` |
| Tray icon @2x | `assets/trayIconTemplate@2x.png` |

---

## Related monorepo docs

| Doc | Use when |
|-----|----------|
| [`docs/design/README.md`](../../docs/design/README.md) | Index of design specs |
| [`docs/templates/SESSION_START_APP_CHANGE.md`](../../docs/templates/SESSION_START_APP_CHANGE.md) | Starting a single-app AI session |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-04-14 | Initial `BRANDING.md` from template |
