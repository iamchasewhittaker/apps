# RollerTask Tycoon (web PWA — archived)

**Retired** — this **Vite + vanilla JS** PWA is no longer the maintained product. **Native iOS** RollerTask Tycoon lives at [`portfolio/roller-task-tycoon-ios`](../../roller-task-tycoon-ios) under the same monorepo. You may disable the Vercel deployment and trim Supabase redirect URLs if you no longer need this build.

---

# RollerTask Tycoon

**One-liner:** A **Windows-95–styled park to-do “tycoon”** you can **install on your iPhone home screen**; tasks and park cash **sync** via the same Supabase stack as Wellness Tracker and Job Search HQ.

**Monorepo (archived path):** `portfolio/archive/roller-task-tycoon` under [iamchasewhittaker/apps](https://github.com/iamchasewhittaker/apps) (`~/Developer/chase`).

## Portfolio snapshot

| | |
|---|---|
| **Problem** | Fun themed todos with no persistence or cross-device access. |
| **Approach** | Single-page vanilla JS + Vite; one `localStorage` blob; offline-first `push`/`pull` to shared `user_data` table; **email OTP** sign-in so the home-screen PWA gets a session (not only Safari). |
| **Stack** | Vite 6, vanilla ES modules, `@supabase/supabase-js`, Web App Manifest + Apple meta tags. |
| **Status** | **Archived** — historical reference only; prefer the iOS app above. |

## Quick links

| Doc | Purpose |
|-----|---------|
| [Linear — RollerTask Tycoon](https://linear.app/whittaker/project/rollertask-tycoon-ca86fd0bf771) | Launch / QA / backlog issues (team Whittaker) |
| [Linear — Portfolio monorepo migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37) | Path / Vercel root updates for this repo layout |
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
cd portfolio/archive/roller-task-tycoon
npm install
cp .env.example .env.local   # fill VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (same as other portfolio apps)
npm run dev                  # http://localhost:5175
```

Production build (Supabase is **inlined at build** — without env vars the bundle runs in localStorage-only mode):

```bash
npm run build
npm run preview
```

## Deploy (Vercel) — historical only

**Archived:** prefer disabling the Vercel project or pointing **Root Directory** at `portfolio/archive/roller-task-tycoon` only if you intentionally keep this build online.

**Production (if still live):** [https://roller-task-tycoon.vercel.app](https://roller-task-tycoon.vercel.app)

0. **Monorepo:** set Vercel **Root Directory** to `portfolio/archive/roller-task-tycoon` when deploying from `iamchasewhittaker/apps`.

1. **Environment variables** (Vercel → Project → Settings → Environment Variables): add **`VITE_SUPABASE_URL`** and **`VITE_SUPABASE_ANON_KEY`** for **Production** and **Preview** (same values as Wellness / Job Search), then **Redeploy** so the client bundle includes Supabase.
2. **Supabase** → Authentication → URL configuration: add `https://roller-task-tycoon.vercel.app` (and preview URLs if needed) to the redirect allowlist; ensure **Magic link** email template includes `{{ .Token }}` (see [CLAUDE.md](CLAUDE.md)).
3. On iPhone: open the live URL in Safari → Share → **Add to Home Screen**.

## License

See [LICENSE](LICENSE).
