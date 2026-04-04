# RollerTask Tycoon

**One-liner:** A **Windows-95–styled park to-do “tycoon”** you can **install on your iPhone home screen**; tasks and park cash **sync** via the same Supabase stack as Wellness Tracker and Job Search HQ.

## Portfolio snapshot

| | |
|---|---|
| **Problem** | Fun themed todos with no persistence or cross-device access. |
| **Approach** | Single-page vanilla JS + Vite; one `localStorage` blob; offline-first `push`/`pull` to shared `user_data` table; **email OTP** sign-in so the home-screen PWA gets a session (not only Safari). |
| **Stack** | Vite 6, vanilla ES modules, `@supabase/supabase-js`, Web App Manifest + Apple meta tags. |
| **Status** | Ready to deploy on Vercel (`VITE_SUPABASE_*` at **build time**). |

## Quick links

| Doc | Purpose |
|-----|---------|
| [Linear — RollerTask Tycoon](https://linear.app/whittaker/project/rollertask-tycoon-ca86fd0bf771) | Launch / QA / backlog issues (team Whittaker) |
| [CLAUDE.md](CLAUDE.md) | Project rules and context for AI assistants |
| [AGENTS.md](AGENTS.md) | Cursor/agent conventions |
| [docs/LEARNING.md](docs/LEARNING.md) | Concepts: PWA on iOS, OTP, sync |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Data flow and file map |
| [docs/CASE_STUDY.md](docs/CASE_STUDY.md) | Portfolio narrative (draft) |
| [CHANGELOG.md](CHANGELOG.md) | Release history |
| [ROADMAP.md](ROADMAP.md) | Planned work |
| [docs/adr/](docs/adr/) | Architecture Decision Records |

## How to run

```bash
cd apps/roller-task-tycoon
npm install
cp .env.example .env.local   # fill VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (same as other portfolio apps)
npm run dev                  # http://localhost:5175
```

Production build (Supabase is **inlined at build** — without env vars the bundle runs in localStorage-only mode):

```bash
npm run build
npm run preview
```

## Deploy (Vercel)

1. New Vercel project → set **Root Directory** to `apps/roller-task-tycoon` (or deploy from this folder if the repo is app-only).
2. **Environment variables** (Production + Preview): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — same values as Wellness / Job Search.
3. **Supabase** → Authentication → URL configuration: add your Vercel URL(s) to redirect allowlist; ensure **Magic link** email template includes `{{ .Token }}` so users receive a code (see [CLAUDE.md](CLAUDE.md)).
4. On iPhone: open the live URL in Safari → Share → **Add to Home Screen**.

## License

See [LICENSE](LICENSE).
