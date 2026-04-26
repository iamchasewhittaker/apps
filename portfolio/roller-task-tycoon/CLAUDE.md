# CLAUDE.md — RollerTask Tycoon

> **Voice brief:** This project follows Chase's voice rules — see [`identity/voice-brief.md`](../../identity/voice-brief.md). No em-dashes, no rule-of-threes, no hype, no consultant phrasing.


Instructions for AI assistants and humans working in this repo.

## What this project is

A **playful park-themed todo list** with Win95-era chrome, installable as a **PWA** on iPhone. **Supabase** stores one JSON blob per user (`tasks`, `cash`, `_syncAt`) in the shared portfolio `user_data` table, keyed by `app_key = roller_task_tycoon_v1`.

## What This App Is

A retired park-themed Vite PWA todo list with Win95-era chrome, tycoon point scoring, and Supabase sync — succeeded by the native RollerTask Tycoon iOS app for a fully on-device experience. Historical Supabase rows remain under `app_key = roller_task_tycoon_v1`; the archived source lives at `portfolio/archive/roller-task-tycoon/`.

## Behavior rules (for implementers)

1. **Offline-first:** Always update `localStorage` immediately, then `push()` in the background. Never block the UI on network.
2. **No Supabase in dev without env:** If `VITE_SUPABASE_*` are missing at **build** time, Vite inlines empty strings — the app runs in **localStorage-only** mode (`auth: null`, no login gate). This is intentional for local `npm run build` without secrets.
3. **iPhone home-screen session:** Use **email OTP** (`signInWithOtp` + `verifyOtp`); magic links opened from Mail often land in Safari, not the standalone PWA.
4. **Last-write-wins:** Whole-blob sync; avoid editing the same list simultaneously on two devices.
5. **Do not commit secrets:** `.env` / `.env.local` are gitignored; only `.env.example` is committed.

## Tech stack

- **Vite** 6 (vanilla template — no React)
- **@supabase/supabase-js**
- **Portfolio copy** of [`/portfolio/shared/sync.js`](../shared/sync.js) at `src/shared/sync.js` (real file, not symlink — Vercel-safe)

## Project layout

```
package.json
vite.config.js
vercel.json
index.html                 — shell + styles + auth overlay markup
public/
  manifest.json
  icon-192.png, icon-512.png, apple-touch-icon.png
src/
  main.js                  — game UI, persistence, auth gate, pull on load
  sync.js                  — APP_KEY + createSync(import.meta.env.VITE_*)
  shared/sync.js           — copy of portfolio/shared/sync.js
docs/
  LEARNING.md, ARCHITECTURE.md, CASE_STUDY.md
  adr/
CHANGELOG.md
ROADMAP.md
```

## When editing this repo

- **Small, focused changes** — one concern per commit when possible.
- After meaningful user-visible or structural changes: **CHANGELOG.md** under `## [Unreleased]`.
- Non-obvious technical choices: new **ADR** in `docs/adr/`.
- Update **docs/ARCHITECTURE.md** when data flow or modules change.
- Refresh **README.md** snapshot and **docs/CASE_STUDY.md** when the product story changes.

## Supabase email template (OTP code)

Dashboard → **Authentication** → **Email Templates** → **Magic link**. The default body may be link-only. Add the one-time token so users can type it in the PWA, e.g.:

`Your code: {{ .Token }}`

See [Supabase passwordless email / OTP](https://supabase.com/docs/guides/auth/auth-email-passwordless#with-otp).

## References

- Master portfolio: [`/CLAUDE.md`](../../CLAUDE.md) (repo root)
- Wellness OTP implementation: `wellness-tracker/src/App.jsx` (React; same auth semantics as `src/main.js` here)
