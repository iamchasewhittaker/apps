# Learning Documentation Guide

A practical guide to Chase's learning capture system. Use this to understand where to record decisions, patterns, vocabulary, and reflections as you build.

---

## Quick Reference

| Document | Location | Purpose | Updated |
|----------|----------|---------|---------|
| **DECISIONS.md** | `portfolio/<app>/DECISIONS.md` | Record architectural & design choices | Per-app, as decisions arise |
| **PATTERNS.md** | `/PATTERNS.md` (root) | Reusable code recipes across all apps | When a pattern is discovered |
| **AI_PLAYBOOK.md** | `/AI_PLAYBOOK.md` (root) | Prompting strategies & AI techniques | When a technique works/fails |
| **GLOSSARY.md** | `/docs/GLOSSARY.md` | Vocabulary: AI, Dev, DevOps, PM terms | As new terms are encountered |
| **Session Ritual** | CLAUDE.md step 6b | Reflection question + 1 min of thought | End of every dev session |

---

## 1. DECISIONS.md — Architecture Decisions per App

### What It Is
A lightweight ADR (Architecture Decision Record) log for each active app. Captures the *why* behind choices: framework selection, data model design, auth approach, deployment strategy, etc.

### Where It Lives
```
portfolio/<app>/DECISIONS.md
```

Examples:
- `portfolio/fairway-ios/DECISIONS.md`
- `portfolio/clarity-budget-web/DECISIONS.md`
- `portfolio/job-search-hq/DECISIONS.md`

### Format
Each decision is a timestamped entry:

```markdown
## YYYY-MM-DD — Decision Title

**Context:** 1-3 sentences on what prompted this choice.
Example: "Building OAuth login flow; needed to decide between custom JWT or Supabase Auth."

**Options considered:**
1. **Option A** — Brief pro/con summary
2. **Option B** — Brief pro/con summary

**Decision:** Option chosen — one sentence.
Example: "Use Supabase Auth for faster time-to-market."

**Why:** What made this option win (security, velocity, maintenance, cost, etc.)

**Revisit when:** Condition to reopen this decision, or "N/A"
Example: "If we exceed 10k users and need custom session logic"

> **Chase:** (Reflection appended at session end)
```

### How to Use It

**During development:**
1. When you make a choice between real alternatives → add an entry
2. Include both options and tradeoffs — shows engineering maturity
3. Leave `> **Chase:**` line empty; filled at session end

**At session end (step 6b):**
If a decision was made today, you'll be asked a reflection question:
- "What would make you revisit this decision?"
- "If you explained this to an interviewer in 15 seconds, what would you say?"

Answer with 1-2 sentences and it gets appended.

**Later use:**
- Interview prep: "Show me a decision you wrestled with" → open DECISIONS.md
- Rewriting features: "Did we try this before?" → scan decisions for past context
- Onboarding: "Why did you pick this stack?" → quick reference

### When NOT to Log
- Obvious fixes (bug = bug, no decision)
- Routine feature work (normal flow, no tradeoff)
- Personal preference with no real alternative

---

## 2. PATTERNS.md — Reusable Code Recipes

### What It Is
A cross-app cookbook of code patterns that worked. Organized by technology (React, Supabase, Swift, Tailwind, Vercel, Architecture). When you solve something once, log it so future apps don't rediscover it.

### Where It Lives
```
/PATTERNS.md (repo root)
```

### Format
Each pattern is a short, linked recipe:

```markdown
### Pattern Name
**When:** The trigger or problem this solves
Example: "When you need to share state between React components without prop drilling"

**Recipe:** What to do (2-3 lines, not a tutorial)
Example: "Create a Context + custom hook. Define context, wrap Provider, export hook for consumers."

**Example:** `portfolio/<app>/path/to/file.ts` — function or component name
Example: `portfolio/clarity-budget-web/app/context/TransactionContext.tsx` — useTransactions

**Learned:** YYYY-MM-DD
Example: "2026-04-15"
```

### Current Patterns
The guide ships with ~20 pre-seeded patterns from existing apps. Browse by section:
- **React** — Custom hooks, context, composition
- **Supabase** — Auth, real-time sync, migration safety
- **Swift/SwiftUI** — State management, Codable safety, navigation
- **Tailwind** — Responsive utilities, dark mode
- **Vercel** — Preview deploys, edge functions, environment vars
- **AI Integration** — Tool use, prompt engineering, token budgets
- **Architecture** — Monorepo structure, event sourcing, error handling

### How to Use It

**During development:**
1. Stuck on a problem? Search PATTERNS.md first
2. Found the pattern? Jump to the example app and read the real code
3. Adapt it to your app

**At session end (step 6b):**
If you discovered a reusable pattern, you'll be asked:
- "Where else in the portfolio could this save time?"
- "When would this pattern break?"

Append your answer and the pattern goes into PATTERNS.md.

**Growth:**
Patterns grow incrementally. Don't backfill all 40 apps at once — add as you discover.

---

## 3. AI_PLAYBOOK.md — Prompting Strategies & Techniques

### What It Is
A log of AI prompting techniques, session management tricks, and tool use strategies that worked (or spectacularly failed). Organized by category: Session Management, Claude Code, Cursor, Prompting Techniques, Tool Comparison.

### Where It Lives
```
/AI_PLAYBOOK.md (root)
```

### Format
Each technique is a brief entry:

```markdown
### Technique Name
**What:** Description of the technique or strategy

**Why it works/fails:** Explanation (or why it failed — learning from failures is valuable)

**Source:** Where discovered (app name, session, or date)

**Example:** Concrete example if helpful
```

### Current Sections
- **Session Management** — How to structure long sessions, when to split, pacing
- **Claude Code** — File organization, tool use patterns, debugging strategies
- **Cursor** — Windsurf-specific prompting, composability
- **Prompting Techniques** — Chain-of-thought, role-playing, constraint-based prompts
- **Tool Comparison** — When to use Claude Code vs. Cursor vs. Browser tools
- **What Doesn't Work** — Common pitfalls and dead ends

### How to Use It

**During development:**
1. Stuck on a prompt? Check if a similar technique is logged
2. Try it; adapt for your context
3. Note if it works differently than expected

**At session end (step 6b):**
If an AI technique was notably effective or ineffective, you'll be asked:
- "What made this approach click vs. times it didn't?"

Append your answer and the technique gets refined in AI_PLAYBOOK.md.

**Growth:**
Build this over time. Each session adds 0-1 new entries. Some entries get refined with new examples.

---

## 4. GLOSSARY.md — Vocabulary Index

### What It Is
A reference glossary of technical terms organized by domain: AI/ML, Dev Architecture, DevOps/CI, PM/Agile. Build a shared vocabulary as you learn.

### Where It Lives
```
/docs/GLOSSARY.md
```

### Format
Standard glossary table:

```markdown
| **Term** | Meaning |
|----------|---------|
| **Token** | Smallest unit of text Claude processes; roughly 4 chars. Context window = max tokens per request. |
| **RAG** | Retrieval-Augmented Generation — feeding external docs into a prompt to ground answers. |
```

### Current Sections
- **AI/ML** — tokens, context window, RAG, embeddings, fine-tuning, temperature, agents, MCP, hallucination, grounding
- **Dev Architecture** — ADR, middleware, edge functions, SSR/SSG/ISR, hydration, ORM, migrations, webhooks, monorepo, DDD, CQRS
- **DevOps/CI** — CI/CD, GitHub Actions, artifact, deploy preview, environment variables, secrets, rollback, canary
- **PM/Agile** — sprint, epic, story points, velocity, standup, retro, backlog grooming, acceptance criteria

### How to Use It

**During development:**
1. Encounter a term you don't fully know → search GLOSSARY
2. Not there? Read it, understand it, add it at session end

**At session end (step 6b):**
If a new technical term was used this session that you might benefit from defining, you'll be asked to add it. Append the term + 1-2 sentence definition.

**Growth:**
Incrementally built. Currently ~60+ entries; grows as you learn.

---

## 5. Session-End Ritual: Step 6b — Reflection

### What It Is
A 1-minute reflection step that captures decisions, patterns, vocabulary, and AI techniques *while they're fresh*. Runs at the end of every dev session.

### Where It's Defined
`/CLAUDE.md` — step 6b (after step 6: LEARNINGS)

### The Flow

At session end, step 6b asks:

> **6b. Capture decisions, patterns, and vocabulary** — If an architectural or design choice was made, append to `DECISIONS.md`. If a reusable pattern was discovered, append to `PATTERNS.md`. If an AI technique was notably effective or ineffective, append to `AI_PLAYBOOK.md`. If a new term was used, append to `docs/GLOSSARY.md`. **Skip any that don't apply.** Then ask Chase one reflection question (rotate based on context) and append his answer as the `> **Chase:**` line.

### The Reflection Question Bank

Claude rotates through questions based on session context:

**Decisions:**
- "What would make you revisit this decision?"
- "If you explained this to an interviewer in 15 seconds, what would you say?"

**Patterns:**
- "Where else in the portfolio could this save time?"
- "When would this pattern break?"

**AI/Prompting:**
- "What made this approach click vs. times it didn't?"
- "How would you teach this technique to another Claude user?"

**General (if multiple types or unclear):**
- "What's the one thing from this session you want to remember in 6 months?"

### How to Engage

**During session:** Just code. Don't worry about logging yet.

**At session end:** Claude will ask step 6b.

**Your part:**
1. If the entry applies → answer the reflection question (1-2 sentences)
2. If it doesn't apply → say "skip"
3. Claude appends your answer to the relevant doc

**Why 1 minute, not zero friction?**
- Zero friction (auto-draft only) loses nuance and personal judgment
- Full deliberation (hour-long retrospective) is unsustainable
- 1 minute of thought: captures *why* something matters to you, not just *what* happened

---

## 6. How They Connect

### During a Dev Session

```
Start work
    ↓
Make decision (choose between options)
    ↓
Discover reusable pattern
    ↓
Try new AI prompting technique
    ↓
Encounter unfamiliar term
    ↓
End of session → Step 6b triggers
    ↓
Claude asks: "Decision made? Reflect: [question]"
You answer: "Yeah, chose Supabase Auth for speed"
    ↓
Claude appends to portfolio/<app>/DECISIONS.md
    ↓
Claude asks: "Pattern discovered? Reflect: [question]"
You answer: "Context API + custom hook works well; skip"
    ↓
[Same for AI_PLAYBOOK, GLOSSARY, if applicable]
    ↓
All docs committed in same session
```

### Across Sessions & Interviews

```
6 months later: "Tell me about an architectural decision"
    ↓
Open portfolio/<app>/DECISIONS.md
    ↓
See: context + options + why + reflection
    ↓
"I chose Supabase Auth because we prioritized velocity. 
  Looking back, I'd revisit if we hit custom session logic needs..."
    ↓
Shows: thoughtful trade-off thinking + willingness to revisit
```

### Backfill & Audit Trail

The system starts with 5 apps backfilled (fairway-ios, clarity-budget-web, job-search-hq, unnamed-ios, clarity-command). As you work on other apps:
- First decision/pattern/term triggers step 6b
- New DECISIONS.md files auto-scaffold from template
- Entries accumulate organically

Future work (Linear WHI-89): Full audit trail across all 40+ apps. Not urgent; happens as apps become active.

---

## 7. File Locations Cheat Sheet

```
/PATTERNS.md                              ← Reusable code recipes (all apps)
/AI_PLAYBOOK.md                           ← Prompting strategies & techniques
/CLAUDE.md                                ← Step 6b in session-end ritual (line ~410)
/LEARNING_GUIDE.md                        ← This file
/docs/GLOSSARY.md                         ← Vocabulary (AI, Dev, DevOps, PM)
/docs/DECISIONS_HIGHLIGHTS.md             ← Interview greatest hits (10-15 curated)
/docs/templates/DECISIONS_TEMPLATE.md     ← Template for new DECISIONS.md files

portfolio/<app>/DECISIONS.md              ← Per-app architecture decisions
  Example: portfolio/fairway-ios/DECISIONS.md
  Example: portfolio/clarity-budget-web/DECISIONS.md
  Example: portfolio/job-search-hq/DECISIONS.md
  Example: portfolio/unnamed-ios/DECISIONS.md
  Example: portfolio/clarity-command/DECISIONS.md

portfolio/<app>/LEARNINGS.md              ← Per-app session reflections (existing)
portfolio/<app>/ROADMAP.md                ← Per-app roadmap (existing)
portfolio/<app>/CHANGELOG.md              ← Per-app changelog (existing)
portfolio/<app>/HANDOFF.md                ← Per-app handoff notes (existing, optional)
```

---

## 8. FAQ

**Q: Do I have to log every decision?**
A: No. Log choices where you genuinely weighed alternatives. Skip obvious fixes or routine work.

**Q: What if I forget to answer the reflection question?**
A: Say "skip" or just don't answer. It's one minute, not a blocker. Move on.

**Q: Can I edit old entries?**
A: Yes. Decisions/patterns/techniques can be refined as you learn more. Append updates with a date.

**Q: Do I need DECISIONS.md in all 40 apps right now?**
A: No. Only active apps get one. New apps auto-scaffold it from the template when they first go through step 6b.

**Q: What's the difference between PATTERNS.md and LEARNINGS.md?**
A: **LEARNINGS.md** = session reflections (per-app, free-form)
**PATTERNS.md** = reusable recipes (cross-app, structured, copy-paste ready)

**Q: Can I look at other apps' DECISIONS.md as examples?**
A: Absolutely. That's the point. Start with fairway-ios or clarity-budget-web to see the format in action.

**Q: How long should my reflection answer be?**
A: 1-2 sentences. If you're writing a paragraph, you're overthinking it.

**Q: What if I'm working on something that doesn't fit these categories?**
A: That's fine. Step 6b says "skip any that don't apply." Not every session generates a new pattern or decision.

---

## 9. Getting Started

**First use:**
1. Read this guide (you just did)
2. Look at one existing DECISIONS.md: `portfolio/fairway-ios/DECISIONS.md`
3. Skim PATTERNS.md and AI_PLAYBOOK.md to see what's there
4. Work normally; step 6b will kick in at session end

**Building the system over time:**
- Each session: 0-1 new entries (usually 0)
- Each month: ~4-8 new entries across all docs
- Over a year: ~100 decisions, 30 patterns, vocabulary for everything you've built

**Interview prep:**
1. Open `docs/DECISIONS_HIGHLIGHTS.md` (curated greatest hits)
2. Expand to full DECISIONS.md for any you want to discuss
3. Use as talking points for "tell me about a decision you made"

---

## 10. Updates & Maintenance

**Master docs auto-commit:**
- After every session, step 6b entries are committed to git
- CHANGELOG, ROADMAP, HANDOFF auto-update per the ritual
- No manual push needed — all automatic

**Shipyard sync:**
- After every session, Shipyard updates the portfolio dashboard
- DECISIONS.md counts appear in project summaries
- Visible at: https://shipyard.iamchasewhittaker.com

**Linear tracking:**
- WHI-88: Learning documentation system (Done)
- WHI-89: Full audit trail across all apps (Backlog, future)

---

**Last updated:** 2026-04-29  
**Status:** Complete. Ready for daily use.
