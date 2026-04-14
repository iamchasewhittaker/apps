# Ynab Clarity Web — Project Instructions

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions (monorepo root: `~/Developer/chase`).

## App Identity
- **Version:** v0.1
- **Storage key:** `chase_ynab_clarity_web_v1` (localStorage)
- **URL:** not yet deployed
- **Entry:** `src/App.jsx`

## Purpose
YNAB dashboard - web companion to ynab-clarity-ios

## Tech Stack
React CRA

## Commands
- `npm start` — dev server
- `npm run build` — production build

## Constraints
- Dark mode only (`#09090b` base) for web apps
- No TypeScript (React apps), no CSS modules, no Tailwind
- One feature per iteration. Ship, test, then move on.

## How to Extend
1. Read the ROADMAP.md before adding anything new.
2. Fill out docs/PRODUCT_BRIEF.md, docs/PRD.md, docs/APP_FLOW.md before building features.
3. If a feature changes the data shape, migrate existing data.
