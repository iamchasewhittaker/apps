# Glossary — Chase monorepo & apps

Quick reference for terms that show up in docs, Vercel, Supabase, and Cursor. For layout and migration history see [MONOREPO_MIGRATION.md](../MONOREPO_MIGRATION.md), [DOCUMENTS_GIT_ARCHIVE_REMOVED.md](DOCUMENTS_GIT_ARCHIVE_REMOVED.md), and [LEGACY_LOCAL_MIRRORS.md](LEGACY_LOCAL_MIRRORS.md).

| Term | Meaning |
|------|--------|
| **Canonical repo** | **`~/Developer/chase`** — the git checkout you `push`/`pull`; remote **`github.com/iamchasewhittaker/apps`**. Open this folder as your Cursor workspace. |
| **Monorepo** | One git repository holding many apps and side projects (portfolio PWAs + `projects/*`), instead of a separate repo per app. |
| **`portfolio/`** | Deployable web apps: **`shared/`** (sync layer), **`app-hub/`**, **`wellness-tracker`**, **`job-search-hq`**, **`knowledge-base`**, **`app-forge`**; native **RollerTask Tycoon** at **`roller-task-tycoon-ios/`**; **`archive/`** (retired **growth-tracker**, archived **roller-task-tycoon** Vite PWA). |
| **`projects/`** | Lowercase. Non-portfolio worktrees: **AI Dev Mastery**, **ynab-enrichment**, **shortcut-reference**, **Money**, **`archive/`** (e.g. retired **claude-usage-tool**). Not the old **`~/Documents/Projects`** spelling. |
| **Root Directory** | Vercel project setting: subdirectory of the repo that contains **`package.json`** for that deploy (e.g. **`portfolio/wellness-tracker`**). Must match after a monorepo move. |
| **`APP_KEY` / `app_key`** | String that identifies which blob in Supabase **`user_data`** belongs to which app (e.g. **`roller_task_tycoon_v1`**, **`wellness`**, **`job-search`**). |
| **Blob sync** | Offline-first pattern: one JSON document per user per app in **`user_data`**, merged with **`localStorage`**; **`push`** / **`pull`** in the background. Implemented in **`portfolio/shared/sync.js`** (copied into each app as **`src/shared/sync.js`**). |
| **Offline-first** | UI reads/writes local storage immediately; cloud sync does not block the interface. |
| **OTP / magic link** | Supabase email sign-in; PWA on iPhone often needs the **code** in the email (**`{{ .Token }}`** in the template), not only the link. |
| **CRA** | Create React App — React + **`npm start`** / **`react-scripts`** (Wellness, Job Search, Knowledge Base, App Forge, archived Growth). |
| **Vite** | Faster dev/build tool; **RollerTask** uses **`VITE_*`** env vars (**`import.meta.env`**), not **`REACT_APP_*`**. |
| **PWA** | Progressive Web App — **`manifest.json`**, installable on iPhone home screen; service worker patterns vary by app. |
| **`localStorage` key** | Per-app storage namespace (e.g. **`chase_wellness_v1`**, **`chase_roller_task_v1`**). Do not rename shipped keys without a migration plan. |
| **Linear** | Issue/project tracker; Whittaker team; app backlogs + [Portfolio monorepo migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37). |
| **Wellness Tracker (deploy)** | Primary URL **`https://wellness-tracker.vercel.app`** (HTTP 200 as of 2026-04-15). CLI may also show **`https://wellness-tracker-kappa.vercel.app`**. Vercel project **`wellness-tracker`**, root **`portfolio/wellness-tracker`**. Typo project **`wellnes-tracker`** removed; **`wellnes-tracker.vercel.app`** returns 404 unless you add a redirect. |
| **Retired / archive** | **`portfolio/archive/growth-tracker`**, **`projects/archive/claude-usage-tool`** — kept for reference; Linear projects often **Canceled**. |
| **Git LFS** | Large File Storage — optional for big binaries (e.g. large GIFs) so GitHub does not warn about 50MB+ blobs. |
| **`http.postBuffer`** | Git config; increase if **`git push`** fails with HTTP 400 on a large pack (e.g. **`git config http.postBuffer 524288000`**). |
| **Local legacy mirror** | **`~/Developer/chase/projects/archive/from-documents-20260404/`** — optional on-disk copy of old **`~/Documents`** **`apps/`**, **`Projects/`**, **`growth-tracker-old/`**; **gitignored**, not in **`git clone`**. See [LEGACY_LOCAL_MIRRORS.md](LEGACY_LOCAL_MIRRORS.md). |
| **HANDOFF.md** | Repo-root **living** state for the **current thread** (branch, Linear, next steps, blockers). Update when switching agents or pausing; pair with [docs/templates/](templates/) session prompts. |
| **`docs/BRANDING.md`** | **Per-app** branding + icon checklist (optional but recommended). **Source:** copy [templates/PORTFOLIO_APP_BRANDING.md](templates/PORTFOLIO_APP_BRANDING.md) into the app once; link from that app’s `CLAUDE.md` so session prompts do not repeat hex codes or layout rules. |
| **Clarity iOS icon spec** | Shared geometry for Clarity suite launcher icons: [design/CLARITY_IOS_APP_ICON_SPEC.md](design/CLARITY_IOS_APP_ICON_SPEC.md). |
| **`portfolio-web-build.yml`** | GitHub Actions workflow at **`.github/workflows/portfolio-web-build.yml`** — **`npm ci && npm run build`** on **Node 20** for the four CRA apps above. **`package-lock.json`** must match **`package.json`** (regenerate with **Node 20’s npm**, not only newer Node). See [templates/SESSION_START_FIX_CI_LOCKFILES.md](templates/SESSION_START_FIX_CI_LOCKFILES.md). |

---

## AI / Machine Learning

| Term | Meaning |
|------|--------|
| **Token** | The smallest unit of text an LLM processes — roughly ¾ of a word. A 100K context window ≈ 75K words. Pricing is per-token. |
| **Context window** | The total amount of text (input + output) an LLM can handle in one conversation. Claude's is 200K tokens. When you exceed it, older messages get dropped. |
| **Prompt** | The text you send to an LLM. **System prompt** = instructions the model always follows. **User prompt** = the specific request. |
| **System prompt** | Hidden instructions that shape the model's behavior (tone, rules, constraints). Lives in CLAUDE.md files in this repo. |
| **Temperature** | Controls randomness: 0 = deterministic, 1 = creative. Code generation works best at 0–0.2. |
| **Hallucination** | When an LLM generates confident-sounding but factually wrong output — fake function names, nonexistent APIs, made-up IDs. |
| **Grounding** | Techniques to reduce hallucination by connecting LLM output to real data sources (RAG, tool use, allowlist filtering). |
| **RAG** | Retrieval-Augmented Generation — feed relevant documents into the prompt so the LLM answers from real data, not training memory. |
| **Embeddings** | Vector representations of text that capture semantic meaning. Used for similarity search ("find docs related to X"). |
| **Fine-tuning** | Training an existing model on your specific data to specialize its behavior. Expensive; usually RAG is better for most use cases. |
| **Few-shot** | Including 2–5 examples in the prompt to show the model the desired output format. More examples = more consistent format. |
| **Chain-of-thought** | Asking the model to "think step by step" before answering. Improves reasoning accuracy at the cost of more tokens. |
| **Tool use / Function calling** | LLM outputs structured JSON requesting a tool call (API, database, file read). The system executes it and feeds results back. |
| **MCP** | Model Context Protocol — Anthropic's open standard for connecting LLMs to external tools and data sources. Used by Claude Code for Supabase, Linear, Gmail, etc. |
| **Agent** | An LLM that can take actions (not just generate text): read files, run commands, make API calls, decide next steps. Claude Code is an agent. |
| **Prompt engineering** | The practice of crafting prompts to get better LLM output — structure, examples, constraints, role-setting. |
| **Structured output** | Forcing LLM to return JSON matching a schema (via Zod, JSON Schema). Prevents freeform text when you need data. |

---

## Development Architecture

| Term | Meaning |
|------|--------|
| **ADR** | Architecture Decision Record — a short document capturing what was decided, why, and what alternatives were considered. This repo uses a lightweight version in `DECISIONS.md`. |
| **Middleware** | Code that sits between a request and the final handler — authentication checks, logging, rate limiting. In Next.js: `middleware.ts` at the app root. |
| **Edge function** | Server code that runs at the CDN edge (closest to the user), not a central server. Vercel Edge Functions and Supabase Edge Functions use Deno. |
| **SSR** | Server-Side Rendering — HTML generated on the server per request. Good for SEO and dynamic content. Next.js App Router does this by default. |
| **SSG** | Static Site Generation — HTML generated at build time. Fastest possible load. Good for content that rarely changes. |
| **ISR** | Incremental Static Regeneration — SSG that can revalidate individual pages after deploy. Next.js-specific. |
| **Hydration** | The process of making server-rendered HTML interactive by attaching JavaScript event handlers on the client. "Hydration mismatch" = server and client HTML differ. |
| **ORM** | Object-Relational Mapping — a library that lets you query databases using code objects instead of raw SQL (Prisma, Drizzle). Supabase uses its own client SDK instead. |
| **Migration** | A versioned SQL file that changes the database schema. Supabase migrations live in `supabase/migrations/`. Applied via `supabase db push`. |
| **Webhook** | A URL that receives HTTP POST requests when an event happens in another system (e.g., Stripe sends a webhook when a payment succeeds). |
| **Monorepo** | One git repository holding many apps — this repo (`~/Developer/chase`) is a monorepo with 40+ apps in `portfolio/`. |
| **DDD** | Domain-Driven Design — structuring code around business domains (e.g., `billing/`, `auth/`, `inventory/`) rather than technical layers. |
| **CQRS** | Command Query Responsibility Segregation — separate models for reading data vs. writing data. Useful at scale; overkill for most apps. |
| **Event sourcing** | Storing every state change as an immutable event instead of just the current state. Powerful for audit trails; complex to implement. |
| **Idempotency** | An operation that produces the same result no matter how many times you run it. Critical for payment processing, cron jobs, and data migrations. This repo's migration guards use `isEmpty` checks for idempotency. |
| **DTO** | Data Transfer Object — a structure that maps to an external API's wire format, separate from your internal models. Isolates your code from API changes. See `RachioDTOs.swift` pattern. |

---

## DevOps / CI

| Term | Meaning |
|------|--------|
| **CI/CD** | Continuous Integration / Continuous Deployment — automated build + test + deploy on every push. This repo uses GitHub Actions (`.github/workflows/portfolio-web-build.yml`). |
| **GitHub Actions** | GitHub's CI/CD system. Workflows are YAML files in `.github/workflows/`. Each push triggers a build/test pipeline. |
| **Artifact** | A file produced by a CI build — compiled code, test reports, build logs. Not the same as a git artifact. |
| **Deploy preview** | A temporary URL for every pull request showing the changes before merging to production. Vercel creates these automatically. |
| **Environment variables** | Configuration values set outside the code (API keys, database URLs). `.env` files locally; Vercel dashboard for production. Never commit `.env` files. |
| **Secrets** | Sensitive environment variables (API keys, tokens, passwords). Stored encrypted in CI/CD systems. This repo uses `scripts/vercel-add-env` to manage them. |
| **Rollback** | Reverting a deployment to a previous version. Vercel supports instant rollback to any prior deployment. |
| **Blue-green deploy** | Running two identical environments (blue = current, green = new). Switch traffic when green is verified. Zero-downtime deploys. |
| **Canary deploy** | Rolling out a new version to a small percentage of users first, then gradually increasing. Catches issues before full rollout. |

---

## PM / Agile

| Term | Meaning |
|------|--------|
| **Sprint** | A fixed time period (usually 1-2 weeks) for completing a set of work. This repo uses informal sprints tracked in `ROADMAP.md`. |
| **Epic** | A large feature broken into smaller stories/tasks. In Linear, epics group related issues. |
| **Story points** | A relative estimate of effort (not time). Common scales: 1/2/3/5/8/13. Higher = more uncertainty. |
| **Velocity** | How many story points a team completes per sprint. Used to predict future capacity. |
| **Standup** | A brief daily meeting: what I did yesterday, what I'm doing today, any blockers. Solo version: HANDOFF.md updates. |
| **Retro** | Retrospective — end-of-sprint reflection: what went well, what didn't, what to change. Solo version: LEARNINGS.md entries. |
| **Backlog grooming** | Reviewing and prioritizing upcoming work items. Solo version: reviewing ROADMAP.md and deciding what's next. |
| **Acceptance criteria** | Specific conditions that must be true for a story to be considered "done." Prevents scope creep and ambiguity. |
| **Definition of Done** | Team-wide checklist for what "done" means: code reviewed, tests pass, deployed, docs updated. This repo's version is in ROADMAP.md per app. |
| **MVP** | Minimum Viable Product — the smallest version that delivers value. This repo's `PRODUCT_BUILD_FRAMEWORK.md` enforces MVP thinking. |
| **PRD** | Product Requirements Document — what the feature does, who it's for, and what's in/out of scope. This repo uses `docs/PRD.md` per app. |
| **Scope creep** | When features grow beyond the original plan. Anti-feature declarations in CLAUDE.md help prevent this. |

---

## Related files

- [LEGACY_LOCAL_MIRRORS.md](LEGACY_LOCAL_MIRRORS.md) — gitignored **`from-documents-20260404/`** bundle
- [templates/SESSION_START_MONOREPO.md](templates/SESSION_START_MONOREPO.md) · [templates/SESSION_START_APP_CHANGE.md](templates/SESSION_START_APP_CHANGE.md) — paste into a new chat
- [templates/SESSION_START_FIX_CI_LOCKFILES.md](templates/SESSION_START_FIX_CI_LOCKFILES.md) — **`npm ci` / lockfile** failures on portfolio web CI
- [templates/PORTFOLIO_APP_BRANDING.md](templates/PORTFOLIO_APP_BRANDING.md) · [design/README.md](design/README.md) — branding template + design index
- [templates/SESSION_START_CLARITY_IOS_LOGOS.md](templates/SESSION_START_CLARITY_IOS_LOGOS.md) — paste into a new chat to **fix or iterate** one **Clarity iOS** launcher (five-app suite shipped; see [`docs/design/README.md`](design/README.md))
- [CLAUDE.md](../CLAUDE.md) — master instructions for the portfolio
- [ROADMAP.md](../ROADMAP.md) — cross-app priorities and change log
- [AGENTS.md](../portfolio/wellness-tracker/AGENTS.md) (per app) — Cursor/agent conventions
