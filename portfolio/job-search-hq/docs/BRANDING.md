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

### Color palette

| Token | Hex | Use |
|-------|-----|-----|
| Background | `#0f1117` | Page background |
| Surface | `#1a1d27` | Cards, modals, panels |
| Border | `#2a2d3a` | Card borders, dividers |
| Text primary | `#e5e7eb` | Body text, headings |
| Text muted | `#9ca3af` | Labels, metadata, placeholders |
| Accent — blue | `#3b82f6` | Primary actions, active states, pipeline |
| Accent — purple | `#8b5cf6` | AI features, drafting, suggestions |
| Accent — green | `#10b981` | Success, offers, positive status |
| Accent — amber | `#f59e0b` | Warnings, follow-up reminders |
| Accent — red | `#ef4444` | Rejections, errors, destructive actions |

### Typography

| Element | Value |
|---------|-------|
| Font family | `'DM Sans', system-ui, -apple-system, sans-serif` |
| Base size | 14–15px |
| Headings | 18–22px, weight 700 |
| Labels | 11–12px, uppercase, letter-spacing 0.08em |

### Component patterns

- **Cards:** `background: #1a1d27`, `border: 1px solid #2a2d3a`, `borderRadius: 10px`, `padding: 16px 18px`
- **Buttons (primary):** `background: #3b82f6`, white text, `borderRadius: 8px`, `padding: 8px 16px`
- **Buttons (secondary):** transparent + border, text matches accent color
- **Tab bar:** underline style, active tab `border-bottom: 2px solid #3b82f6`
- **Modals:** full-screen overlay on mobile, centered panel on desktop
- **Morning Launchpad (v8.17+):** soft-gated 3-stage daily flow, lives at the top of the Focus tab between `KassieCard` and `TargetCompanyBoard`. Container `border-color: #1e3a5f` (dimmer accent blue); active stage `border-color: #3b82f6` with a 1px outer ring; done stage `border-color: #14532d` with `background: #0a1108`. Stage badges use the same accent triad (muted / blue / green). All headers clickable for non-linear browsing — the launchpad recommends, never locks. Sunday returns a single rest card.

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
