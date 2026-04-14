# Reusable Prompt — Portfolio Executive Report (Fast Mode)

Use this for quick weekly refreshes. Produces a lightweight delta report, not a full deep-dive.

---

You are a senior technical program manager.

Create a fast weekly executive portfolio refresh using my local workspace and authenticated GitHub metadata.

## Pre-Flight (REQUIRED)

1. **Run `scripts/portfolio-health-check --fast`** and include the output as evidence.
2. **Read the most recent report** at `docs/reports/portfolio-executive-*/BOARD_SCORECARD.md` for delta comparison.
3. **Read `docs/governance/KPI_DICTIONARY.md`** for scoring methodology.
4. **Read `docs/governance/PRODUCT_LINES.md`** for product line context.

## Timebox

Optimize for speed and clarity.
Do not produce a full deep-dive.
Focus on: what changed, what drifted, risks, and next decisions.

## Scope

- Active projects first
- Archived projects only if they changed or affect decisions
- Internal tools only if they impact delivery this week

## Required outputs

Write to:
- `docs/reports/portfolio-executive-YYYY-MM-DD/`

Create:
1. `WEEKLY_EXECUTIVE_REFRESH.md`
2. `WEEKLY_BOARD_SCORECARD.md`
3. `WEEKLY_SIMPLE_SUMMARY.md`

## Required sections (short, evidence-backed)

1. **What changed this week** — cite git log evidence
2. **Health check results** — embed key numbers from portfolio-health-check output
3. **Top 3 drift items** — shared file drift from health-check + doc freshness issues
4. **Top 5 risks** — with evidence
5. **Top 5 wins** — with evidence
6. **Overlap/consolidation updates** — reference product line doc
7. **Security/data watch items (Operator hat)** — from health-check secrets scan + npm audit
8. **Marketing/launch watch items (Storyteller hat)** — BRANDING.md and launch checklist status
9. **Top decisions needed this week** (owner hat + date)
10. **Next 2-week priorities** — from ROADMAP.md priority queue

## Delta Scorecard format

Use simple Red/Amber/Green status with trend arrows for:
- Product Velocity (commits/week from health-check)
- Product Focus (overlap status from product line doc)
- Technical Foundation (build + drift + largest files from health-check)
- Security/Data (secrets scan + audit from health-check)
- Documentation (doc freshness from health-check)
- Marketing Readiness (BRANDING.md + README coverage)
- Operating Model (cadence adherence evidence)

Each score must:
- Reference `docs/governance/KPI_DICTIONARY.md` methodology
- Include trend arrow vs. last scorecard
- Cite specific health-check data point

## Fast mode quality rules

- Keep it concise and practical.
- Use bullet points over long paragraphs.
- Include only evidence that matters this week.
- Flag assumptions clearly.
- End with a short action list with hat assignments.
- Every recommendation: what, which app, effort (S/M/L).

## Return format

At the end, provide:
- Files created
- 3 most important decisions needed now
- Score changes from last report (if applicable)

---

Optional weekly inputs:
- Main focus this week: [fill]
- Biggest blocker: [fill]
- Priority hat this week: [fill]
