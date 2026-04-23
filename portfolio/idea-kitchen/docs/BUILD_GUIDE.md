# Build Guide — The Idea Kitchen Workflow

> Read this end-to-end once. After that, skim it for the sections you need.

---

## 1. Why this system exists

Before Idea Kitchen, every new app meant:

- Re-explaining the portfolio conventions in each chat.
- Drift between what the plan said and what got built.
- No visual surface for "what am I making."
- Burning tokens on context Chase has already typed ten times.

Idea Kitchen is one loop that takes a raw idea, walks it through Phases 1, 2, 2.25, 2.5, and 3 of `PRODUCT_BUILD_FRAMEWORK.md`, produces eight handoff docs, and hands off to Claude Code with a kickoff prompt that's ready to paste.

**Phase 2.25 is new in v0.4** — every project now produces a `MONETIZATION_BRIEF.md` (revenue model, pricing, WTP evidence) before the brand step. A new `LAUNCH_PLAYBOOK.md` covers go-live (domain, legal, Stripe, marketing channel). Chase has 38 projects and zero MRR. The system enforces revenue-thinking up-front so v1 ships with a Stripe URL, not without one.

A new **Brainstorm mode (STEP 0B)** runs Ideaflow + Naval ideation when Chase doesn't have an idea yet — generates 20+ seeds from his strengths, interests, and frustrations, then narrows to 3 via Naval scoring (specific knowledge, permissionless leverage, productize yourself, long-term game) and a confidence-bypass filter (prefer Tier 1 sells-itself artifacts over Tier 4 personal-brand offers).

It also dogfoods itself. This app follows every rule it teaches.

---

## 2. Mental model

Two halves:

- **Ideation half** — a Claude Project on claude.ai. Conversational. Names, shapes, pressure-tests the idea. Produces artifacts. Never writes code.
- **Build half** — Claude Code in the terminal. Reads the artifacts. Scaffolds. Ships vertical slices.

Two modes inside the ideation half:

- **Project mode** (section 4) — new app from scratch. 6 artifacts. Output lives at `portfolio/<slug>/docs/`.
- **Feature mode** (section 4b) — new feature inside an existing portfolio app. 4 artifacts. Output lives at `portfolio/<target-app>/docs/features/<feature-slug>/`.

The Project picks the mode from your first message — "I want to build X" routes to project mode, "I want to add X to `<app>`" routes to feature mode.

The bridge between the two halves is the artifacts:

- **Project mode (v0.4):** `PRODUCT_BRIEF.md`, `PRD.md`, `MONETIZATION_BRIEF.md`, `BRANDING.md`, `APP_FLOW.md`, `LAUNCH_PLAYBOOK.md`, `SHOWCASE.md`, `SESSION_START_<SLUG>.md`. Eight artifacts.
- **Feature mode:** `FEATURE_BRIEF.md`, `FEATURE_PRD.md`, `FEATURE_DESIGN.md`, `FEATURE_IMPL_PLAN.md` (the impl plan is itself a SESSION_START-shaped kickoff).

`SHOWCASE.md` (project mode only) is the visual surface. Shipyard renders it at `/ship/<slug>` (Phase 2 of this app's roadmap). Until then it's a well-organized markdown page.

---

## 3. One-time setup

1. Create a new Claude Project on claude.ai. Name it "Idea Kitchen."
2. Paste `prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md` into the **System Prompt** slot.
3. Upload every file listed in `templates/CLAUDE_PROJECT_KNOWLEDGE_MANIFEST.md` as **Project Knowledge**.
4. Save.

You're ready. Every idea from now on starts by opening this Project and typing the idea.

**Refresh cadence:** once a month, or whenever `CLAUDE.md`, `identity/*`, or the framework changes materially. Re-upload those specific files.

---

## 4. Per-idea workflow

1. Open the Claude Project.
2. Paste your raw idea. No format required. One sentence is fine.
3. Answer STEP 0 (scope / identity / appetite) in one message.
4. Go through STEPS 1 → 1.5 → 2 → 3 → 3.25 → 3.5 → 4 → 5 one message at a time. Sign off at each gate. STEP 1.5 is the prior-art / existing-solution check — don't skip it, that's where "this already exists on the open web" gets caught before you burn the appetite. STEP 3.25 is the new revenue-model gate — pricing, WTP evidence, and target metrics get locked before brand.
5. At STEP 6, each doc appears as a downloadable artifact in claude.ai. Click **Download** on each one — eight `.md` files land in `~/Downloads`. Then in your terminal:
   ```
   cd ~/Developer/chase
   portfolio/idea-kitchen/scripts/install-docs <slug>
   ```
   This moves all eight docs to the correct paths:
   - `portfolio/<slug>/docs/PRODUCT_BRIEF.md`
   - `portfolio/<slug>/docs/PRD.md`
   - `portfolio/<slug>/docs/MONETIZATION_BRIEF.md`
   - `portfolio/<slug>/docs/BRANDING.md`
   - `portfolio/<slug>/docs/APP_FLOW.md`
   - `portfolio/<slug>/docs/LAUNCH_PLAYBOOK.md`
   - `portfolio/<slug>/docs/SHOWCASE.md`
   - `portfolio/idea-kitchen/templates/SESSION_START_<SLUG>.md`

   The script also prints which file to re-upload to the Claude Project when done.

   **If Claude pasted the docs as fenced code blocks instead of creating artifacts** (rare — the prompt instructs it to use artifacts, but claude.ai occasionally falls back): copy the entire chat message to a single `.md` file in `~/Downloads` (e.g. `~/Downloads/shipyard.md`) and run `install-docs <slug> --paste ~/Downloads/shipyard.md`. Or `install-docs <slug> --paste-clipboard` if it's still on your clipboard. The splitter reads `--- FILE: <name> ---` delimiters that the Project emits in that fallback format. See §11.
6. Follow STEP 7's numbered checklist. Scaffold the app. STEP 7 now includes creating an Obsidian hub note at `brain/02-Projects/<slug>/README.md` — frontmatter + links to the in-repo docs. Obsidian is the index; the repo stays source of truth.
7. Open a fresh Claude Code session. Paste `SESSION_START_<SLUG>.md`. Claude Code reads context and executes Milestone 0.
8. Claude Code stops after Milestone 0, commits, and waits.
9. You review. You either approve Milestone 1 or pause.
10. End of session: run the 12-step checklist (below).

### 4a. Retroactive docs for existing apps

Already shipped something without foundation docs? Use `templates/SESSION_START_EXISTING_APP.md`:

- Open the Idea Kitchen Claude Project and paste the template (fill `[APP NAME]`, `[SLUG]`, one-liner)
- Paste the app's `CLAUDE.md` and `HANDOFF.md` content into the zones at the bottom
- Tell the Project to skip STEP 0, STEP 1.5, and STEP 2 (already in the template)
- Priority output is `SHOWCASE.md` (Shipyard needs it) then `BRANDING.md`
- Download the artifacts and run `portfolio/idea-kitchen/scripts/install-docs <slug>` to place them

Highest-value apps to run this on first: Job Search HQ, Shipyard, Knowledge Base.

### 4b. Feature mode — adding features to existing apps

Sometimes the idea isn't a new app, it's a new feature on one of the 39 apps already in the portfolio. Feature mode is for that. It runs the same duplication + competitor discipline as project mode, but scoped to a single app, and emits 4 feature docs instead of 6 app docs.

**When to use feature mode** (vs project mode):
- You know the target app already exists (e.g. "add X to Fairway").
- The feature inherits the target's stack, storage, and branding.
- It wouldn't stand alone as its own app.

**When to use project mode instead:**
- The idea could be its own app with its own user base.
- It needs a different stack or different branding from any existing app.
- STEP 1F might still re-route you here with a `NEW_APP` verdict.

#### The four artifacts feature mode produces

| File | Path | Purpose |
|---|---|---|
| `FEATURE_BRIEF.md` | `portfolio/<target-app>/docs/features/<feature-slug>/` | 5-line summary (feature / user / pain / value / V1) |
| `FEATURE_PRD.md` | same folder | V1 features, NOT-in-V1, portfolio-scan verdict, competitor verdict with 4 layers, constraints, success, risks |
| `FEATURE_DESIGN.md` | same folder | Screens, components, states, a11y per-screen, theme tokens, data delta |
| `FEATURE_IMPL_PLAN.md` | same folder | SESSION_START-shaped kickoff for Claude Code: Milestone 0 scaffold → Milestone 1 vertical slice |

No `SHOWCASE.md` update — the feature lives under its parent app, and that app's SHOWCASE.md gets a bump after Milestone 1 ships.

#### Per-feature workflow

1. Open the Idea Kitchen Claude Project.
2. Paste: *"I want to add `<feature>` to `<target-app>`."* The Project branches into feature mode automatically.
3. Answer **STEP 0F** (target app, feature sketch, appetite, identity on/off) in one message.
4. Walk through feature mode one message at a time: **STEP 1F → 1.5F → 2F → 3F → 4F → 5F → 6F → 7F**. Sign off at each gate.
   - **STEP 1F** is the cross-portfolio duplication scan (4 checks: target overlap, sibling overlap, shared-package candidacy, architecture fit) with a verdict: `EXTEND_TARGET | EXTRACT_SHARED | NEW_APP | KILL`. Don't skip it — this is the whole point of feature mode. `NEW_APP` verdict re-routes you back to project mode.
   - **STEP 1.5F** is the 4-layer competitor teardown: feature matrix, UX teardown, review mining, technical approach. Produces 3–5 differentiation levers tied to specific research, not vibes.
5. At **STEP 6F**, 4 downloadable artifacts appear. Click **Download all** — a zip lands in `~/Downloads`. Then:
   ```
   cd ~/Developer/chase
   portfolio/idea-kitchen/scripts/install-feature-docs <target-slug> <feature-slug>
   ```
   That one script unzips the artifacts, files them into `portfolio/<target-slug>/docs/features/<feature-slug>/`, wires the feature into every portfolio tracking surface (ROADMAP, CHANGELOG, LEARNINGS, HANDOFF), creates the Obsidian feature hub, and links it from the parent hub. It's idempotent — safe to run twice.

   **If Claude pasted the 4 docs as code blocks instead of creating artifacts**: save the chat message to a single `.md` file and run `install-feature-docs <target-slug> <feature-slug> --paste <file>` (or `--paste-clipboard`). Same delimiter protocol as project mode. See §11.
6. Follow STEP 7F's numbered checklist:
   - Create Linear issue under target app's Linear project (URL in root `CLAUDE.md` portfolio metadata table — create one under team Whittaker if missing).
   - `git add portfolio/<target-slug>/` → commit → push.
   - Open Claude Code in `~/Developer/chase`, paste `FEATURE_IMPL_PLAN.md`.
7. Claude Code reads the target app's `CLAUDE.md` + `HANDOFF.md` + the 4 feature docs, scaffolds **Milestone 0** inside the target app (files + wiring, no UX yet), commits, stops.
8. You verify Milestone 0 builds. Approve Milestone 1 (the vertical slice) or pause.
9. End of session: run the 12-step checklist as usual — but the updates land in the target app's files, plus step 8.5 bumps the Obsidian feature hub note.

#### Worked walkthrough — adding a sprinkler map to Fairway iOS

Chase has a Fairway iOS app (`portfolio/fairway-ios/`) that tracks lawn zones, irrigation, fertilizer plan, soil test, spreader calc, and shrub beds. SwiftUI + `@Observable` + UserDefaults. He wants to add a map section where he can mark sprinkler heads and draw where each sprinkler throws water.

Here's the full run through feature mode:

1. **Paste the idea.** *"I want to add a sprinkler map to Fairway. Mark sprinkler heads and mark where each sprinkler throws water."*
2. **STEP 0F — Intake.** Target: `fairway-ios`. Appetite: 2 weeks (Shape-Up). Identity: on (Chase's voice).
3. **STEP 1F — Portfolio scan.**
   - Target: Fairway has a `HeadData` model (see `SESSION_START_FAIRWAY_IOS.md`) but no map UI yet. Natural extension point.
   - Siblings: no portfolio app has a MapKit integration. Ash Reader iOS has a reusable theme switcher to borrow. Unnamed iOS has lane visualization — loosely related, not a lift.
   - Shared package: no — too Fairway-specific.
   - Architecture fit: SwiftUI supports MapKit natively. No new dep.
   - **Verdict: EXTEND_TARGET.** Stays in Fairway.
4. **STEP 1.5F — Competitor research (4 layers).**
   - Layer 1 matrix: Rachio, Hydrawise, Sprinkler Master, B-hyve, Sprinklr Pro — pricing, platform, map capability, gap.
   - Layer 2 UX: drag-to-place vs tap-to-place, icon choices for heads, how spray radius renders (filled circles vs arcs).
   - Layer 3 reviews: r/lawncare, App Store — "can't save layouts," "no spray-radius visualization," "subscription just for the map."
   - Layer 4 tech: MapKit (Apple-native, free, offline tiles via system cache), Mapbox if satellite-cleaner needed, `MKCircle` overlay for full-circle heads + custom overlay for arc patterns.
   - **Verdict: DIFFERENTIATE.** Personal-use, no-sub, owner-drawn spray patterns, ties to existing zone data. 3–5 levers spelled out.
5. **STEPs 2F → 5F** — brief → PRD → design → impl plan. Sign off between each.
6. **STEP 6F** — 4 artifacts appear. "Download all" → zip in `~/Downloads`.
7. `portfolio/idea-kitchen/scripts/install-feature-docs fairway-ios sprinkler-map`. Files land at:
   ```
   portfolio/fairway-ios/docs/features/sprinkler-map/
     FEATURE_BRIEF.md
     FEATURE_PRD.md
     FEATURE_DESIGN.md
     FEATURE_IMPL_PLAN.md
   ```
   Plus ROADMAP feature-queue entry, CHANGELOG unreleased bullet, LEARNINGS one-liner, HANDOFF Last-touch row, and Obsidian hub note at `brain/02-Projects/fairway-ios/features/sprinkler-map.md`.
8. Linear issue created under the Fairway project (or a Fairway project gets created first under team Whittaker if missing).
9. git commit + push.
10. Open Claude Code in `~/Developer/chase`. Paste `FEATURE_IMPL_PLAN.md`.
11. Claude Code reads `portfolio/fairway-ios/CLAUDE.md` + `HANDOFF.md` + the 4 feature docs. Scaffolds **Milestone 0**: new `MapTab` in `ContentView`, new `SprinklerMapView` stub, extends `HeadData` with `coordinate: CLLocationCoordinate2D?`. Runs `xcodebuild clean build`. Commits. Stops.
12. Chase verifies in Xcode, signs off, Milestone 1 ships the primary flow: tap a zone → tap-to-place a head → see it persist after app restart.

#### What `install-feature-docs` does (in detail)

Signature: `install-feature-docs <target-slug> <feature-slug>`

In one run, it:
1. Finds the 4 artifacts in `~/Downloads` (zip or loose files) and moves them to `portfolio/<target>/docs/features/<feature>/`.
2. Appends `- [ ] \`<feature>\` — see \`docs/features/<feature>/\`` under `## Feature queue` in the target's `ROADMAP.md` (creates section if missing).
3. Appends `- docs(<feature>): feature spec added via Idea Kitchen feature mode` under `## [Unreleased]` in the target's `CHANGELOG.md`.
4. Appends `YYYY-MM-DD — <feature> spec drafted via Idea Kitchen feature mode...` to the target's `LEARNINGS.md`.
5. Updates the target's `HANDOFF.md` **Last touch** row.
6. Creates the Obsidian feature hub at `brain/02-Projects/<target>/features/<feature>.md` with frontmatter (`type: feature`, `parent-app`, `status: active`, `started: YYYY-MM-DD`, `tags`) + `file://` links to the 4 repo artifacts.
7. Adds `- [[features/<feature>|<feature>]]` under `## Features` in the Obsidian parent hub (`brain/02-Projects/<target>/README.md`). Creates the section or the entire stub hub if missing.
8. Prints a summary + manual next steps (Linear issue, git commit, Claude Code paste).
9. Never `git add`s the Obsidian vault — it lives in iCloud, not the monorepo.

Idempotent: running twice for the same `<target> <feature>` detects existing entries and skips them.

#### What does NOT change for a feature

- Root `CLAUDE.md` portfolio table — features don't get their own rows (the parent app already has one).
- `cd portfolio/shipyard && npm run sync:projects` — only run this if the *app-level* metadata changed (category, tagline, Linear URL). Feature additions alone don't trigger it.
- Root `ROADMAP.md` Change Log — update it only after Milestone 1 ships, not on spec install.

#### Audits — what catches feature-level work automatically

- `scripts/portfolio-health-check` picks up new LOC + commit activity under `portfolio/<target>/` without any config change.
- `/update linear` detects feature work via target app's HANDOFF/ROADMAP/CHANGELOG, posts heartbeats on the target's Linear project, closes done issues.
- Shipyard UI refreshes on its next sync; no row is added for the feature.

No separate feature audit needed. Features ride the rails of their parent app.

---

## 5. The six foundation docs — what each is for

| File | Who reads it | When it changes |
|---|---|---|
| `PRODUCT_BRIEF.md` | You, Claude Code, future-you | Rarely. Only when the product changes, not the features. |
| `PRD.md` | Claude Code, you during reviews | When V1 scope changes. Update the "NOT in V1" list aggressively. |
| `BRANDING.md` | You, Claude Code on UI work | When the look changes. Palette + typography + voice. |
| `APP_FLOW.md` | You, Claude Code on UI work | When the primary flow changes or a screen is added. |
| `SHOWCASE.md` | You (visual), Shipyard | Every session where user-visible state changes. |
| `SESSION_START_<SLUG>.md` | Claude Code on kickoff | Once per new Claude Code session. Throwaway after. |

---

## 6. The end-of-session ritual

Both halves. Do all of these, every time.

**In Claude Code:**

```
 1. checkpoint                                 # ALWAYS first — git snapshot you can roll back to
 2. Update CHANGELOG.md under ## [Unreleased]  # MANDATORY — one line is fine
 3. Update <app>/ROADMAP.md                    # mark what shipped, add new ideas
 4. Update root ROADMAP.md Change Log          # one row
 5. Update <app>/HANDOFF.md                    # State, Focus, Next, Last touch
 6. Update <app>/LEARNINGS.md                  # MANDATORY — append at least one line
 6.5. Update docs/SHOWCASE.md                  # if user-visible state changed
 7. Linear — heartbeat comment + close done issues
 8. cd portfolio/shipyard && npm run sync:projects   # if root CLAUDE.md tables changed
 8.5. Update brain/02-Projects/<slug>/README.md      # Obsidian hub — frontmatter bumps + dated log if state changed
 9. git add <paths>
10. git commit -m "<type>(<slug>): <summary>"        # conventional commits
11. git push
12. Report: what shipped / what's next / any blockers.
```

**In the Claude Project:**

- Run STEP 8 (WIP summary) if you might resume later.
- Run STEP 9 (pattern capture) if anything felt repeated.

**Why each step:**

- Checkpoint — zero git-knowledge safety net. `restore <hash>` brings it all back.
- CHANGELOG — the paper trail for future-you. Even one line.
- ROADMAP — memory of what's next when you come back cold.
- HANDOFF — resume context. If you open a new chat tomorrow, this is the only file Claude needs to read first.
- LEARNINGS — the mistakes log. Read at the start of every session so you don't re-discover them.
- SHOWCASE — the visible state. Keeps Shipyard honest.
- Linear — shipped truth lives here + git.
- Shipyard sync — keeps the fleet view accurate.
- Obsidian hub — the portfolio's second-brain index. Frontmatter + links only; never duplicate repo content.
- Conventional commits — lets `/changelog` and `release` skills parse history.

---

## 7. Security rules

Public repo. Treat every tracked file as world-readable.

- **Never commit** API keys, passwords, OAuth tokens, service-role keys, real financial figures, account balances, real names tied to financial data, or bank/lender names with real amounts.
- `.env` gitignored. `.env.example` with placeholder values only.
- **Supabase:** RLS on every table. Anon key is fine client-side. Service-role key is server-only, never in client bundles.
- **SQL:** parameterized queries only. No string concatenation into queries.
- **DOM:** no `dangerouslySetInnerHTML`. HTTPS only. No user-controlled redirects without an allowlist.
- **Dependencies:** `npm audit --production` before each release. Upgrade Critical + High.
- **AI keys:** server-side only. If an app calls an LLM, route through a Vercel function. For tool-use or agentic paths, read `vercel:ai-architect` patterns for prompt-injection resistance.
- **If a secret is committed:** rotate immediately. Do not wait. Then purge git history with `git filter-repo` or BFG.
- **Run `/secure`** before the first push of any new app.

Concrete incident examples:

- A stray `.env.production` committed to `portfolio/spend-radar-web/` → rotate the Sheet ID (even if public), rotate any trigger tokens, remove the file, force-push after `git filter-repo`.
- A hardcoded Anthropic key in a React component → rotate in Anthropic console, move the call to a Vercel function, commit the fix, force-push history purge.
- Real income figures in a commit message → reword with `git commit --amend`, force-push if not yet on `main`; if on `main`, accept the history leak and rotate whatever the figure exposes (usually nothing, but worth a beat).

---

## 8. Best practices — senior-dev moves

1. **Vertical slice.** Milestone 0 is the scaffold. Milestone 1 is the primary flow end to end, ugly but working. No horizontal layers before a vertical slice works.
2. **Verify before claiming done.** UI changes: open the browser. iOS changes: run on device or simulator. CLI: run the command. Tests passing ≠ feature working.
3. **Local `npm run build` before push.** Node 20 CI is stricter than your local Node. Lockfile drift breaks CI. See `docs/templates/SESSION_START_FIX_CI_LOCKFILES.md`.
4. **Small diffs. Conventional commits.** `feat(<slug>): <summary>`, `fix(<slug>): <summary>`, `chore(<slug>): <summary>`. One logical change per commit.
5. **Empty + error states on every screen.** No "no data yet" rendered as a blank white square. No raw error strings.
6. **Accessibility day one.** Chase has low vision. Dynamic Type on iOS, 44pt tap targets, VoiceOver labels on every control, 4.5:1 contrast minimum, focus rings visible. Not retrofitted.
7. **Portfolio table + Shipyard metadata stay in sync.** When you add a row to one, add it to the other. `npm run sync:projects` after.
8. **HANDOFF = resume context. Linear + git = shipped truth.** Don't duplicate. HANDOFF rots fast; git doesn't.
9. **Kill criteria are real.** If Milestone 1 hits the kill criterion from STEP 1, stop. Archive the app. Don't sunk-cost it.
10. **Prior-art check is first-class.** STEP 1.5 exists so you don't vibe-code something YNAB / Linear / a random Product Hunt tool already does. If a close match exists with no gap, default to KILL. Vibe-coding for its own sake is fine — call it out explicitly in the verdict justification instead of pretending the idea is novel.
11. **`/audit` before push** on non-trivial changes. Takes two minutes. Catches the obvious stuff.
12. **No speculative abstractions.** Three similar lines is better than a premature abstraction. Don't add a helper for "one day we might need."
13. **15-minute stuck rule.** If you've been stuck 15 minutes, change approach or ask. Don't grind.

---

## 9. The minisite

`docs/SHOWCASE.md` is the source. It's markdown, it's in the repo, it's the single place that describes "what is this app, right now."

**Primary surface:** Shipyard renders it at `/ship/<slug>` (Phase 2 of Idea Kitchen's roadmap — not yet live). Until then, the `.md` itself is the surface.

**Optional second surface:** static HTML minisite. Generate with Claude Code's `/showcase` skill when you say "build the minisite." Good for sharing a link that doesn't need Shipyard auth.

**Freshness rule:** update it every session where user-visible state changes. Step 6.5 of the end-of-session checklist. Don't let it rot.

---

## 10. Token efficiency tactics

- **Project Knowledge carries static context.** `CLAUDE.md`, `PRODUCT_BUILD_FRAMEWORK.md`, `identity/*`, and templates are uploaded once. The Project reads them instead of asking you.
- **WIP summary as resume token.** STEP 8 produces a ≤12-line paste-able summary. In a fresh chat, paste it and the Project picks up exactly where it left off. No re-litigation.
- **One message per phase.** Don't ask the Project "give me the whole plan in one go." Phase-by-phase lets you correct early cheaply.
- **Reference files by name.** In Claude Code, say *"follow `docs/BRANDING.md`"* instead of pasting the palette. The file is in the context already.
- **Subagents for exploration.** If the Project or Claude Code needs to survey the codebase, delegate to an Explore subagent. It returns a summary; your context stays lean.

---

## 11. Troubleshooting / recovery

| Symptom | Cause | Fix |
|---|---|---|
| Claude Code scaffolded the app in the wrong folder | You pasted `SESSION_START_<SLUG>.md` from the wrong CWD | `git mv` the folder. Update CLAUDE.md paths. Commit. |
| V1 scope grew to 9 bullets | Pressure-test drift | Re-run STEP 1 in the Project. Cut back to 3–5. Update PRD. |
| CI red on push: lockfile | Regenerated `package-lock.json` with Node 24 locally | Follow `docs/templates/SESSION_START_FIX_CI_LOCKFILES.md`. Regenerate with Node 20. |
| Secret committed to a public repo | Usually an `.env` or a hardcoded key | Rotate first. Then `git filter-repo` to purge. Then force-push. Then update `.gitignore`. |
| Shipyard doesn't show the new app | You added to CLAUDE.md but didn't sync | `cd portfolio/shipyard && npm run sync:projects`. |
| PRD drifted from code | Nobody updated `NOT in V1` when scope grew | Open PRD. Add the new items to V1 features. Move old "V1" items to "NOT in V1" if deferred. Commit. |
| Claude Code asks for context already in `CLAUDE.md` | Project Knowledge stale or Claude Code didn't read `CLAUDE.md` | Re-upload. In Claude Code, `/init` to refresh CLAUDE.md context. |
| STEP 6 / 6F produced fenced code blocks in chat instead of downloadable artifacts | claude.ai fell back from the artifact tool to inline text (rare; prompt forbids this but it still happens) | Copy the full chat message to one `.md` file (e.g. `~/Downloads/shipyard.md`) and run `install-docs <slug> --paste <file>` — or `install-feature-docs <target> <feature> --paste <file>` for feature mode. Also accepts `--paste-clipboard` (macOS `pbpaste`). Splitter reads `--- FILE: <name> ---` delimiters; preamble text is discarded. |

---

## 12. FAQ

**Can I use this for a non-portfolio idea?**

Yes. Answer "one-off" in STEP 0. The Project drops the portfolio conventions and stays generic. You won't get the Shipyard hookup or portfolio table updates, but the foundation docs are still useful.

**Can I skip phases?**

No on first pass. Every phase exists because of a past pain point. If you skip Phase 2.5 (Brand & Name), you'll change the name in Milestone 3 and rename ten files. If you skip accessibility in Phase 3, you'll retrofit it and hate it.

**What if I forget the voice rules?**

The Project reminds you at STEP 6. Voice rules live in `identity/voice-brief.md` and are loaded via Project Knowledge.

**Is Shipyard required?**

No. Idea Kitchen's primary surface is the six markdown files. Shipyard is a nice-to-have viewer. Phase 2 of this app's roadmap wires up rendering; until then, `SHOWCASE.md` is read directly.

**How often should I refresh Project Knowledge?**

Monthly, or whenever `CLAUDE.md` / `identity/*` / `PRODUCT_BUILD_FRAMEWORK.md` changes in a way that affects how the Project should behave.

**What goes in `identity/patterns.md`?**

Rules that came from repetition. Example: *"Default to Next.js App Router for new web apps — Chase prefers it over CRA now." — Why: said this four times across sessions.* One-line rules only. If a rule needs a paragraph, it belongs in CLAUDE.md or the framework doc instead.

---

## 13. Cheat sheet

**Project mode** — new app:

```
Claude Project → paste idea → STEP 0 intake → STEPs 1 → 1.5 → 2 → 3 → 3.5 → 4 → 5 one-at-a-time
  (STEP 1.5 = prior-art / existing-solution check → KILL | DIFFERENTIATE | PROCEED)
STEP 6 → download 6 artifacts → run install-docs <slug>
STEP 7 → scaffold + commit + CLAUDE.md + Shipyard + Obsidian hub note + Linear
STEP 8 (optional) → WIP summary for resume
STEP 9 → pattern capture

Fresh Claude Code session → paste SESSION_START_<SLUG>.md
Milestone 0 scaffold → commit → stop
Review → approve Milestone 1 or pause

End of session:
  checkpoint → CHANGELOG → ROADMAP → HANDOFF → LEARNINGS → SHOWCASE
  → Linear → Shipyard sync → Obsidian hub touch-up → commit → push → report
```

**Feature mode** — adding to an existing app:

```
Claude Project → paste "add <feature> to <target-app>" → STEP 0F intake
  → STEP 1F portfolio scan (EXTEND_TARGET | EXTRACT_SHARED | NEW_APP | KILL)
  → STEP 1.5F 4-layer competitor research (KILL | DIFFERENTIATE | PROCEED)
  → STEPs 2F → 3F → 4F → 5F one-at-a-time
STEP 6F → download 4 artifacts → run install-feature-docs <target> <feature>
STEP 7F → Linear issue + commit + push + paste FEATURE_IMPL_PLAN.md into Claude Code

Claude Code reads target CLAUDE.md + HANDOFF.md + 4 feature docs
  → Milestone 0 scaffold inside target → commit → stop
Review → approve Milestone 1 (vertical slice) or pause

End of session (same ritual, targets the parent app's files):
  checkpoint → target CHANGELOG/ROADMAP/HANDOFF/LEARNINGS
  → Linear heartbeat → Obsidian feature hub → commit → push → report
```

---

## 14. Claude Project re-upload checklist

When files change, re-upload them to the Idea Kitchen Claude Project on claude.ai. Stale Project Knowledge = wrong answers.

### After running `install-docs` for any app

| File to re-upload | Path |
|---|---|
| `SESSION_START_<SLUG>.md` | `portfolio/idea-kitchen/templates/SESSION_START_<SLUG>.md` |

The script prints this reminder automatically.

### After any app's `CLAUDE.md` or `HANDOFF.md` changes materially

Regenerate the template first (if context has drifted), then re-upload:

| File to re-upload | Path |
|---|---|
| `SESSION_START_<SLUG>.md` | `portfolio/idea-kitchen/templates/SESSION_START_<SLUG>.md` |

### Monthly (or when materially changed)

| File to re-upload | Full path |
|---|---|
| Repo root `CLAUDE.md` | `~/Developer/chase/CLAUDE.md` |
| `PRODUCT_BUILD_FRAMEWORK.md` | `~/Developer/chase/PRODUCT_BUILD_FRAMEWORK.md` |
| `identity/direction.md` | `~/Developer/chase/identity/direction.md` |
| `identity/voice-brief.md` | `~/Developer/chase/identity/voice-brief.md` |
| `identity/friend-feedback.md` | `~/Developer/chase/identity/friend-feedback.md` |
| `identity/kassie-notes.md` | `~/Developer/chase/identity/kassie-notes.md` |
| `identity/strengths/` (both files) | `~/Developer/chase/identity/strengths/` |
| `PORTFOLIO_APP_BRANDING.md` template | `~/Developer/chase/docs/templates/PORTFOLIO_APP_BRANDING.md` |
| `PORTFOLIO_APP_LOGO.md` template | `~/Developer/chase/docs/templates/PORTFOLIO_APP_LOGO.md` |
| `SESSION_START_MONOREPO.md` template | `~/Developer/chase/docs/templates/SESSION_START_MONOREPO.md` |
| `APP_SHOWCASE_TEMPLATE.md` | `portfolio/idea-kitchen/templates/APP_SHOWCASE_TEMPLATE.md` |
| `SESSION_START_EXISTING_APP.md` | `portfolio/idea-kitchen/templates/SESSION_START_EXISTING_APP.md` |
| `MEMORY.md` | `~/.claude/projects/-Users-chase-Developer-chase/memory/MEMORY.md` |

### When a pre-filled SESSION_START template is updated

Each app has a pre-filled template in `portfolio/idea-kitchen/templates/`. Re-upload the specific one that changed:

```
portfolio/idea-kitchen/templates/SESSION_START_<SLUG>.md
```

Full list of pre-filled templates → `templates/CLAUDE_PROJECT_KNOWLEDGE_MANIFEST.md`
