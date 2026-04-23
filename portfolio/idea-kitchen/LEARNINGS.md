# Learnings — Idea Kitchen

Mistakes, fixes, and "aha" moments. Read at session start; append after anything surprising.

---

## 2026-04-22 — `<antArtifact>` XML in the prompt can get echoed as literal fenced code

**What happened:** Chase ran retroactive-docs mode on Shipyard. Content came back correct — but as six fenced markdown code blocks in chat, not as downloadable artifact panels. `scripts/install-docs` reads from `~/Downloads`, so the handoff broke and he had to hand-save each block.

**Root cause:** The system prompt (STEP 6 + STEP 6F) showed `<antArtifact>` XML inside fenced code blocks as instructional examples. claude.ai sometimes resolves "show this tag" as "emit it as text" instead of "invoke the artifact tool." The instructional language was descriptive (*"Use … tags so each renders as a downloadable panel"*) rather than imperative. Compounding it: 40 pre-filled SESSION_START templates said *"All six STEP 6 **blocks**"* — the word "blocks" was latent reinforcement of the exact wrong fallback.

**Fix:** (1) Removed all `<antArtifact>` XML examples from the prompt — replaced with imperative filename language ("Artifact titled `PRODUCT_BRIEF.md`"). (2) Added a top-of-prompt "How to behave" rule explicitly forbidding fenced code blocks for STEP 6 / 6F. (3) Portfolio-wide sweep: 40 SESSION_START templates normalized "blocks" → "artifacts (downloadable panels, not code blocks in chat)." (4) Both installers gained `--paste <file>` / `--paste-clipboard` fallback that splits `--- FILE: <name> ---` delimited single-file markdown. Opt-in flag, not auto-fallback — silent auto-parse of random clipboard content would confuse failure modes.

**Rule:** Never put raw tool-invocation markup inside fenced code blocks in a system prompt. Describe the behavior imperatively ("Create an artifact titled X") — don't show the markup. If you must show markup (e.g., in docs for developers), put it in `docs/`, not in the prompt the LLM reads.

**Secondary rule:** When hardening a prompt against a failure mode, sweep the ENTIRE corpus of supporting files too. The fix has to be consistent with every past artifact, not just the one that broke. A latent reinforcement in 40 templates beats a single prompt edit.

**Implementation gotcha:** macOS default awk is BSD awk, which doesn't support the 3-arg `match(string, regex, array)` form. Used `sub()` with capture via `/regex/` + `sub(prefix, "")` + `sub(suffix, "")` instead. Also: `ls *.md 2>/dev/null` trips `set -e` on no-match even with stderr redirected — use `find ... -name '*.md'` instead, which returns 0 on empty.

---

## 2026-04-21 — Created Idea Kitchen

**What happened:** Built Idea Kitchen as a portfolio app rather than a loose `docs/` folder in the repo root. The decision came after 4 rounds of plan iteration.

**Why it matters:** Making it a portfolio app means it follows the same conventions it teaches (dogfood), shows up in Shipyard automatically, and can be edited by Claude Code like any other app. The alternative (a `docs/` blob) would have had no HANDOFF, no CHANGELOG, no LEARNINGS — meaning the system that teaches those practices would itself violate them.

**Rule:** When a tool or system teaches a convention, the tool itself must follow the convention. Otherwise the convention isn't real, it's aspirational.

---

## 2026-04-21 — Prompt vs. pasteable-message

**What happened:** First draft had the whole workflow collapsed into one giant paste-able prompt. Revised to split it into 6 markdown artifacts + 1 kickoff prompt.

**Why it matters:** A single giant prompt evaporates on context compaction. Six markdown files survive, can be re-read by Claude Code, and can be edited without re-running the Project. It also maps cleanly to the existing 6-phase framework — no new concepts.

**Rule:** Artifacts beat pasteable prompts. If information needs to survive a session, it belongs in a file, not a message.

---

## 2026-04-21 — Branding phase placement (2.5 between PRD and UX)

**What happened:** Considered putting naming/branding at Phase 1 (start) or Phase 3 (alongside UX). Landed on Phase 2.5.

**Why it matters:** At Phase 1, you don't yet know what the product is, so the name is a guess. At Phase 3, UX work starts using brand language (button copy, empty-state tone), so brand needs to exist before then. Phase 2.5 — after the PRD, before UX — gives the designer enough context to propose names that fit and leaves time for UX to use the brand.

**Rule:** Brand decisions need PRD context and must be locked before UX starts. 2.5 is the right slot.

---

## 2026-04-21 — Identity via Project Knowledge, not embedded prompt text

**What happened:** Considered baking voice rules and CliftonStrengths into the prompt itself. Chose to reference via Project Knowledge uploads instead.

**Why it matters:** Prompt text is static and rots. Project Knowledge files are editable in place — when `identity/voice-brief.md` changes, every future session picks it up automatically. No prompt edit needed.

**Rule:** Static context (identity, framework, portfolio conventions) belongs in Project Knowledge, not prompt text. The prompt references files by name.

---

## 2026-04-21 — Pressure-test only checked portfolio duplication, not external solutions

**What happened:** v0.1 of the Claude Project prompt had STEP 1 pressure-test check for overlap with Chase's own portfolio apps, but never asked "does this already exist as a free or cheap app / website out in the open?" Chase flagged this: vibe-coding an app you could just download wastes the appetite.

**Fix:** Added STEP 1.5 — a dedicated prior-art / existing-solution check between pressure-test (STEP 1) and Phase 1 brief (STEP 2). Hybrid research (Claude proposes search queries + likely candidates; Chase confirms) and a 3-verdict gate (`KILL | DIFFERENTIATE | PROCEED`) with a required one-line justification. The verdict block carries verbatim into the PRD under a new "Prior art & positioning" section.

**Rule:** "Does this already exist" is a first-class gate, not a pressure-test sub-check. Vibe-coding for personal reasons (learning, control, own-data, fun) is fine — but the reason must be named in the justification, not hand-waved.

---

## 2026-04-21 — DIFFERENTIATE verdicts were too soft without concrete levers

**What happened:** v0.1 of STEP 1.5 had `Verdict / Alternatives / Justification / Positioning`. Ran a mental re-play on Shipyard and Job Search HQ — both would produce plausible-sounding DIFFERENTIATE verdicts with one-sentence justifications that, six weeks later, nobody could point at and say *"which three features actually differentiate this?"*. The block was shaped to look decisive while being hand-wavy.

**Fix:** added a required `Differentiation levers` line (3–5 concrete angles, each a specific feature / integration / constraint / stance) between Justification and Positioning when the verdict is DIFFERENTIATE. Extended the DIFFERENTIATE explanation: *"the gap must be named as 3–5 concrete levers, not a single adjective — vague 'it'll feel different' is a fail mode."* Dogfood PRD backfilled with 5 specific levers, each naming the competitor it beats.

**Rule:** "We'll differentiate via X" is a promise. If X isn't concrete enough to fit on a bullet line and name a competitor it beats, it's vibes. DIFFERENTIATE without levers is a softer KILL.

---

## 2026-04-21 — Obsidian is the portfolio's second-brain index; Idea Kitchen didn't touch it

**What happened:** The iCloud Obsidian vault (`brain/`) has hub notes for exactly 5 of ~40 portfolio apps — ash-reader, ash-reader-ios, gmail-forge, unnamed, unnamed-ios. Every other app exists only in the repo. Idea Kitchen, the system meant to teach portfolio conventions, had zero Obsidian integration in v0.1. That gap means the second-brain index falls behind the repo every time a new app ships.

**Fix:** added a STEP 7.5 Obsidian hub creation step to the Claude Project prompt's handoff checklist, a step 8.5 Obsidian touch-up to the end-of-session ritual, and Idea Kitchen's own hub note at `brain/02-Projects/idea-kitchen/`. Hub-note pattern is strictly *frontmatter + links*, never mirroring repo content — the repo stays authoritative.

**Rule:** Obsidian is an index, not a mirror. Hub notes carry frontmatter (status, linear-id, repo-path, URLs, dates) + links back to in-repo docs. If you find yourself pasting PRD content into a hub note, stop — you're creating drift. The repo is the source of truth; Obsidian is the discovery surface.

---

## 2026-04-22 — claude.ai "Download all" produces a zip, not individual files

**What happened:** Updated STEP 6 to use `<antArtifact>` tags so each doc gets a Download button. Assumed individual files would land in `~/Downloads/`. Chase clarified that "Download all" produces a single zip file.

**Fix:** `scripts/install-docs` now detects the most-recently-modified `.zip` in `~/Downloads/`, unzips to `mktemp`, uses `find` to locate the `.md`-containing subdirectory, processes from there, then cleans up the temp dir and deletes the zip. Falls back to `~/Downloads/files/` then `~/Downloads/` root if no zip is found.

**Rule:** When scripting around claude.ai downloads, always account for the zip shape — that's the default for "Download all." Individual-file fallback handles one-at-a-time downloads or older claude.ai behavior.

---

## 2026-04-22 — SESSION_START templates: parallel agent writes fail silently in permission-restricted mode

**What happened:** Attempted to write 31 SESSION_START templates via parallel background agents. All failed because the agents didn't have file-write permission and were denied by the permission mode. No warning was emitted — the agents just returned incomplete results.

**Fix:** Wrote all 31 templates in the main session sequentially.

**Rule:** Background agents require the same tool permissions as the main session. If the user's permission mode restricts writes, parallel agents can't write either — don't launch them for file-creation tasks in restricted mode.

---

## 2026-04-22 — Idea Kitchen v0.1 had no path for "add a feature to an existing app"

**What happened:** v0.1 only handled new-project ideation. When Chase wanted to add a sprinkler map to Fairway iOS, the project-mode flow either forced the feature into a new-app shape (wrong — it inherits Fairway's stack/storage/branding) or skipped Idea Kitchen entirely (losing the portfolio-scan discipline that's the whole point). This meant every feature addition was vulnerable to duplicating work already shipped in Wellness, Clarity Hub, Ash Reader, Unnamed, etc., or re-solving problems YNAB / Rachio / Sprinkler Master had already solved.

**Fix:** v0.2 adds feature mode as a second entry branch. STEP 0 routes by phrasing ("build new app" → project, "add X to `<app>`" → feature). Feature mode runs STEPs 0F → 7F: target intake, cross-portfolio duplication scan (4 checks, 4-verdict gate `EXTEND_TARGET | EXTRACT_SHARED | NEW_APP | KILL`), 4-layer competitor teardown, brief + PRD + design + impl plan. Artifacts land under `portfolio/<target>/docs/features/<feature>/` — not in a new portfolio row.

**Rule:** A feature is not a mini-app. It inherits its parent's stack, storage, branding, and audit flows. Output must live with the parent, not next to it. Adding a root-table row for a feature would be a tell that the feature is actually a new app and should use project mode instead.

---

## 2026-04-22 — Portfolio scan for features needs sibling-app overlap, not just target-app overlap

**What happened:** Initial draft of STEP 1F only checked "does the target app already have this?" But the real portfolio-level question is: "does ANY app in the 39-app portfolio already have this pattern?" Example: a sprinkler map on Fairway is a MapKit integration — no other app has one, so there's nothing to lift — but if Fairway already had a map and someone proposed adding one to Wellness, the scan would want to point at it and say "lift this."

**Fix:** STEP 1F runs 4 checks, not 1: target overlap, sibling overlap (all 39 apps via SESSION_START pre-fills), shared-package candidacy (flag `ClarityUI` extraction candidates), architecture fit. 4-verdict gate lets the scan route `EXTEND_TARGET | EXTRACT_SHARED | NEW_APP | KILL` — a feature that would benefit 2+ apps becomes a shared-package extraction, not a one-off.

**Rule:** Cross-portfolio scans are the whole point. The scan should be able to answer "should this live in a shared package?" not just "does it duplicate something?" Duplication prevention is table stakes; extraction-candidate detection is the real win.

---

## 2026-04-22 — Competitor research: 4 layers beats 1 summary

**What happened:** STEP 1.5 (project mode) produces a 3-verdict gate with a short summary. That works for new apps where competitor context is coarse. But feature-mode decisions are finer — "should spray patterns render as filled circles vs arcs" is an implementation question informed by Layer 2 (UX teardown) and Layer 4 (technical approach), not just Layer 1 (feature matrix).

**Fix:** STEP 1.5F runs 4 explicit research layers: feature matrix (competitors × pricing × platform × capability × gap), UX/design teardown (icons, interaction models, onboarding), review mining (Reddit / App Store / G2 / ProductHunt top complaints), technical approach (inferred stacks, public APIs, OSS equivalents). DIFFERENTIATE verdict requires 3–5 concrete levers tied to the 4 layers, not vibes.

**Rule:** Competitor research depth should match the decision horizon. Project-mode decisions are "should this exist at all" — a summary is fine. Feature-mode decisions are "how should this render, what should it call, what edge cases will users complain about" — those need all 4 layers.

---

## 2026-04-22 — install-feature-docs needed to wire Obsidian AND 5 repo files in one command, or it'd get skipped

**What happened:** First draft of feature-mode handoff had Chase running 7 manual commands: mv artifacts, update ROADMAP, update CHANGELOG, update LEARNINGS, update HANDOFF, create Obsidian hub note, link from parent hub. That's the kind of checklist that gets done 3/7 times and then nobody remembers what's missing. Also: git-adding the Obsidian vault would commit iCloud content to a public repo.

**Fix:** `scripts/install-feature-docs <target> <feature>` does all 7 steps in one idempotent run. awk-based section-aware appends for markdown files (ROADMAP, CHANGELOG, LEARNINGS). Checks for existing entries via `grep -qF` before appending. Creates Obsidian feature hub with frontmatter + `file://` links. Adds `[[features/<slug>|<slug>]]` under `## Features` in parent hub (creates section or entire stub hub if missing). Prints summary + manual next steps (Linear issue, git commit, Claude Code paste) at the end. Explicitly does not `git add` the Obsidian vault.

**Rule:** Any handoff checklist longer than 3 steps must be a script. Humans skip steps; scripts don't. And any script that touches both the monorepo AND iCloud must hard-segregate — Obsidian vault paths should never appear in `git add` arguments.

---

## 2026-04-22 — Features don't add rows to the root portfolio table, even though they feel like they should

**What happened:** Tempting to treat each feature as an auditable unit and give it a row in the root `CLAUDE.md` Portfolio Overview table. Would make Shipyard show feature-level detail. But root table rows are already 40+ and growing; adding 3 features per app per quarter would explode it to 100+ rows in a year. Also: features don't have independent version, storage key, URL, or status — those belong to the parent app.

**Fix:** Feature mode explicitly does NOT touch root `CLAUDE.md` or trigger `npm run sync:projects`. Features are tracked in the parent app's `ROADMAP.md` feature queue + the Obsidian parent hub's `## Features` section. Shipyard shows features via the parent app's LOC / commit activity, which automatically reflects feature work.

**Rule:** Not every auditable thing gets a portfolio row. Rows are for apps. Features live under their parent, inherit the parent's row, and are surfaced via ROADMAP / CHANGELOG / Obsidian — not via a new row.
