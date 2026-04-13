# RollerTask Tycoon — planning workflow (iOS)

Use this when **scope grows** (new feature area, sync, widgets, major UX). Skip for tiny bugfixes and copy edits.

## Gate (before coding)

Do **not** start implementation until **Product Brief**, **PRD**, and **App Flow** in this folder reflect the change (or an explicit “delta” subsection added to each). For large technical bets, update **Technical Design** too.

The generic discipline lives in the monorepo **[iOS App Starter Kit](../../../../docs/ios-app-starter-kit/README.md)** — especially **`PRODUCT_BUILD_FRAMEWORK.md`** (phases 1–3).

## Read order (full pass)

1. [PRODUCT_BUILD_FRAMEWORK.md](../../../../docs/ios-app-starter-kit/PRODUCT_BUILD_FRAMEWORK.md) — skim phases; align with Park reality
2. [PRODUCT_BRIEF.md](PRODUCT_BRIEF.md)
3. [PRD.md](PRD.md)
4. [APP_FLOW.md](APP_FLOW.md)
5. [TECHNICAL_DESIGN.md](TECHNICAL_DESIGN.md)
6. [BACKLOG.md](BACKLOG.md) — slice into Linear issues
7. [QA_CHECKLIST.md](QA_CHECKLIST.md) — before merge / TestFlight
8. [RELEASE_PLAN.md](RELEASE_PLAN.md) — before external release

**Canonical blanks** stay in `docs/ios-app-starter-kit/`; **Park truth** is the copies in this folder.

## Session handoff (agents / humans)

- **Monorepo session state:** repo root [`HANDOFF.md`](../../../../HANDOFF.md) + app [`CLAUDE.md`](../../CLAUDE.md).
- **Project transfer** (different owner/repo): use kit [`HANDOFF_TEMPLATE.md`](../../../../docs/ios-app-starter-kit/HANDOFF_TEMPLATE.md), not root `HANDOFF.md`.

## Shipping habit

When a planning item becomes code: **Linear issue** (or update) with acceptance criteria + link to the filled doc section; on ship, **CHANGELOG** + **ROADMAP** in `portfolio/roller-task-tycoon-ios/`, and a row in repo root **ROADMAP.md** when the change is portfolio-visible.

**Web apps (Wellness, Job Search, Knowledge Base, App Forge):** push/PR may run **`.github/workflows/portfolio-web-build.yml`** (**Node 20**, `npm ci` then `npm run build`). Keep **`package-lock.json`** in sync — see repo **`docs/templates/SESSION_START_FIX_CI_LOCKFILES.md`**. (Archived Vite RollerTask PWA is not in CI.)
