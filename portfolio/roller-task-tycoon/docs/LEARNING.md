# Learning guide

Read this alongside building or extending the app.

## Suggested order

1. **Vite + vanilla** — `import.meta.env`, `npm run dev` vs `npm run build`, where env vars are inlined at build time.
2. **PWA on iOS** — `manifest.json` (`display: standalone`), **Add to Home Screen**, `apple-mobile-web-app-capable`, status bar style.
3. **Safari vs standalone storage** — separate `localStorage`; why **magic links from Mail** often complete only in Safari.
4. **Supabase passwordless** — `signInWithOtp` + `verifyOtp({ type: 'email' })`; email template must expose `{{ .Token }}` for typing the code in-app.
5. **Portfolio sync layer** — `push` / `pull`, `user_data` table, `app_key`, `_syncAt` last-write-wins.

## Glossary

| Term | Meaning |
|------|---------|
| **PWA** | Progressive Web App — manifest + (optional) service worker; installable from browser. |
| **Standalone** | Display mode where the app runs without Safari URL chrome (home-screen icon). |
| **OTP** | One-time passcode from email; typed into the app to complete sign-in. |
| **`app_key`** | String separating blobs in `user_data` for different apps (same Supabase user). |
| **`_syncAt`** | Client timestamp (ms) stored in the JSON blob; compared to server `updated_at` on pull. |
| **ADR** | Architecture Decision Record — short memo of why we chose X over Y. |

## Debugging tips

- **Build has no sync:** Local `npm run build` without `VITE_SUPABASE_*` produces a bundle with empty env → stub sync. Set vars in Vercel for production, or use `.env.local` locally before building.
- **“Invalid code” on verify:** Confirm email template includes the token; check spam; resend after 45s cooldown.
- **Data not appearing on second device:** Confirm both devices signed in with the same email; check Supabase **Table Editor** → `user_data` for your `user_id` + `roller_task_tycoon_v1`.
- **Safe area:** If the taskbar overlaps the home indicator on a specific device, tweak `env(safe-area-inset-bottom)` in `index.html` styles.

## Where this is implemented

See [ARCHITECTURE.md](ARCHITECTURE.md). Auth and sync wiring live in `src/main.js` and `src/sync.js`.
