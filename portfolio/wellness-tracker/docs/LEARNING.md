# Learning notes — Wellness Tracker

- **One blob:** Main state is a single JSON object in `chase_wellness_v1`; meds use a separate key.
- **OTP on iPhone:** Magic links often open Safari; in-app `verifyOtp` supports the installed PWA — see portfolio `CLAUDE.md` and Supabase Magic link template (`{{ .Token }}`).
- **Sync:** `save()` stamps `_syncAt`; `push` / `pull` mirror the shared portfolio pattern in `portfolio/shared/sync.js`.
