# Job Search HQ

Your personal job-search command center. Track every company in your pipeline, manage contacts, prep STAR stories, and copy ready-made prompts for resume/cover/prep into ChatGPT or Claude — all in one fast, offline-first app.

**Live:** https://job-search-hq.vercel.app · **Product line:** Career Toolkit

## What it does

- **Pipeline tab** — track companies by stage (Research → Applied → Interview → Offer/Pass) with daily focus scoring
- **By Company view** — everything about one company on one screen: contacts, notes, timeline, next action
- **Contacts tab** — store people you've met, their role, warmth level, and follow-up reminders
- **Apply Tools tab** — copy-to-clipboard prompts for tailored resumes, cover letters, LinkedIn notes, and interview prep (use any external assistant)
- **Resources tab** — STAR story bank, salary research, and company research templates
- **Chrome extension** — capture LinkedIn profiles and job postings into your pipeline with one click, badge shows Action Queue count

## Tech

React CRA · localStorage (`chase_job_search_v1`) · Supabase sync (`job-search`) · Chrome MV3 extension in `extension/`

## Run locally

```bash
cd portfolio/job-search-hq
cp .env.example .env   # REACT_APP_SUPABASE_* for sync
npm install
npm start              # default CRA port 3000; see .claude/launch.json for 3001
npm run build
```

## Shared login configuration

Use canonical-host auth settings in `.env`:

- `REACT_APP_AUTH_CANONICAL_ORIGIN=https://apps.chasewhittaker.com`
- `REACT_APP_AUTH_APP_PATH=/job-search`
- `REACT_APP_SUPABASE_STORAGE_KEY=chase_portfolio_auth_token`

Supabase should allow redirects for the canonical app URL and local dev URL.

## Monorepo

Path from repo root: **`portfolio/job-search-hq`**. Keep `src/shared/sync.js` aligned with `portfolio/shared/sync.js`.

## Chrome extension (optional)

Load unpacked from **`extension/`** — LinkedIn profile/job capture into HQ and toolbar badge for Action Queue count. See [extension/README.md](extension/README.md).

## Docs

- [CLAUDE.md](CLAUDE.md) — structure, `constants.js`, Claude patterns, extension + import flow
- [PROJECT_INSTRUCTIONS.md](PROJECT_INSTRUCTIONS.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/LEARNING.md](docs/LEARNING.md)

## Project tracking

[Linear — Job Search HQ](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d)

[Portfolio monorepo migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37)

## Deploy

**https://job-search-hq.vercel.app** — Vercel **Root Directory:** `portfolio/job-search-hq`.
