# HANDOFF — Wellness Tracker (web + iOS)

> Per-app session state. **Monorepo session routine** still uses repo-root [`HANDOFF.md`](../../HANDOFF.md) — update that file’s **State** when you stop, and keep *this* file in sync when work is Wellness-only.

---

## State

| Field | Value |
|-------|--------|
| **Paths** | Web: `portfolio/wellness-tracker/` · Native: [`../wellness-tracker-ios`](../wellness-tracker-ios/) |
| **Focus** | **Idea Kitchen foundation docs installed (2026-04-22).** PRODUCT_BRIEF, PRD, APP_FLOW, SHOWCASE produced and merged with existing BRANDING (Clarity tokens + sips commands + Xcode 1024 requirement preserved). Logos + iOS AppIcon shipped 2026-04-14 (`logo.svg`: WELLNESS small label / TRACKER large bold, accent `#4f92f2`). App is **local only** — Vercel project removed 2026-04-20. iOS companion built and installed on iPhone 12 Pro Max. |
| **Assets** | Web text logo: `public/logo.svg`, `public/favicon.svg`, `public/logo-wordmark.svg` · PWA PNGs: `logo192`, `logo512`, `apple-touch-icon` · iOS icon: `wellness-tracker-ios/.../AppIcon.appiconset/AppIcon.png` — see [docs/BRANDING.md](docs/BRANDING.md). |
| **Last touch** | 2026-04-28 — **Wellness iOS Phase 2 complete (6/6)**. Phase 2 #5 shipped: Tasks top-3 triage (date-scoped, auto-replenishment from waiting), one-thing / paralysis mode, collapsible Waiting + Done sections. New computed props + 4 mutation methods in [WellnessStore.swift](../wellness-tracker-ios/WellnessTracker/Services/WellnessStore.swift); [TasksTabView.swift](../wellness-tracker-ios/WellnessTracker/Features/Tasks/TasksTabView.swift) fully rewritten. 2 backward-compat tests added. Phase 2 #6 (live timer) already shipped same day. |
| **Next** | 1. **Wellness iOS Phase 3** — Budget + Wants, Growth logging. 2. **Split HistoryTab** (58 KB → analytics / export / AI summary). |

---

## Quick links

- [CLAUDE.md](CLAUDE.md) · [CHANGELOG.md](CHANGELOG.md) · [ROADMAP.md](ROADMAP.md) · [docs/BRANDING.md](docs/BRANDING.md)
- iOS: [../wellness-tracker-ios/CLAUDE.md](../wellness-tracker-ios/CLAUDE.md) · [../wellness-tracker-ios/HANDOFF.md](../wellness-tracker-ios/HANDOFF.md)

---

## Linear

[Wellness Tracker](https://linear.app/whittaker/project/wellness-tracker-36f4fb10e0e7)
