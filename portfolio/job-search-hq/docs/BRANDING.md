# App branding — Job Search HQ

> Single source for identity + visual rules. Link from `CLAUDE.md` — don't restate in session prompts.

---

## App identity

| Field | Value |
|-------|-------|
| **Display name** | Job Search HQ |
| **Repo path** | `portfolio/job-search-hq/` |
| **Stack** | React CRA · inline styles · Vercel PWA |
| **Storage / app key** | `chase_job_search_v1` (localStorage) · `job-search` (Supabase sync) |
| **Live URL** | https://job-search-hq.vercel.app |
| **Primary ritual** | Daily pipeline review + company research + STAR story prep |

---

## Visual system — Web (React CRA, inline styles, Vercel PWA)

| Checklist | Done |
|-----------|------|
| Dark palette (see below) consistent with portfolio apps | ✅ |
| `manifest.json` + `index.html` meta / theme aligned | ✅ |
| DM Sans font via Google Fonts | ✅ |
| Supabase auth gate (email OTP) | ✅ |

### Color palette — "Command Blue"

> **Rule: no raw hex/rgba anywhere outside `src/tokens.js`.** All colors use `T.*` token references.
> Aligned with Shipyard's nautical token vocabulary where possible.

| Token (`T.*`) | Value | Use | Shipyard equiv |
|---------------|-------|-----|----------------|
| **Core** | | | |
| `bg` | `#0A1128` | Page background | `--bg` |
| `surface` | `#0E1A3E` | Cards, modals, panels | `--surface` |
| `foreground` | `#FFFFFF` | Body text, headings | `--foreground` |
| `muted` | `#A0AABF` | Labels, metadata, placeholders | `--muted` |
| `card` | `rgba(255,255,255,0.05)` | Card fill | `bg-surface/80` |
| `cardSubtle` | `rgba(255,255,255,0.03)` | Faint card fill | `bg-surface/50` |
| `border` | `rgba(59,130,246,0.12)` | Card borders, dividers | `--border` |
| `borderInput` | `rgba(59,130,246,0.2)` | Input borders | |
| `borderHover` | `rgba(59,130,246,0.35)` | Hover border | |
| `borderFocus` | `rgba(59,130,246,0.5)` | Focus ring | |
| `overlay` | `rgba(0,0,0,0.75)` | Modal overlay | |
| `modalBg` | `rgba(14,26,62,0.95)` | Modal backdrop | |
| `bgGradient` | `linear-gradient(150deg, bg, surface)` | Page gradient | |
| **Accent (blue)** | | | |
| `accent` | `#3b82f6` | Primary actions, active states | `--accent` |
| `accentBg` | `rgba(59,130,246,0.15)` | Accent fill | |
| `accentRing` | `rgba(59,130,246,0.25)` | Accent outer ring | |
| `accentShadow` | `rgba(59,130,246,0.18)` | Accent glow shadow | |
| `highlight` | `#60a5fa` | Bright accent text | `--highlight` |
| `highlightLight` | `#93c5fd` | Lighter accent text | |
| `highlightFaint` | `#dbeafe` | Faintest accent | |
| **Success (green)** | | | |
| `success` | `#34D399` | Success states | `--success` |
| `successMid` | `#4ade80` | Mid-green | |
| `successBright` | `#22c55e` | Bright green | |
| `successLight` | `#6ee7b7` | Light green text | |
| `successTextLight` | `#d1fae5` | Very light green text | |
| `successBg` | `rgba(52,211,153,0.08)` | Success fill | |
| `successBorder` | `rgba(52,211,153,0.2)` | Success border | |
| `successFaded` | `#34D39955` | Semi-transparent success | |
| `meeting` | `#10b981` | Meeting/calendar green | |
| **Warning (amber)** | | | |
| `warning` | `#FBBF24` | Warning states | `--warning` |
| `warningBg` | `rgba(251,191,36,0.08)` | Warning fill | |
| `warningBorder` | `rgba(251,191,36,0.2)` | Warning border | |
| **Danger (red)** | | | |
| `danger` | `#F87171` | Errors, rejections | `--danger` |
| `dangerBg` | `rgba(248,113,113,0.08)` | Danger fill | |
| `dangerLight` | `#fca5a5` | Light danger text | |
| `dangerBorderDark` | `#991b1b` | Dark danger border | |
| `dangerBorderDeep` | `#7f1d1d` | Deepest danger border | |
| **Purple** | | | |
| `purple` | `#8b5cf6` | AI features, Kassie | |
| `purpleLight` | `#a78bfa` | Light purple text | |
| `purpleChipBg` | `#312e81` | Purple chip fill | |
| `purpleChipText` | `#a5b4fc` | Purple chip text | |
| **Gold** | | | |
| `gold` | `#c8a84b` | Gold accents | `--gold` |
| `goldBg` | `#1a1608` | Gold section fill | |
| `goldBorder` | `#c8a84b55` | Gold section border | |
| **Kassie card** | | | |
| `kassieBg` | `#160a14` | Kassie card fill | |
| `kassieBorder` | `#4a1d3a` | Kassie card border | |
| `kassieLabel` | `#f0abfc` | Kassie label text | |
| `kassieText` | `#e9d5ff` | Kassie body text | |

### Typography

| Element | Value |
|---------|-------|
| Font family | `'DM Sans', system-ui, -apple-system, sans-serif` |
| Base size | 14–15px |
| Headings | 18–22px, weight 700 |
| Labels | 11–12px, uppercase, letter-spacing 0.08em |

### Component patterns

- **Cards:** `background: T.card`, `border: 1px solid ${T.border}`, `borderRadius: 10px`, `padding: 16px 18px`
- **Buttons (primary):** `background: T.accent`, `color: T.foreground`, `borderRadius: 8px`, `padding: 8px 16px`
- **Buttons (secondary):** transparent + `border: 1px solid ${T.borderInput}`, text matches accent color
- **Tab bar:** underline style, active tab `borderBottom: 2px solid ${T.accent}`
- **Modals:** full-screen overlay on mobile, centered panel on desktop; backdrop `T.overlay`
- **Morning Launchpad (v8.17+):** soft-gated 3-stage daily flow, lives at the top of the Focus tab between `KassieCard` and `TargetCompanyBoard`. Container `borderColor: T.urgencyBlueBg`; active stage `borderColor: T.accent` with `boxShadow: 0 0 0 1px ${T.accentRing}`; done stage `borderColor: T.successBorder` with `background: T.successBg`. Stage badges use the same accent triad (muted / accent / success). All headers clickable for non-linear browsing — the launchpad recommends, never locks. Sunday returns a single rest card.

---

## Voice & naming

| Rule | Value |
|------|-------|
| User-visible product name | Job Search HQ |
| Tone | Direct, practical, coach-like — no corporate buzzwords |
| Words to avoid | "leverage", "synergy", "touch base" (unless quoting user content) |
| Keywords to use | "pipeline", "research", "prep", "draft", "action queue" |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-04-14 | Initial `BRANDING.md` from template — WHI-37 |
| 2026-04-26 | v8.17 — added Morning Launchpad component pattern (3-stage soft-gated daily flow on Focus tab) |
| 2026-04-30 | Glass-card token sweep — all raw hex/rgba centralized into `src/tokens.js` (`T.*`); palette table updated to Command Blue actuals |
