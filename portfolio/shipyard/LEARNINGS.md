# Learnings — Shipyard

## 2026-04-30 (Sidebar emojis + WIP ShipCard grid)

**Extracting a shared component mid-feature is the right call even when it costs a step.** `ShipCard` was inline in `page.tsx` — pulling it to `src/components/ShipCard.tsx` before wiring the WIP page added one step but eliminated a copy-paste. The `highlight` prop (gold border + eyebrow badge) extended the component cleanly without branching the layout.

**Absolute-positioned action buttons inside `<Link>` cards are invalid HTML and look broken.** First attempt overlaid WipActions at `absolute top-5 right-20` — this covered the project name because the `<Link>` is an `<a>` element and there's no valid way to nest a `<button>` inside it. Fix: render the action as a flex sibling *below* the card wrapper, right-aligned. No z-index tricks, no event-propagation hacks.

**Interview + mockup before plan for layout/UI tasks.** Asked 4 questions and drew ASCII mockups before writing a line of code. Surfaced key decision: "Cards, sort only" vs "Cards + drag grid" — user didn't know the difference until explained. The interview saved a dnd-kit refactor that would have been wrong.

> **Chase:**

## 2026-04-30 (Sailboat logo + page consistency pass)

**Design token migrations catch stragglers in components, not pages.** The bulk `sed` pass replaced tokens in every `app/**/*.tsx` file cleanly. The misses were in `components/` — `EditableField.tsx`, `ProjectPickerControls.tsx`, `RetireButton.tsx`. Rule: after any design-system token rename, always grep `components/` explicitly as a second pass.

**Typography floor enforcement matters.** Settings page had `text-[11px]` section headings — below the explicit `text-xs` (12px) floor documented in CLAUDE.md for dark navy backgrounds. The fix (`font-mono-label text-xs text-gold uppercase tracking-wider`) also added visual hierarchy that was missing.

**`ModeHeading` can't be used for data-driven headings.** It's a client component (needs `useLabel` hook). Ship detail page headings come from the database, so `ModeHeading` can't be used — apply the same CSS classes (`font-display font-bold text-4xl text-white gold-rule inline-block`) directly for visual parity.

**Logo iteration is faster with an in-repo HTML preview file.** `public/logo-options.html` with all variants at 4 sizes (96/56/36/24px) + sidebar mockup context let Chase evaluate and pick in one message. No round-trips to Figma, no uploading to external tools.

> **Chase:** —

## 2026-04-29 (Readability redesign + three-mode theme)

**A mockup rejection mid-plan is faster than a plan rejection post-implementation.**
First plan proposed token tweaks and font-size changes. Screenshot comparison showed the mockup was a full structural redesign (sidebar nav, hero panels, simplified cards). Catching the mismatch during plan review (before any code changed) cost 10 minutes; catching it after coding would have cost 3× more. Rule: always screenshot-compare the mockup against a live preview before exiting plan mode on visual tasks.

**`'use client'` boundary must be explicit when a Server Component child uses a hook.**
`StatsBar` was a Server Component but gained `useLabel()` (a context hook). Next.js threw a cryptic "hooks can only be called inside function components" error until `'use client'` was added. Pattern: any component that reads from React context (including ModeProvider) must be a client component, even if the data it shows comes from server props.

**Per-ship review tracking doesn't exist — `days_since_commit` is a pragmatic proxy.**
`review_cadence` is global (3 rows: weekly/monthly/quarterly) and tells you nothing about individual ship staleness. The ReviewsDuePanel needed per-ship signal; used `days_since_commit` sorted descending. This is documented in code. When real per-ship review tracking is built, the panel data source can be swapped without touching the component interface.

**GitHub push protection scans ALL commits in the push batch, not just HEAD.**
A raw Linear API key in an old checkpoint commit (`1c4400c`) blocked the entire push, even though that commit wasn't from the current session and the current commits contained no secrets. Fix: non-interactive rebase via `GIT_SEQUENCE_EDITOR` env var — set it to a script that edits the rebase todo list without opening a terminal. Then amend, continue, and force-push. The `GIT_SEQUENCE_EDITOR` trick also works in non-interactive contexts like Bash tool calls.

**Rotate any key that appears in a rebase-edited commit.**
Even after rewriting history to `REDACTED`, the original value may be in GitHub's secret-scanning cache or in any local clones. Rotate the key at the provider (Linear) immediately after a push-protection-triggered rewrite.

> **Chase:** A little bit of both — RCT is genuinely useful for when I'm in that headspace, but part of the appeal was proving the theme system could hold a third mode without extra complexity.

## 2026-04-29 (Daily links — Vercel rootDirectory monorepo fix)

**Monorepo CRA/Next.js apps on Vercel need an explicit redeploy from the subdirectory to fix rootDirectory.**
GMAT Mastery and Ash Reader were returning Vercel 404 ("The page could not be found") because Vercel was building from the repo root instead of `portfolio/<app>`. Both projects were linked to their respective Vercel projects but the rootDirectory configuration wasn't set. Deploying via `vercel --prod --yes` from inside each app's subdirectory automatically detects the app structure and updates the project settings. The fix is immediate and visible: builds change from 2-second empty builds ("Build Completed in /vercel/output [2s], no files prepared") to actual Next.js builds ("Running npm run build", successful page generation). **Lesson: if a Vercel app built from a monorepo returns 404, the rootDirectory is probably wrong — redeploy from the app's subdirectory, not from the repo root.**

> **Chase:** —

## 2026-04-26 (Analytics & Themes — heading fix + plain default + auto-populate)

**The nav label key and the page heading key are different things — don't reuse one for the other.**
The sidebar nav uses the short `charts` key (`"Analytics"` / `"Charts"`). The page heading needs the full phrase (`"Analytics & Themes"` / `"Charts & Constellations"`). Using one key for both would force the nav label to be long or the heading to be short. The fix is a separate `analyticsHeading` key in `labels.ts`. Rule: when a label appears in two contexts with meaningfully different length constraints, use two keys.

**`readMode()` had its fallback logic backwards — always verify the guard direction when flipping a default.**
The old implementation was `return stored === 'regular' ? 'regular' : 'nautical'` — which means "default to nautical unless explicitly set." To flip the default to plain, the guard needs to be inverted: `return stored === 'nautical' ? 'nautical' : 'regular'`. The `useMode()` fallback in `ModeProvider.tsx` also had a hardcoded `'nautical'` that needed updating. When flipping a default, grep for every place the old default appears — there may be more than one.

**Delete-then-insert is the right upsert strategy for auto-generated theme rows.**
The themes table mixes manual rows (`auto_generated = false`, e.g. the Portfolio Thesis) with scanner-generated rows (`auto_generated = true`). A naive upsert-by-slug would leave stale rows if a service or pattern was renamed. Instead: delete all `auto_generated = true` rows before each scan run, then bulk insert fresh ones. Manual rows survive because they're filtered out by the `WHERE auto_generated = true` delete. This pattern is safe as long as `auto_generated` is always set correctly.

**`preview_click` doesn't trigger React's synthetic event system in the headless preview harness.**
When verifying the ThesisEditor, `preview_click` on the button fired the DOM `click` event but React's `onClick` handler did not run. Workaround: use `preview_eval` to call `element.click()` directly, which goes through the browser's native dispatch and does propagate to React. This is a preview-harness issue only — real users click through the normal event system.

**`useTransition` is the right choice for server action calls in client components.**
`useState(isPending)` + a manual async handler works but blocks re-renders. `startTransition(async () => { await serverAction() })` keeps the UI responsive during the round-trip without any loading-state boilerplate. The pending state is already provided by `useTransition`, so no extra state is needed.

## 2026-04-21 (Decommission Ship + editable fields + clipboard dev link)

**`localhost:PORT` links only work when every project runs on a unique port — otherwise they're worse than nothing.**
Shipyard's amber `localhost:3000` anchor (shipped 2026-04-20) was technically correct but practically useless: every CRA and Next.js app in the portfolio defaults to port 3000, so clicking "Go to shipyard" on ship X opened whichever dev server happened to be running — never ship X. Fix: replace with a **clipboard-copy button** that puts `cd ~/Developer/chase/portfolio/<slug> && npm run dev` in the clipboard. Honest, one-paste, zero port-collision. Lesson: before shipping a UI affordance, trace a real user interaction through the environment — the link rendered correctly in isolation but broke the moment you thought about "which dev server is running."

**Management API refuses the Supabase service role key for DDL.**
The auto-apply path in `scripts/run-retirement-migration.ts` tries RPC `query` first, then falls through to `POST https://api.supabase.com/v1/projects/<ref>/database/query` with the service role key as a bearer token. That endpoint returns `401 JWT failed verification` — the Management API requires a Supabase **Personal Access Token**, not a project-scoped service role key. Workaround: keep the script's printed-SQL fallback and apply migrations manually in the SQL Editor. Alternative for future: store a PAT in `.env.local` as `SUPABASE_ACCESS_TOKEN` and route through that instead. Bottom line: DDL from code needs a PAT; DML works fine with service role.

**Next.js 16 / React 19: `preview_click` doesn't propagate to React's event delegation in the way you'd expect.**
When smoke-testing the `CopyDevCommand` button, a real `preview_click` fired the DOM `click` event but React's onClick handler did not run. Workaround: read the `__reactProps$*` key off the DOM node and invoke `onClick` directly. Good enough for smoke testing; production users click through the normal React event system so this only affects the headless preview harness.

**Editable fields don't need a framework — PATCH-per-field from client components is fine.**
`EditableStatus` (select) and `EditableText` (textarea) each own a tiny `useState` + `fetch('/api/ship/<slug>', { method: 'PATCH' })`. No React Hook Form, no mutation library, no optimistic reconciliation. The server component refreshes on the next navigation, and `router.refresh()` after save would be an option if we ever wanted liveness without a full reload. Simple wins at this scale.

## 2026-04-20 (local dev + Vercel access links)

**`supabase db query --linked` is the right escape hatch when psql isn't available.**
The Supabase client SDK has no `exec_sql` RPC by default — calling it returns PGRST202. `supabase db query` targets local Docker by default; `--linked` routes through the Supabase Management API instead. Useful for schema migrations in a sandboxed environment where the service role key is present but the DB host isn't directly reachable. The output comes back in a JSON envelope with a `boundary` warning field — safe to ignore.

**Port detection from `package.json` dev script is reliable enough for a personal dashboard.**
Most projects use the framework default port (Next.js 3000, Vite 5173, CRA 3000). The few that override it use the standard `-p PORT` flag. Regex `/(?:-p|--port)\s+(\d+)/` on the `dev` or `start` script catches explicit overrides; fall back to framework-sniffed defaults. No need to read `.env` or `.env.local` for ports — the `dev` script is the canonical place.

**Tailwind `text-gold` + `bg-gold` work for the amber local-URL dot without any extra config.**
The Shipyard brand token `gold` (`#D7AA3A`) reads well as a contrast color against the navy surface and visually separates "local dev" from the green "production live" indicator. No new color needed — the existing brand palette handled the distinction naturally.

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
