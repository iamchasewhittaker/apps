# Learnings — Shipyard

## 2026-04-20 (nautical rebrand)

**`Big_Shoulders_Display` no longer exists in `next/font/google` — it's `Big_Shoulders` now.**
Google Fonts consolidated the family in late 2025. `next/font/google` updated its export list. Importing `Big_Shoulders_Display` throws a runtime "Unknown font" error with no helpful hint. Always verify against `node_modules/next/dist/compiled/@next/font/dist/google/font-data.json` when adding a new Google Font — the JSON is the ground truth.

**`vercel --prod` from a project subdirectory doubles the `rootDirectory` path.**
Running from inside `portfolio/shipyard/` with `rootDirectory = portfolio/shipyard` in Vercel project settings causes Vercel to resolve `portfolio/shipyard/portfolio/shipyard` — doesn't exist, deploy fails. Deploy via `git push origin main` instead; GitHub auto-deploy is the correct path for this monorepo project.

## 2026-04-20 (auth / login debugging session)

**Immutable Vercel deploy URLs go stale — always use the stable project alias.**
The `CLAUDE.md` entry pointed at a hash-specific URL (`shipyard-abc123-iamchasewhittakers-projects.vercel.app`) from a pre-Phase-2 deploy. That URL is frozen to that commit forever. Three days and several deploys later the "production" link in docs was pointing at old code with no auth gate and an earlier schema. Fix: **always link `shipyard-iamchasewhittakers-projects.vercel.app`** (the project alias). The alias rolls forward on every `--prod` deploy; hash URLs never do. Rule for the portfolio: no hash URLs in docs, ever.

**Next.js 16 `proxy.ts` requires `export const config` — not `proxyConfig`.**
The matcher only registers if the exported name is exactly `config`. I had named it `proxyConfig` (matching the function name `proxy`), which Next.js silently ignores — no error, no warning, middleware just never runs. Symptom: auth gate looked correct in code but every request reached the page unauthenticated. Fix: rename to `export const config = { matcher: [...] }`. The `proxy` function name is correct (v16 renamed `middleware` → `proxy`); only the config export name is fixed.

**Shared Supabase project + magic links = redirect URL whitelist hell.**
All portfolio apps share `unqtnnxlltiadzbqpyhh`. Supabase's redirect URL whitelist is project-wide, so every new app's magic-link callback has to be added there, and the default email template only sends the OTP code (not a link). For a single-user internal tool like Shipyard, **email + password is simpler and more reliable**: one user row, no redirect URL plumbing, no email template customization. Save magic links for multi-user consumer apps.

**The dashboard was never a data problem.**
Debugging walked through: "projects query wrong?", "RLS too tight?", "client not receiving data?" — none of it. The `projects` table had 43 rows the whole time. The empty screen was 100% auth (docs pointing at old deploy URL with no gate on a stale schema). **Lesson: when a dashboard is empty, verify the URL you're testing is the current deploy before chasing data bugs.**

## 2026-04-16 (Phase 1 build session)

**GitHub repo has a 10-project limit for git connections.**
Had to disconnect growth-tracker and roller-task-tycoon (retired) to make room for shipyard. Check `vercel git list` before connecting a new project — you may need to free a slot first.

**`vercel --prod` from a subdirectory conflicts with rootDirectory project setting.**
For monorepo projects where `rootDirectory` is set (e.g., `portfolio/shipyard`), Vercel ignores the local CWD and re-reads the project config. Pushing via git is the correct deploy path. `vercel --prod` from a subdirectory will either fail or deploy the wrong root.

**The audit CSV has more `type` values than expected.**
Values like `automation`, `infrastructure`, and `macos_app` were not in the initial type enum. Map them explicitly in the seed script or use a fallback to `"other"`. Unrecognized types cause Supabase insert errors if the column is constrained.

**`csv-parse` throws on rows with fewer columns than headers.**
Fix: pass `{ relax_column_count: true }` to the parser. Without it, any short row (trailing comma missing, blank fields at end) will throw and abort the entire import.

**Supabase shared project (`unqtnnxlltiadzbqpyhh`) works fine for Shipyard.**
No need to create a new Supabase project. The shared project already has the credentials in `.env.supabase` at the repo root. Just add the two `NEXT_PUBLIC_SUPABASE_*` env vars to Vercel for this project.

**Vercel env vars added via CLI for `preview` target silently fail when a duplicate key already exists for `production`.**
The CLI does not error — it just skips. Use the Vercel API `PATCH /v9/projects/{id}/env/{envId}` approach instead, or delete the conflicting var first and re-add with all targets specified.
