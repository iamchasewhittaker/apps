# Portfolio Analysis Handoff

> Paste this into a new Claude Code session opened from `~/Developer/chase`.

---

## Goal

Analyze the full 38-app portfolio for strengths and weaknesses. This is a read-only strategic analysis — no code changes, no file modifications beyond writing the final report.

Produce: `chase/portfolio/PORTFOLIO_ANALYSIS.md`

---

## Read first (required context)

1. `chase/CLAUDE.md` — full portfolio table (38 apps, status, storage keys, URLs)
2. `chase/portfolio/STRATEGY.md` — C-suite strategy doc: exec summary, M-scores 0–10 per app, top-4 monetization roadmap, brand-from-zero playbook, deprecation candidates
3. `chase/portfolio/STRATEGY.md` section 4 — Project Portfolio Table (already has M-scores and recommended actions)
4. Money audit reports (already written):
   - `chase/portfolio/job-search-hq/MONEY_AUDIT.md`
   - `chase/portfolio/gmat-mastery-web/MONEY_AUDIT.md`
   - `chase/portfolio/clarity-budget-web/MONEY_AUDIT.md`
   - `chase/portfolio/unnamed/MONEY_AUDIT.md`
5. iOS launch reports (already written):
   - `chase/portfolio/unnamed-ios/LAUNCH_IOS.md`
   - `chase/portfolio/clarity-command-ios/LAUNCH_IOS.md`
   - `chase/portfolio/wellness-tracker-ios/LAUNCH_IOS.md`
   - `chase/portfolio/ash-reader-ios/LAUNCH_IOS.md`
6. `chase/identity/voice-brief.md` — voice rules for any text you write

---

## Analysis scope

### 1. Technical strengths
- Which apps are the most technically complete (tests, clean builds, real deploys)?
- Which have the cleanest architecture (separation of concerns, maintainability)?
- Which have the best accessibility story?
- What patterns are used well across the portfolio (shared sync.js, ClarityUI, Supabase auth)?

### 2. Technical weaknesses
- Which apps have no tests, no build CI, or are CRA (Create React App — deprecated bundler)?
- Which have unresolved tech debt (TODOs, FIXMEs in tracked files)?
- Which have stack mismatches (e.g., Vite vs CRA in the same ecosystem)?
- Which iOS apps have known issues (alpha-channel icons, iPad family misconfigured, sync vs. local-only mismatch)?

### 3. Business strengths
- Which apps have the clearest value proposition?
- Which have the most monetization-ready infrastructure (Supabase auth + RLS, real deploys, analytics hooks)?
- Which target audiences with demonstrated willingness to pay (YNAB users, GMAT candidates, job seekers)?
- Which have the highest M-scores from STRATEGY.md and why?

### 4. Business weaknesses
- Zero MRR across 38 apps — what's the root pattern?
- Which apps have unclear or no target audience?
- Which have unclear differentiation from free alternatives?
- Which have no deployment (local-only with no shipping plan)?
- Which are in direct competition with each other internally (Clarity Hub vs standalone Clarity apps, Funded Web vs Clarity Budget)?

### 5. Portfolio overlap and gaps
- Map overlaps: which apps do similar things for similar audiences?
- Map gaps: what problem areas does the portfolio NOT cover that Chase's target audiences actually have?
- Which overlaps are redundant (kill or merge candidates)?
- Which gaps are worth filling given Chase's strengths?

### 6. Prioritization verdict
Using inputs from STRATEGY.md, the money audits, and your own analysis, produce a tiered list:

**Tier 1 — Monetize now (top 4):** Already identified in STRATEGY.md. Confirm or adjust based on audit findings.

**Tier 2 — Hold (build quality, don't launch yet):** Apps that are good ideas but not ready. What they need.

**Tier 3 — Archive (don't invest further):** Apps where the cost of maintaining exceeds any realistic revenue. Be specific: why archive, not just "it's old."

**Tier 4 — Merge (consolidate into another app):** Apps that would be stronger as a feature of a parent app.

---

## Output format

Write to `chase/portfolio/PORTFOLIO_ANALYSIS.md`. Use this structure:

```markdown
# Portfolio Analysis — <date>

## Executive summary
<5-6 bullets. The most important findings. Someone who reads only this section should understand the portfolio's state.>

## Technical
### Strengths
### Weaknesses
### Recommended fixes (top 3 only — highest leverage)

## Business
### Strengths
### Weaknesses
### Revenue readiness ranking (all apps, brief)

## Overlap map
<Table: App A ↔ App B — what overlaps — recommendation>

## Gap map
<Table: Audience — Problem they have — Does portfolio cover it? — Worth filling?>

## Prioritization

### Tier 1 — Monetize now
### Tier 2 — Hold
### Tier 3 — Archive
### Tier 4 — Merge

## 30-day action plan
<10 concrete tasks, ordered by impact. Not "improve X" — specific enough to start immediately.>
```

---

## Voice rules

- No em-dashes. Use periods, commas, or a second sentence.
- No rule-of-threes. Pick one or four.
- No consultant phrasings: banned `leverages`, `synergies`, `value-add`, `compounds`, `unlocks`, `transformative`, `passionate`, `thrilled`.
- Lead with gaps, not praise.
- Short sentences. Plain language.

---

## What this analysis is NOT

- Not a code audit (use `/audit` for that)
- Not a money audit (already done — reference the outputs)
- Not a redesign or feature planning session
- Not destructive — recommendations only, no files deleted

---

## Context: who Chase is

- Laid off 1+ year, job hunting daily (5 apps + 3 outreach)
- 38 portfolio apps, zero MRR
- CliftonStrengths Top 5: Harmony, Developer, Consistency, Context, Individualization
- ADHD + anxiety, LDS faith, father of two (Reese and Buzz)
- Mission: "For Reese. For Buzz. Forward — no excuses."
- Low confidence in public-expert positioning, no existing audience
- Prefers "sell artifacts, not yourself" income paths over personal brand
- 60–90 day target: first paying customer

Full strategy context in `chase/portfolio/STRATEGY.md`.
