# Learnings — Job Search HQ

> Mistakes, fixes, and "aha" moments captured from real sessions.
> **AI tools:** read this at session start alongside CLAUDE.md for project-specific gotchas.
> **Chase:** append an entry any time something goes wrong or clicks.

---

## Format

### YYYY-MM-DD — Short title
**What happened:** 1-2 sentences describing the problem or discovery.
**Root cause:** Why it happened — the non-obvious part.
**Fix / lesson:** What was done, or what to do differently next time.
**Tags:** gotcha | react | git | deploy | supabase | python | api | ...

---

## Entries

### 2026-04-20 — `computeOfferTotal` annualizes sign-on to avoid first-year skew
**What happened:** Designing offer comparison, the naive "total comp = base + bonus + equity + signOn" makes the first offer with a big sign-on look better than a higher base over any realistic tenure.
**Root cause:** Sign-on is one-time; base/bonus/equity repeat each year. Adding raw sign-on inflates year 1 and creates bad comparisons once you're looking at "which offer is better long-term".
**Fix / lesson:** `computeOfferTotal(offer)` amortizes sign-on over 4 years (`signOnBonus / 4`) — same horizon equity is already annualized against. Returns `null` when base is missing so the UI falls back to `—` instead of a misleading `$0`. Document the formula directly in `OfferModal`'s preview block so the user sees the math.
**Tags:** data-model · finance · ux

### 2026-04-14 — iOS AppIcon should be full-bleed (no rx); web logo keeps rx
**What happened:** The web `logo.svg` uses `rx="96"` rounded corners per the portfolio template — those are intentional for browser/PWA display. The iOS AppIcon PNG however must be a full-bleed square with no corner radius; Apple applies its own squircle mask at render time.
**Root cause:** Two different rendering contexts: browser shows the SVG rect corners directly; iOS crops with its own mask regardless of what the PNG contains. Putting rx on the AppIcon source wastes the safe area and the mask alignment doesn't match.
**Fix / lesson:** Keep `rx="96"` in `public/logo.svg` (web). For the iOS icon, strip rx before rasterizing: `sed 's/rx="96" //' logo.svg > /tmp/icon.svg && qlmanage -t -s 1024 -o /tmp /tmp/icon.svg`. Copy result to `Assets.xcassets/AppIcon.appiconset/AppIcon.png`.
**Tags:** icons · svg · ios · deploy

### 2026-04-14 — `docs/templates/PORTFOLIO_APP_LOGO.md` is the source of truth for svg attributes
**What happened:** An earlier session removed `rx` rounded corners from the web logo as a "fix", but the portfolio template explicitly requires `rx="96"`. This created a drift between the template and the live file that had to be corrected.
**Root cause:** Logo SVG was edited without checking the canonical template. The template at `docs/templates/PORTFOLIO_APP_LOGO.md` specifies canvas size, rx value, font-family, font-size, letter-spacing, and positioning. Deviating from it causes visual inconsistency across apps.
**Fix / lesson:** Before editing any logo SVG, read `docs/templates/PORTFOLIO_APP_LOGO.md` first. Treat it as the single source of truth — don't remove or change attributes unless you're also updating the template.
**Tags:** icons · svg · tooling · gotcha

### 2026-04-13 — Extension imports need the authenticated shell
**What happened:** Opening Job Search HQ with `?importContact=` while the login screen was showing meant import state never reached the contact/application modals.
**Root cause:** URL import ran on first mount before session was resolved; the main app tree (modals) is not mounted until after Supabase auth.
**Fix / lesson:** Run bookmarklet/extension import consumption in a `useEffect` gated on `session` being ready (and `hasLoaded`), then strip query/hash with `replaceState`.
**Tags:** chrome-extension · supabase · auth · react

### 2026-04-13 — Analytics should use closed outcomes only
**What happened:** Win/loss analytics needed to reflect final outcomes without being skewed by active pipeline stages.
**Root cause:** Including non-final stages in outcome percentages distorts conversion signals and under-represents true offer/reject rates.
**Fix / lesson:** Compute outcome analytics from closed stages only (`Offer`, `Rejected`, `Withdrawn`) and show percentages against that closed total.
**Tags:** analytics · data-model · ux

### 2026-04-13 — JSON-first AI output is more stable for structured editors
**What happened:** STAR story drafting needed to populate multiple editable fields rather than one text blob.
**Root cause:** Freeform AI output requires brittle parsing and slows user edits when each section should remain independently editable.
**Fix / lesson:** Prompt Claude for strict JSON shape and parse into normalized story fields; keep a fallback path for malformed output.
**Tags:** ai · prompts · data-model

### 2026-04-13 — Safer migration path for prep model changes
**What happened:** Interview prep moved from one `prepNotes` string to sectioned prep data, but existing saved apps already had legacy prep text.
**Root cause:** Directly switching fields would hide prior prep content for existing users unless migrated at hydration time.
**Fix / lesson:** Add normalization helpers (`normalizePrepSections`, `normalizeApplication`) and hydrate old `prepNotes` into a section (`roleAnalysis`) so historical prep remains visible.
**Tags:** react · migration · data-model

### 2026-04-13 — Follow-up nudges need explicit status guard
**What happened:** Cadence nudges became noisy unless they only targeted contacts with outreach already sent.
**Root cause:** Day-based follow-up logic without status filtering can surface reminders for contacts who haven't been messaged yet.
**Fix / lesson:** Gate day 3/day 7 nudges behind `outreachStatus === "sent"` plus a valid `outreachDate`, then escalate message tone by threshold.
**Tags:** react · ux · data-model

### 2026-04-13 — Style key collisions trigger ESLint warnings
**What happened:** `npm run build` flagged `no-dupe-keys` after adding new FocusTab outreach styles because `s.outreachBadge` already existed for contact cards.
**Root cause:** The shared `s` style object is large; adding similarly named keys can silently collide until lint/build runs.
**Fix / lesson:** Use feature-specific key names (`outreachCountBadge` vs existing contact `outreachBadge`) and always run a build immediately after adding style tokens.
**Tags:** react · lint · styles

### 2026-04-13 — SVG favicon rendering on macOS
**What happened:** `qlmanage -t -s 512` produces clean PNG renders from SVG files on macOS without needing ImageMagick, rsvg-convert, or any npm packages.
**Root cause:** qlmanage is the Quick Look thumbnail generator — it's on every Mac and handles SVG natively.
**Fix / lesson:** For SVG → PNG conversion in this monorepo, use `qlmanage -t -s <size> -o /tmp <file>.svg && cp /tmp/<file>.svg.png dest.png`. Then `sips -z H W` for resizing.
**Tags:** tooling · icons · svg

### 2026-04-14 — Vercel CLI doubles path when rootDirectory is set + CI kills ESLint warnings
**What happened:** `vercel --prod` from inside `portfolio/job-search-hq/` failed with "path does not exist" — path was being doubled (`portfolio/job-search-hq/portfolio/job-search-hq`). Also, a pre-existing `no-unused-vars` warning in FocusTab caused the Vercel CI build to fail (Vercel sets `CI=true`, which makes CRA treat warnings as errors).
**Root cause:** The Vercel project has `rootDirectory: "portfolio/job-search-hq"` configured for GitHub auto-deploy. Running the CLI from inside that subdirectory appends the rootDirectory on top of the cwd, doubling it. The unused `handleQuickAdd` function was harmless locally but fatal in CI.
**Fix / lesson:** For this project, always run `vercel --prod` from the **monorepo root** (`~/Developer/chase/`) with a temp `.vercel/project.json` pointing at the job-search-hq project ID. Remove the temp file after deploying. And fix all ESLint warnings before deploying — Vercel CI has zero tolerance.
**Tags:** deploy · vercel · lint

### 2026-04-18 — Pillow can't do fill="none" — simulate outline text with fill=BG
**What happened:** Wanted stroke-only ("outline") logo text in the iOS brand asset generator. SVG supports `fill="none" stroke="white"` natively, but Pillow's `ImageDraw.text()` doesn't have a fill=none mode.
**Root cause:** Pillow renders text as filled glyphs; stroke_width just adds an outline around the fill. There's no built-in way to suppress the fill.
**Fix / lesson:** Simulate outline by drawing text with `fill=BG_COLOR` (same as background) and `stroke_fill=WHITE, stroke_width=N`. The letter interior blends with the background, leaving only the white stroke visible. Works well for thick-stroke designs; breaks if there are background gradients or images behind the text.
**Tags:** python · pillow · icons · ios · svg

### 2026-04-18 — HTML mockup files are the right review tool for logo design choices
**What happened:** User wanted to pick a logo color/style without going back and forth on described options.
**Root cause:** Logo aesthetics are subjective — text descriptions of colors don't translate well.
**Fix / lesson:** Generate a standalone `design/logo-mockup.html` file with all options rendered as inline SVG. User picks by visual review before any code is committed. Two rounds (colors first, then styles) worked well. Keep mockup files in `design/` for reference.
**Tags:** design · workflow · svg

### 2026-04-13 — FocusTab needs app/contact data props from App.jsx
**What happened:** FocusTab previously only received `completedBlocks` / `expandedBlock` state. Adding the action queue required passing `applications`, `contacts`, `setAppModal`, `setPrepModal`, `setTab` from App.jsx.
**Root cause:** The queue is derived from live data, not persisted state — it belongs in FocusTab as computed logic.
**Fix / lesson:** Any new feature on FocusTab that reacts to pipeline/contacts data needs those arrays threaded through from App.jsx. The shell owns the data; tabs derive from it.
**Tags:** react · architecture · props
