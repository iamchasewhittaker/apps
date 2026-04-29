# App branding — AI Dev Mastery

> **Purpose:** One place for **identity + visual rules**. Link here from `CLAUDE.md` instead of repeating specs in chats.

---

## App identity

| Field | Your value |
|-------|------------|
| **Display name** | AI Dev Mastery |
| **Repo path** | `portfolio/ai-dev-mastery/` |
| **Stack** | React CRA (JSX, inline styles) |
| **Bundle ID** | n/a (web app) |
| **Storage / app key** | none (no persistence yet) |
| **Primary ritual** | Self-paced AI development learning across 13 tracks |

---

## Visual system

### App palette

| Token | Hex | Usage |
|-------|-----|-------|
| **Background** | `#0f1117` | Page background, logo canvas |
| **Surface** | `#1a1d24` | Cards, sidebar |
| **Accent** | `#f97316` | Logo label, active states, highlights |
| **Text primary** | `#f3f4f6` | Headings, logo main text |
| **Text secondary** | `#9ca3af` | Body text, descriptions |

### Logo

- **Label:** `AI DEV` in `#f97316`, 52px, weight 600, letter-spacing 14
- **Main:** `MASTERY` in `#f3f4f6`, 95px, weight 800, letter-spacing -4
- **Canvas:** 512x512, `#0f1117` bg, `rx="96"` rounded corners
- **Font:** DM Sans / system-ui fallback
- **Files:** `public/logo.svg`, `public/favicon.svg`, `public/logo192.png`, `public/logo512.png`, `public/apple-touch-icon.png`

### B) Web (React CRA, inline styles, Vercel PWA)

| Checklist | Done |
|-----------|------|
| Dark palette + components consistent with existing portfolio apps | [x] |
| `manifest.json` + `index.html` meta / theme aligned with this file | [x] |

**Track color palette** (from CLAUDE.md):
| Track | Color |
|-------|-------|
| Claude Code | #E8A87C |
| Claude Console | #A8D8EA |
| Cursor | #7EC8C8 |
| Project Management | #B8A9E8 |
| AI Fundamentals | #82C9A0 |
| Prompt Engineering | #C792EA |
| Zapier & Automations | #FF8C69 |
| Sunsama & Linear | #F9C74F |
| Claude Cowork | #D4A5F5 |
| Figma | #FF7262 |
| NotebookLM | #A8C8F8 |
| Career & Job Search | #F4A9C0 |
| Apple Shortcuts | #FFD166 |
| Git & Version Control | #F97316 |

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
| 2026-04-28 | Added app palette, logo spec (orange `#f97316` accent), SVG/PNG assets, updated manifest + index.html, Git track color |
