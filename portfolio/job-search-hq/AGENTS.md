# AGENTS.md — Job Search HQ

Read with [CLAUDE.md](CLAUDE.md) and portfolio master [`/CLAUDE.md`](../../CLAUDE.md) (repo root).

## Scope

Work in **`portfolio/job-search-hq`** unless told otherwise.

## Conventions

1. Prefer adding logic to `constants.js` or tab/components — keep `App.jsx` as shell.
2. Use `callClaude` / `handleClaudeCall` patterns from `constants.js` for AI calls.
3. Update [CHANGELOG.md](CHANGELOG.md) under `## [Unreleased]` for shipped changes (include **`extension/`** when the Chrome package changes).
4. Keep `src/shared/sync.js` aligned with [`portfolio/shared/sync.js`](../shared/sync.js).
5. Extension docs live in [extension/README.md](extension/README.md); web copy in Resources tab points there.
6. **iOS companion** lives in [`../job-search-hq-ios/`](../job-search-hq-ios/); milestone releases that affect the product story belong in this `CHANGELOG.md` under `## [Unreleased]` as well as the iOS app’s own `CHANGELOG.md`.

## Project tracking

- **App:** [Linear — Job Search HQ](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d)
- **Monorepo migration:** [Linear — Portfolio monorepo migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37)
