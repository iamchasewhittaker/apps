# Session Start — Fix GitHub Actions CI: lockfile sync

Paste this into a new chat and say: *"Read CLAUDE.md and HANDOFF.md first."*

---

```
Read CLAUDE.md and HANDOFF.md first.

Goal: Fix the GitHub Actions CI failures across all 4 portfolio web apps at ~/Developer/chase.

## The problem

Every push to main triggers Portfolio web builds (.github/workflows/portfolio-web-build.yml).
All 4 jobs fail at `npm ci` with:

  npm error `npm ci` can only install packages when your package.json and
  package-lock.json or npm-shrinkwrap.json are in sync.
  Missing: yaml@2.8.3 from lock file

This is a lockfile drift issue — the package-lock.json in each app is out of sync with
the installed dependencies. Vercel builds independently and is unaffected, but the CI
check is broken on every push.

**Node/npm must match CI.** The workflow uses **Node 20** (see `node-version: "20"` in
`.github/workflows/portfolio-web-build.yml`). If you regenerate lockfiles with **Node 24
and npm 11**, `npm install` can still produce a lockfile that **passes local `npm run build`**
but fails on GitHub with `Missing: yaml@2.8.3 from lock file` (or similar) because **`npm ci`
on Node 20’s npm is stricter**. Use **Node 20’s `npm`** for the lockfile sync step (nvm,
fnm, Homebrew `node@20`, or a portable Node 20 tarball from nodejs.org).

## The fix

Run `npm install` (not `npm ci`) in each app directory **using Node 20’s npm** to regenerate
the lockfile, then commit all four updated lockfiles in one checkpoint.

## Apps to fix (4 total)

1. portfolio/wellness-tracker
2. portfolio/job-search-hq
3. portfolio/knowledge-base
4. portfolio/app-forge

## Steps

1. checkpoint (before touching anything — safety net)

2. Ensure your shell uses **Node 20** (same major as CI), then for each app run:
   cd portfolio/<app> && npm install

   This regenerates package-lock.json to match resolved deps from package.json.
   Do NOT run `npm install <package>` — just bare `npm install` to sync the lockfile.

3. Verify like CI does (recommended): from each app dir, with **Node 20** still active:
   rm -rf node_modules && npm ci && npm run build

   All four apps must complete cleanly before committing. (If you only run `npm run build`
   without `npm ci`, you can still miss lockfile issues that CI will catch.)

4. checkpoint to commit all 4 updated lockfiles in one go.

5. git push origin main — watch the GitHub Actions run at:
   https://github.com/iamchasewhittaker/apps/actions
   All 4 jobs should now go green.

## What NOT to do

- Don't upgrade any dependencies — this is a lockfile sync only, not an upgrade
- Don't run `npm audit fix` — that changes packages, not just the lockfile
- Don't touch the workflow file (.github/workflows/portfolio-web-build.yml)

## Verify

https://github.com/iamchasewhittaker/apps/actions — all 4 jobs should show ✓

## When done

No CHANGELOG/ROADMAP updates needed — this is infra maintenance, not a feature.
Update root HANDOFF.md Last touch if you want to record it.
```
