# Portfolio monorepo — AI coding rules (Codex / OpenAI Agents)

> Repo root: `~/Developer/chase`. Source of truth: `CLAUDE.md` + `HANDOFF.md`.
> Paste this file's content plus `HANDOFF.md` State table into your context at session start.

## Before any task
1. Read **`CLAUDE.md`** (repo root) — full conventions.
2. Read **`HANDOFF.md`** (repo root) — current session state and focus.
3. Read the **app's own `CLAUDE.md`** if working inside `portfolio/<app>/`.

## Tech stack
- **Most apps:** React CRA + inline styles (`s` object) + localStorage. **No TypeScript, no Tailwind, no CSS modules, no component libraries (MUI, Chakra, etc.).**
- **Exceptions:** `portfolio/shipyard` = Next.js 15 + TypeScript + Tailwind. `portfolio/claude-usage-tool` = Electron + TypeScript.
- Package manager: npm for CRA apps; use whatever the app already uses.
- No Redux, no external state libraries. **Offline-first.** Supabase is the only cloud sync path.

## Storage keys
- Every app owns exactly **one** named localStorage key (e.g. `chase_wellness_v1`).
- **Never add new keys** without updating the storage key table in root `CLAUDE.md`.
- **Never rename existing `STORE` constants** — real user data depends on them.

## Component pattern (Wellness + Job Search)
- `App.jsx` is the shell: state, load/save effects, data helpers, modal renders, nav.
- Tabs are dumb — receive state + setters as props, own no persistent state.
- `ErrorBoundary` wraps every tab render.
- Styles live in a single `s` object (Job Search) or `T` tokens (Wellness).

## Never commit (repo is public on GitHub)
- Real financial data: income amounts, balances, spending history, debt figures
- API tokens, passwords, OAuth refresh tokens, or `.env` files
- Employer names with salary context; bank/lender names tied to real account details

## After every session — mandatory
1. `scripts/checkpoint` (or `git add -A && git commit`)
2. Update app **`CHANGELOG.md`** — log what changed under `## [Unreleased]`
3. Update app **`HANDOFF.md`** — State, Next, Last touch
4. Update app **`LEARNINGS.md`** — at least one line (mistakes, fixes, aha moments)
5. Post a brief comment on the app's **Linear project** (link in root `CLAUDE.md` portfolio table)

## Session handoff
- **End of session / switch agent:** update `HANDOFF.md` State table at repo root.
- **New chat:** paste `CLAUDE.md` intro + `HANDOFF.md` State table + this file into the prompt. Say *read `CLAUDE.md` and `HANDOFF.md` first*.
- **Shipped work:** Linear + git commits = truth; `HANDOFF.md` = resume context only.
- When Chase says **"update docs"**: update app + root docs (CHANGELOG, HANDOFF, LEARNINGS, ROADMAP).

## Mission
> "For Reese. For Buzz. Forward — no excuses."
