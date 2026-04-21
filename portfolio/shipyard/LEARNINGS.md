# Learnings — Shipyard

## 2026-04-20 (RSC boundary fix + smoke test)

**Event handlers in Server Component files cause silent 500s that survive `next build` and `vercel --prod`.**
`LinkChip` had `onClick={(e) => e.stopPropagation()}` but was defined inline in an `async` Server Component (`page.tsx`). RSC can't serialize event handlers across the server/client boundary. `next build` passes cleanly, Vercel deploys successfully, then every request to `/portfolio` returns 500. The only clue is the dev log at `.next/dev/logs/next-development.log` (or Vercel function logs in prod). Fix: any component with `onClick`, `useState`, or `useEffect` must live in its own file with `'use client'` at the top — never inline in a server `page.tsx`.

**`postbuild` can't run a smoke test in the Vercel build environment.**
Running `next start` inside a Vercel build container doesn't work — there's no persistent server to curl against. The right place for route smoke tests is local (pre-push) or as a Vercel deploy hook / GitHub Actions step that targets the preview URL. Wired as `npm run smoke` only; left `postbuild` alone.

**`npm run smoke` is the fastest way to catch RSC violations and missing routes before push.**
`scripts/smoke.ts` auto-discovers every route under `src/app/**`, resolves `[slug]` to a real Supabase slug, and curls each one. `BASE_URL=https://... npm run smoke` works against prod too. Add it as a pre-push habit: `npm run dev` in one shell, `npm run smoke` in another before `git push`.

## 2026-04-20 (Phase 2 polish — typography + service role)

**`.chart-grid` lined-paper background was polluting every page.**
The repeating horizontal-rule background lived on `<main>` in `layout.tsx` and on `.chart-grid` in `globals.css`. It looked cute in isolation but behind actual data tables/cards it made everything feel noisy and hard to scan. Removing both the CSS class and the `<main className="chart-grid">` usage immediately cleaned up the UI. Decorative page backgrounds fight content density — default to a plain surface and add texture only where it serves the data.

**10-11px type is unreadable on dark navy backgrounds.**
Nav items at 11px, stats at `text-3xl`, body/badges at 10px — it all looked fine in light mode mockups but on the actual navy-cream palette it was squint-inducing. The right baseline for this app: nav `text-sm`, stats `text-4xl`, body/badges `text-xs`/`text-sm`. Rule: when the bg contrast is high and the palette is limited, size up one step from what feels "right" in isolation.

**`ModeHeading` is the right pattern for all page headings.**
Review, Log, and Drydock Gate each had their own heading treatment. Standardizing on a single `<ModeHeading labelKey="..." />` component (Big Shoulders display font, `text-4xl`, gold-rule underline) gives every page the same visual anchor and lets the mode provider swap nautical/plain labels in one place. Lesson: any heading that shows a label from the label system should go through the shared component — no exceptions.

**Supabase RLS + anon key silently returns empty rows when no session exists.**
The server was calling `supabase.from('projects').select('*')` with the anon key. No error, no warning — just `[]`. RLS policies require a session, and `middleware.ts` is a no-op stub so no session cookie is set. Fix: the server client in `src/lib/supabase.ts` now reads `SUPABASE_SERVICE_ROLE_KEY` instead. Service role bypasses RLS and is safe as long as the module is never bundled into client code (it isn't — browser code uses `supabase-browser.ts`). For a single-user personal dashboard this is simpler than wiring real auth.

**`middleware.ts` with empty `matcher: []` is a no-op.**
The auth logic lives in `proxy.ts`, but Next.js only registers `middleware.ts` as middleware. `proxy.ts` was never invoked, which is why requests were reaching pages unauthenticated. With `matcher: []` the no-op middleware matches nothing and the proxy is dormant. The right fix for "why isn't my middleware running?" is to verify the file name and the matcher — not to chase the logic inside.

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
