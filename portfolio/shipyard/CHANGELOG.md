# Changelog

## [Unreleased]

### Fixed — 2026-04-30 (Theme consistency audit)

- **WIP page full-width.** Removed `max-w-4xl mx-auto` constraint — card grid now matches dashboard full-width layout. `space-y-8` → `space-y-6` to match dashboard spacing rhythm.
- **Section heading size normalized.** "Past Decisions" heading on WIP page was `text-sm`; corrected to `text-xs` to match all other section labels on the page (`ACTIVE FOCUS`, `QUEUE`).

### Changed — 2026-04-30 (Sidebar emojis + WIP glass card grid)

- **Sidebar nav emojis.** Replaced Unicode glyphs (`◼ ▶ ★`) on the Fleet group with real emojis (`🚢 🔨 🏆`) to match the Work group (`📋 📚 📊`). Edit in `src/app/layout.tsx`.
- **`ShipCard` extracted to shared component.** Moved from inline in `page.tsx` to `src/components/ShipCard.tsx`. Accepts optional `highlight` prop that adds gold border + "Active Focus" eyebrow badge without crowding the header.
- **Dashboard trimmed to summary view.** Removed `FilterBar` and full ShipCard grid from the Fleet dashboard. Replaced with a "Recently Active" section showing 3 glass ShipCards (most recently committed, excluding active ship). Scoreboard, Wins, and review chips remain below.
- **WIP page rebuilt with ShipCard grid.** Flat `QueueRow` drag-list replaced with a 3-column `ShipCard` grid matching dashboard aesthetics. Sort controls (priority / last updated / money / MVP step / name) preserved. Drag-to-reorder removed. "Set as active focus" button sits below each card as a clean non-overlapping element.

### Removed — 2026-04-30

- `src/app/wip/QueueRow.tsx` — deleted; replaced by `ShipCard`
- `dnd-kit` drag-and-drop logic from `QueueList.tsx` — no longer needed

### Changed — 2026-04-30 (Sailboat logo + full page consistency pass)

- **Sailboat logo on gold background.** `src/components/LogoIcon.tsx` redesigned: gold rounded-rect (`rx="220"`) with dark navy sailboat icon (mast, mainsail, headsail, hull, keel, waterline wave). Replaces the original helm SVG. `src/app/icon.tsx` favicon updated to match at 32×32.
- **Full page consistency pass.** All pages now use the same glass-card design language as the homepage: `bg-surface/80 backdrop-blur-sm border border-dimmer rounded-2xl`. Covered ~25 files across pages and shared components.
- **`ModeHeading` for Settings + Linear pages.** Both pages had raw `<h1>` tags; now use the `ModeHeading` component (display font + gold-rule underline) to match every other page.
- **Ship detail heading upgraded.** Raw `text-2xl` heading replaced with `font-display font-bold text-4xl text-white gold-rule inline-block` to match the display-font style used on named pages.
- **`harborHeading` label key added.** `src/lib/labels.ts` now has `harborHeading` (`"Linear Sync"` / `"Harbor Master"` / `"Linear Sync"`) so the Linear page heading respects the theme toggle.
- **Settings section headings upgraded.** `text-[11px]` (below typography floor) → `font-mono-label text-xs text-gold uppercase tracking-wider`.
- **Token sweep across all files.** Eliminated all remaining `text-accent`, `border-border`, `bg-card`, `text-foreground`, `text-muted`, `hover:border-accent`, `focus:border-accent` references from `EditableField.tsx`, `ProjectPickerControls.tsx`, `RetireButton.tsx`, `CopyDevCommand.tsx`, `ThesisEditor.tsx`, `bridge/page.tsx`, `manifest/page.tsx`, `login/page.tsx`, and `portfolio/ShowcaseCard.tsx`.

### Added — 2026-04-29 (Readability redesign + three-mode theme system)

- **Three-mode theme system.** `ThemeMode` extended to `'regular' | 'nautical' | 'rct'`. Regular is now the primary mode; Nautical is secondary; Roller Coaster Tycoon (RCT) is the third. `src/lib/theme-mode.ts` validates all three via `VALID_MODES`. Settings page (`ThemeModeToggle`) shows 3 cards (Regular first). Each mode has full label coverage for every key.
- **New label keys.** `ships`, `shipsTitle`, `ship`, `shipTitle`, `activeShip`, `reviewsDue`, `launched`, `inProgressLabel`, `totalShips`, `openShip`, `fleetDashboard` — all theme-aware, used throughout the redesigned dashboard.
- **`DashboardHeading` component.** Replaces the old display-font eyebrow + `ModeHeading` pattern with a plain `h1` + subtitle showing `{total} {ships_noun} · last synced {relative}`. Fully theme-aware.
- **`ActiveShipPanel` component.** Fetches `wip_decisions` latest row, looks up the active project, renders a gold-accented featured card (pulsing green dot, compliance bar, meta line, CTA button). Shows empty state with `/wip` link when no pick exists.
- **`ReviewsDuePanel` component.** Shows top 4 active projects sorted by staleness (`days_since_commit` desc). Severity: ≥14d → Overdue (red), 7–13d → Due soon (amber), <7d → OK (green). Proxy until per-ship review tracking is built; documented in code.
- **Simplified sidebar nav.** Two grouped sections — FLEET (Dashboard / In Progress / Portfolio) + WORK (Review / Activity / Analytics) — with icons and section labels. Settings pinned to bottom. `NavItem` accepts an optional `icon` prop.
- **Simplified `StatsBar`.** 4-column grid: Total Ships / Launched / In Progress / Reviews Due. All labels theme-aware via `useLabel`. Removed: Under Construction, In Drydock, Compliance Avg cards.
- **Simplified filter bar.** Type-only chips with per-type counts and a Sort dropdown on the right. Removed family/status/Live-URL filters.
- **Simplified `ShipCard`.** Name + type pill + step line + status dot (Live/Local/No URL) + days-since-commit + compliance bar. Removed status badge, family chip, build/deploy line.
- **Trustworthy Blue + glassmorphism.** `bg-surface/80 backdrop-blur-sm` glass cards, gold accent border on active ship panel, gold gradient top bar.

### Removed — 2026-04-29
- `src/components/ShipCard.tsx` — orphaned; replaced by inline version in `page.tsx`
- `src/components/FilterBar.tsx` — orphaned; replaced by inline version in `page.tsx`
- `src/components/WipBanner.tsx` — replaced by `ActiveShipPanel`

### Added — 2026-04-26 (Analytics & Themes — heading fix + plain default + auto-populate + thesis editor)

- **`analyticsHeading` label key.** New entry in `src/lib/labels.ts` with plain `"Analytics & Themes"` and nautical `"Charts & Constellations"`. The old page heading was a hardcoded string; now driven by `ModeHeading` so the toggle actually works on this page.
- **Plain/regular mode as the new default.** `DEFAULT_MODE` in `src/lib/theme-mode.ts` flipped from `'nautical'` to `'regular'`. `readMode()` guard logic inverted so anything that isn't explicitly stored as `'nautical'` falls back to `'regular'` (was the reverse). `useMode()` fallback in `ModeProvider.tsx` updated to match.
- **Auto-populated Common Inputs + Cross-App Patterns.** `scripts/scan.ts` gained `ThemeCtx` interface, `SERVICE_RULES` (9 services: Supabase, YNAB, Gmail/Google OAuth, Claude/Anthropic API, Privacy.com, Vercel, Linear, Stripe, GitHub), `PATTERN_RULES` (8 stacks: Next.js+Tailwind+Supabase, SwiftUI+Observable+Supabase, SwiftUI+SwiftData+Keychain, CRA+localStorage, Apps Script+Sheets, Electron+React+TS, Python CLI, SwiftUI+local). Per-app `ThemeCtx` is built in the main scan loop; services + patterns detected via matcher functions; `buildThemeRows()` aggregates to one row per service/pattern with `project_slugs[]`. Upsert strategy: delete all `auto_generated=true` rows before each scan run, then bulk insert fresh rows (preserves manual thesis row). `themes_updated` counter now populated in scan row and summary log (was hardcoded `0`). First run inserted 15 theme rows.
- **Portfolio Thesis inline editor.** New `src/app/themes/actions.ts` server action (`updateThesis`) that upserts or deletes the `portfolio-thesis` slug row. New `src/app/themes/ThesisEditor.tsx` client component — click-to-edit pattern: static display with hover "edit" hint → textarea with ⌘+Enter save + Esc cancel. `useTransition` keeps the UI non-blocking during the server round-trip.

### Added — 2026-04-21 (Decommission Ship + editable detail fields + clipboard dev link)
- **Decommission Ship workflow.** New Danger Zone on Ship detail page with a confirmation modal that archives the project in Supabase, cancels its Linear project (if `LINEAR_API_KEY` is set), and surfaces remaining manual steps (`git mv`, root-CLAUDE.md updates). Also available as CLI (`npx tsx scripts/retire-project.ts <slug> [reason]`).
- **Supabase migration 0003.** Adds `retired_at timestamptz` + `retire_reason text` to `projects`. Apply once via Supabase SQL Editor (auto-apply via service role fails JWT verification against the Management API). The retire endpoint has a graceful fallback that archives status-only until the migration lands.
- **`src/lib/linear.ts`.** Reusable `cancelLinearProject(url)` helper; resolves by URL match and calls `archiveProject`. Used by both the API route and the CLI.
- **Editable Ship detail fields.** `EditableStatus` (select), `EditableText` (next_action textarea with `⌘+Enter` save), and `BlockerManager` (add / resolve) all PATCH via `/api/ship/[slug]` and `/api/ship/[slug]/blockers`. No page refresh needed.
- **Clipboard dev-link replacement.** The amber `localhost:PORT` anchor shipped 2026-04-20 was a dead link (every CRA/Next.js app defaults to port 3000, so clicking never reached the intended project). Replaced with `CopyDevCommand` — a gold-dot button that copies `cd ~/Developer/chase/portfolio/<slug> && npm run dev` to clipboard and flashes "Copied — paste in terminal" for 2s. Rendered in both the header and the Links section for any `type === 'web'` project.

### Added — 2026-04-20 (local dev + Vercel access links)
- **`local_port` on every ship.** New `integer` column in Supabase `projects` table. Scanner auto-detects the dev server port from each project's `package.json` dev script: explicit `-p PORT` / `--port PORT` flag wins; framework defaults fall back (Next.js → 3000, Vite → 5173, CRA → 3000); non-web types (`ios`, `desktop`, `cli`, `library`) get `null`.
- **Quick-access row on Ship detail.** Header now shows amber `localhost:PORT` dot-link alongside the green production URL so both access points are one click away. iOS/desktop ships show only what applies.
- **"Local :PORT" button in Links section.** Added next to GitHub / Vercel / Linear / Live so the local dev URL is also in the standard link strip.

### Fixed — 2026-04-20 (RSC boundary + smoke test)
- **`/portfolio` 500 fix.** `ShowcaseCard` and `LinkChip` were inline in the async Server Component `portfolio/page.tsx`. `LinkChip` had `onClick`, which RSC can't serialize — every request to `/portfolio` returned 500 in prod. Extracted both into `src/app/portfolio/ShowcaseCard.tsx` with `'use client'`.
- **Route smoke test.** Added `scripts/smoke.ts` (`npm run smoke`). Auto-discovers all routes under `src/app/**`, resolves `[slug]` from Supabase, curls each, exits 1 on any non-2xx. Use before `git push`; `BASE_URL=https://...` targets prod.

### Added — 2026-04-20 (Polish pass — all 7 pieces)
- **Contrast fix.** Lifted `--dim` (#346090 → #7AA6D6) and `--dimmer` (#141A4C → #2A3A7A) so nav text is legible against dark surface; grid stroke updated to rgba(122,166,214,0.18).
- **Gold nav separators.** `/` dividers between nav items changed from `text-steel` → `text-gold`.
- **Theme toggle (nautical ↔ regular labels).** `src/lib/labels.ts` central mapping, `src/lib/theme-mode.ts` hook, `ModeProvider` context, `/settings` page. Nav items, section headings, and MVP step labels all use `useLabel()`. Persists in `localStorage` (`shipyard_theme_mode`).
- **Fleet Showcase rebuild.** Filter changed from `mvp_step ≥ 5 + has_live_url` to `status != archived`. All ~38 apps visible. Cards show category pill, tagline, JTBD, tech pills, and Live/GitHub/Linear chips. iOS apps show "Local Xcode" badge. Each card links to `/portfolio/[slug]`.
- **Per-app design detail page.** `/portfolio/[slug]` server page: hero with icon (from `public/branding/`), tagline, links; About panel with category + full summary; Design System panel with palette swatches + font chips; Tech Details grid.
- **`build-branding.ts` prebuild script.** Walks `portfolio/*/docs/BRANDING.md`; extracts hex colors + known font families; copies AppIcon to `public/branding/<slug>/icon.png`; writes `src/data/branding.json`. Runs as `npm run build:branding`.
- **Drydock Gate — full queue + manual ranking.** Removed `mvp_step_actual = 4` filter; shows all active/stalled apps. Sort dropdown (Priority / Last Updated / MVP Step / Name) persists to localStorage. Active Focus ship pinned at top. `@dnd-kit` drag-to-reorder in Priority mode writes `priority_rank` via server action. `QueueList.tsx` + `QueueRow.tsx` client components; `actions.ts` server actions (`updateRanks`, `seedRanksByCommit`).
- **Category + tagline + summary per app.** Supabase migration adds three columns; sync script reads CLAUDE.md metadata table + `## What This App Is` from each app's CLAUDE.md. All 38 rows synced with category, tagline, summary, github_url, linear_project_url, live_url.
- **`## What This App Is` sections.** Added to all 33 portfolio app CLAUDE.md files.
- **`scripts/sync-projects.ts`.** Parses `### Portfolio metadata (Shipyard sync)` table from root CLAUDE.md; matches rows by name or derived slug (`SLUG_OVERRIDES` map for edge cases); upserts category, tagline, github_url, linear_project_url, summary, live_url into Supabase.

### Changed — 2026-04-20 (nautical rebrand)
- **Full brand system.** Replaced transitional palette + SY monogram with canonical 8-token set: bg `#07101E`, surface `#0C1A34`, white `#F2EEE6`, steel `#4A90DE`, gold `#D7AA3A`, dim `#346090`, dimmer `#141A4C`, ghost `#0D1A34`.
- **Typography.** Swapped Geist/Geist Mono for BigShoulders Bold (display), DM Mono Regular (labels), Instrument Sans Regular/Bold (body) via `next/font/google`.
- **Helm logo.** `src/components/LogoIcon.tsx` rewritten as inline SVG ship's helm (8 spokes, 4 cardinal handles, 4 steel dots). Exports `LogoIcon` + `LogoLockup`.
- **Favicon.** `src/app/icon.tsx` renders helm mark at 28×28 on `#07101E`.
- **Chart grid.** `.chart-grid` background utility — 40px horizontal rules in `--dimmer` across main content area.
- Removed all hardcoded hex values across pages; replaced with Tailwind token utilities (`bg-bg`, `text-white`, `border-dimmer`, `text-steel`, `text-gold`).

### Added — 2026-04-19 (auto-scan cron)
- **Nightly scanner via launchd.** New `scripts/scan-cron.sh` wrapper invoked by `~/Library/LaunchAgents/com.chasewhittaker.shipyard-scan.plist` at 3:00 AM local daily. Logs to `~/Library/Logs/shipyard-scan/scan.{log,err}`. Fleet data stays fresh without manual `npx tsx scripts/scan.ts` runs.
- First cron-triggered scan: 36 projects upserted in 10.5s, 0 errors.
- **Known pre-existing bug surfaced:** `learnings` upsert fails with "no unique or exclusion constraint matching the ON CONFLICT specification" — the scanner expects a `(project_slug, source, raw_source_ref)` unique constraint that the schema doesn't have. Projects still upsert cleanly; learnings ingestion remains an open Phase 2 item.

### Fixed — 2026-04-20 (auth / login debugging session)
- **Auth gate now actually runs.** `proxy.ts` was exporting `proxyConfig` instead of `config` — Next.js 16 requires `export const config` for the matcher to register, so the middleware was silently disabled. Renamed export to `config`, gate now intercepts every request as intended.
- **Empty dashboard root cause.** The deployed URL tracked in `CLAUDE.md` was an immutable 3-day-old pre-Phase-2 hash URL. Switched to the stable project alias `shipyard-iamchasewhittakers-projects.vercel.app`. The `projects` table had all 43 rows the whole time — the problem was never data, always auth + a stale URL.
- **Login swapped to email + password.** Magic-link / OTP flow was brittle on the shared Supabase project (`unqtnnxlltiadzbqpyhh`): redirect-URL whitelist conflicts across every portfolio app, and the email template was OTP-only. Replaced `src/app/login/page.tsx` with a plain `signInWithPassword` form. Owner user created manually in the Supabase Auth dashboard.
- Deployed to production alias 3x via `vercel --prod --archive=tgz`.

### Changed (superseded by 2026-04-20 rebrand)
- Sidebar logo replaced: anchor emoji → `LogoIcon` component (SY monogram, nautical blue `#1e3a5f`, P6 style)
- Added `src/components/LogoIcon.tsx` with sm/md/lg size variants
- Added `src/app/icon.tsx` dynamic favicon (32×32 nautical blue SY badge)

## [0.1.0] — 2026-04-16

Initial release.

- Next.js 15 (App Router) + TypeScript + Tailwind CSS scaffold
- Full Supabase schema: projects, blockers, scans, wip_decisions, review_cadence, reviews, learnings, themes
- 8 pages: Fleet dashboard, Ship detail, WIP/Drydock gate, Review flow, Captain's Log, Charts & Constellations, Fleet Showcase, Harbor Master
- Local scanner CLI (`scripts/scan.ts`) — scans ~/Developer/chase/portfolio and upserts to Supabase
- Seed script (`scripts/seed-from-audit.ts`) — one-time import from Apr 15 audit CSV
- 29 projects seeded from audit CSV; 28 live-scanned into Supabase
- Deployed to Vercel via GitHub auto-deploy (monorepo rootDirectory = portfolio/shipyard)
