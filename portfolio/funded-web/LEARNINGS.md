# Learnings — Funded Web

> Mistakes, fixes, and "aha" moments captured from real sessions.
> **AI tools:** read this at session start alongside CLAUDE.md for project-specific gotchas.
> **Chase:** append an entry any time something goes wrong or clicks.

---

## Format

### YYYY-MM-DD — Short title
**What happened:** 1-2 sentences describing the problem or discovery.
**Root cause:** Why it happened — the non-obvious part.
**Fix / lesson:** What was done, or what to do differently next time.
**Tags:** gotcha | react | git | deploy | supabase | ynab | ...

---

## Entries

### 2026-04-16 — Monorepo path: `chase/portfolio`, not top-level `portfolio`
**What happened:** `cd portfolio/funded-web` from `~/Developer` failed — directory not found.
**Root cause:** The git monorepo root is `~/Developer/chase`; apps live under `chase/portfolio/<app>`, not `Developer/portfolio/<app>`.
**Fix / lesson:** From `~/Developer` use `cd chase/portfolio/funded-web`. Document in README/HANDOFF so deploy and local commands copy-paste cleanly.
**Tags:** monorepo · paths · gotcha

### 2026-04-16 — Supabase “Magic link” email default is link-only; OTP UI needs `{{ .Token }}`
**What happened:** User expected a 6-digit code in email; template only had a link (or no usable code in body).
**Root cause:** Supabase’s default Magic link template doesn’t show the OTP token unless you add `{{ .Token }}` to the HTML. The app calls `verifyOtp` with the typed code — same template as magic link per Supabase passwordless flow.
**Fix / lesson:** Dashboard → Authentication → Email Templates → Magic link → add a visible `{{ .Token }}` block. Keep `{{ .ConfirmationURL }}` if you want tap-to-open behavior. See [Passwordless email — With OTP](https://supabase.com/docs/guides/auth/auth-email-passwordless#with-otp).
**Tags:** supabase · auth · email · gotcha

### 2026-04-16 — No email at all: audit rows vs delivery
**What happened:** User received no mail; Auth UI labels don’t say “otp” explicitly.
**Root cause:** Delivery can fail (spam, rate limits, SMTP), or the client may hit the wrong project. Dashboard “Audit” naming varies by Supabase UI version.
**Fix / lesson:** After clicking Send, query `select created_at, payload from auth.audit_log_entries order by created_at desc limit 20` in SQL Editor. New rows mean Auth accepted the request; no rows suggests wrong URL/key or blocked request. Check spam; configure custom SMTP if built-in limits bite.
**Tags:** supabase · auth · ops

### 2026-04-16 — Google OAuth redirects to wrong domain after sign-in
**What happened:** After Google sign-in completed, Supabase redirected to `apps.chasewhittaker.com` (DNS error) instead of back to `funded-web.vercel.app`.
**Root cause:** Two things: (1) `signInWithOAuth` was passing `emailRedirectTo` (which resolves to `apps.chasewhittaker.com/ynab`) as the `redirectTo`. (2) Even after fixing to `window.location.origin`, Supabase ignored it because `funded-web.vercel.app` wasn't in the **Redirect URLs** allowlist. Supabase silently falls back to the configured Site URL when the `redirectTo` isn't whitelisted.
**Fix / lesson:** Two required steps for any OAuth provider: (1) In code, use `window.location.origin` (not `emailRedirectTo`) for the OAuth `redirectTo`. (2) In Supabase Dashboard → Authentication → URL Configuration → add the app's domain to **Redirect URLs** and ensure **Site URL** is correct. Without step 2, step 1 has no effect.
**Tags:** supabase · auth · oauth · google · gotcha

### 2026-04-16 — OAuth approval email from Supabase ≠ login code
**What happened:** Confusion between Supabase “OAuth Application Approval” (e.g. Cursor) and app sign-in email.
**Root cause:** Org-level OAuth notices are unrelated to end-user OTP mail for `signInWithOtp`.
**Fix / lesson:** Treat OAuth emails as account security; login codes only appear after Magic link template + successful Auth send.
**Tags:** supabase · auth · gotcha

### 2026-04-15 — `git mv` leaves node_modules behind
**What happened:** After `git mv portfolio/conto-web portfolio/funded-web`, the old `portfolio/conto-web/` directory still existed on disk containing only `node_modules/`.
**Root cause:** `git mv` only moves tracked files. `node_modules/` is gitignored so git never touched it — the directory stayed in place.
**Fix / lesson:** After any `git mv` of an app folder, manually `rm -rf` the old directory if it still exists. The contents will only be gitignored artifacts (node_modules, build/, .vercel/) — safe to delete.
**Tags:** git, gotcha, rename

### 2026-04-15 — Vercel project rename: create new project, don't rename old one
**What happened:** When renaming conto-web → funded-web on Vercel, created a new project (`vercel project add funded-web`) rather than renaming the existing `conto-web` project.
**Root cause:** Renaming a Vercel project changes the URL slug but the old project and its env vars remain in place; creating a new one gives a clean slate with the correct name from day one.
**Fix / lesson:** For app renames, `vercel project add <new-name>` → `vercel link` → `vercel git connect` → `scripts/vercel-add-env` → `vercel --prod`. The old Vercel project can be archived/deleted afterward. Storage keys and Supabase `app_key` don't change — only the project name and URL change.
**Tags:** deploy · vercel · rename
