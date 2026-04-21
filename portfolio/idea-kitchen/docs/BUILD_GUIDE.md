# Build Guide — The Idea Kitchen Workflow

> Read this end-to-end once. After that, skim it for the sections you need.

---

## 1. Why this system exists

Before Idea Kitchen, every new app meant:

- Re-explaining the portfolio conventions in each chat.
- Drift between what the plan said and what got built.
- No visual surface for "what am I making."
- Burning tokens on context Chase has already typed ten times.

Idea Kitchen is one loop that takes a raw idea, walks it through Phases 1–3 of `PRODUCT_BUILD_FRAMEWORK.md`, produces six handoff docs, and hands off to Claude Code with a kickoff prompt that's ready to paste.

It also dogfoods itself. This app follows every rule it teaches.

---

## 2. Mental model

Two halves:

- **Ideation half** — a Claude Project on claude.ai. Conversational. Names, shapes, pressure-tests the idea. Produces artifacts. Never writes code.
- **Build half** — Claude Code in the terminal. Reads the artifacts. Scaffolds. Ships vertical slices.

The bridge between them is six markdown files: `PRODUCT_BRIEF.md`, `PRD.md`, `BRANDING.md`, `APP_FLOW.md`, `SHOWCASE.md`, and `SESSION_START_<SLUG>.md`.

`SHOWCASE.md` is the visual surface. Shipyard renders it at `/ship/<slug>` (Phase 2 of this app's roadmap). Until then it's a well-organized markdown page.

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
4. Go through STEPS 1–5 one message at a time. Sign off at each gate.
5. At STEP 6, copy the six fenced blocks into real files:
   - `portfolio/<slug>/docs/PRODUCT_BRIEF.md`
   - `portfolio/<slug>/docs/PRD.md`
   - `portfolio/<slug>/docs/BRANDING.md`
   - `portfolio/<slug>/docs/APP_FLOW.md`
   - `portfolio/<slug>/docs/SHOWCASE.md`
   - `SESSION_START_<SLUG>.md` (repo root, temporary)
6. Follow STEP 7's numbered checklist. Scaffold the app.
7. Open a fresh Claude Code session. Paste `SESSION_START_<SLUG>.md`. Claude Code reads context and executes Milestone 0.
8. Claude Code stops after Milestone 0, commits, and waits.
9. You review. You either approve Milestone 1 or pause.
10. End of session: run the 12-step checklist (below).

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
10. **`/audit` before push** on non-trivial changes. Takes two minutes. Catches the obvious stuff.
11. **No speculative abstractions.** Three similar lines is better than a premature abstraction. Don't add a helper for "one day we might need."
12. **15-minute stuck rule.** If you've been stuck 15 minutes, change approach or ask. Don't grind.

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

```
Claude Project → paste idea → STEP 0 intake → STEPs 1–5 one-at-a-time
STEP 6 → copy 6 fenced blocks into real files
STEP 7 → scaffold (new-app or Xcode or manual), commit, update CLAUDE.md, sync Shipyard
STEP 8 (optional) → WIP summary for resume
STEP 9 → pattern capture

Fresh Claude Code session → paste SESSION_START_<SLUG>.md
Milestone 0 scaffold → commit → stop
Review → approve Milestone 1 or pause

End of session:
  checkpoint → CHANGELOG → ROADMAP → HANDOFF → LEARNINGS → SHOWCASE
  → Linear → Shipyard sync → commit → push → report
```
