# Learnings — RollerTask Tycoon (web PWA)

## 2026-04-20 — Vercel build failures: vite in devDependencies

**What happened:** Repeated failed production deployment emails from Vercel. Every cloud build failed in ~8 seconds with `sh: line 1: vite: command not found` (exit code 127).

**Root cause (two layers):**
1. Vercel sets `NODE_ENV=production` during cloud installs. npm skips `devDependencies` when NODE_ENV=production. Since `vite` was in `devDependencies`, it was never installed, so the build command `vite build` failed immediately.
2. A poisoned build cache (created from the very first production install without devDeps) was being restored on every subsequent push — causing Vercel to skip the install step entirely, so even adding `installCommand` to `vercel.json` had no effect until the cache was busted.

**Fix applied:**
- Moved `vite` from `devDependencies` → `dependencies` in `package.json` (survives any NODE_ENV)
- Added `"installCommand": "npm install --include=dev"` to `vercel.json` (belt-and-suspenders)
- Ran `vercel deploy --force --prod` to bypass the stale cache and seed a clean one

**Lesson:** For Vite projects on Vercel, `vite` MUST be in `dependencies`, not `devDependencies`. The `installCommand` override is a valid secondary guard but is silently skipped when a build cache exists. If builds fail despite config fixes, force-deploy once to clear the cache.

**Applies to:** Any Vite app in this portfolio deployed to Vercel (currently only this one — others are Next.js/CRA which Vercel handles differently through framework presets).
