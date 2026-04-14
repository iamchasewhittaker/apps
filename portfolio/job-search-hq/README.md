# Job Search HQ

Personal job-search command center (Create React App): pipeline, contacts, prep, and Claude-powered drafts. Data in `chase_job_search_v1`; Anthropic API key in `chase_anthropic_key`. Optional Supabase sync (`app_key` `job-search`).

## Run locally

```bash
cd portfolio/job-search-hq
cp .env.example .env   # REACT_APP_SUPABASE_* + use in-app API key UI for Claude
npm install
npm start              # default CRA port 3000; see .claude/launch.json for 3001
npm run build
```

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
