# Reusable Prompt — Portfolio Executive Report Pack

Copy/paste this into your AI tool when you want to regenerate the full portfolio executive package.

---

You are a senior technical program manager and portfolio strategist auditing a solo developer's app portfolio.

I need a complete executive portfolio assessment across my local workspace and authenticated GitHub account(s).

## Pre-Flight (REQUIRED — run before analysis)

Before writing any analysis, collect quantitative evidence:

1. **Run `scripts/portfolio-health-check`** (full mode, not --fast) and include the full output in your analysis. Every claim must reference this data.
2. **Read `docs/governance/KPI_DICTIONARY.md`** — use it to calculate all scorecard scores. Every score must cite a data point.
3. **Read `docs/governance/PRODUCT_LINES.md`** — understand the 3 product lines and how apps are classified.
4. **Read `docs/governance/OPERATING_MODEL.md`** — use the 5 Hats model, not a corporate RACI.
5. **Check for previous reports** in `docs/reports/portfolio-executive-*/BOARD_SCORECARD.md` — if found, include delta reporting (score changes, trend arrows).
6. **Read Linear state** — list open issues/projects and cross-reference against recommendations.

## Goal

Create a full leadership report pack that explains:
- what each app/project is and which product line it belongs to
- where there is overlap and what's being done about it
- what should be condensed, kept, incubated, or retired
- what is missing in the portfolio
- where priority development should go next
- **what changed since the last report** (delta section)

## Scope

- Include all project types: client-facing apps, internal tools, experiments/prototypes, archived/legacy projects
- Use both: local workspace folder structure + GitHub repository metadata
- Reference the product line classification from `docs/governance/PRODUCT_LINES.md`

## Analysis Structure

### Primary: Five Hats Analysis

Structure the core analysis around the solo-builder operating model (from `docs/governance/OPERATING_MODEL.md`):

| Hat | Analysis Focus |
|-----|---------------|
| **Builder** | What shipped recently? What's next? Velocity metrics from health-check. |
| **Architect** | System health, shared file drift, largest files, build status, dependency audit. Use health-check data. |
| **Operator** | Live URL status, auth health, deployment status, error reports. Use health-check data. |
| **Product** | Product line coherence, overlap analysis, kill/incubate decisions, roadmap alignment. |
| **Storyteller** | Marketing readiness per product line, BRANDING.md coverage, README quality, launch checklist status. |

### Optional: Executive Lens Deep-Dives

If a specific executive audience is requested, add focused sections for:
- CTO (architecture, tech debt, platform priorities)
- CMO (marketing readiness, launch timing, messaging)
- CFO (investment tiers, maintenance cost, ROI)
- CIO/CDO (data security, governance, data quality)
- CPO (product strategy, user journeys, overlap)
- COO (delivery throughput, operating cadence)
- Legal/Compliance (privacy, AI usage, terms)

## Required Analysis Areas

1. **Portfolio inventory matrix** (project, purpose, product line, status, LOC, commits/30d, maturity)
   - Use LOC and commit data from health-check output
2. **Similar-app comparison matrix** (overlap, difference, recommendation)
3. **Strengths, weaknesses, risks, and missing capabilities**
   - Every weakness must cite evidence (file size, drift count, missing doc, etc.)
4. **Keep / Merge / Retire / Incubate recommendations**
   - Reference archive classes from `docs/governance/ARCHIVE_POLICY.md`
5. **Security and data governance analysis**
   - Use secrets scan + npm audit data from health-check
   - Reference checklist from `docs/governance/SECURITY_CHECKLIST.md`
6. **Stage-gate status per app**
   - Reference `docs/governance/LAUNCH_CHECKLIST.md` — which gate has each app passed?
7. **Delta reporting** (if previous report exists)
   - Score changes with trend arrows (up/down/flat)
   - New issues since last report
   - Resolved items since last report
8. **Time-phased recommendations**: 2 weeks, 30 days, 90 days, 6 months, 12 months
   - Every recommendation must include: what, which app, effort (S/M/L), dependency

## Board Scorecard Requirements

Use `docs/governance/KPI_DICTIONARY.md` for ALL scores. Each score must include:
- The numeric score (1.0-5.0)
- Trend arrow (up/down/flat) — compare to previous report if it exists
- The specific evidence that produced the score
- One-line "what would move this score up"

## Evidence Rules

- **No unverified claims.** If you say "monolith risk", cite the file and its line count.
- **No decorative scores.** Every number must trace to health-check output or measurable criteria.
- **No aspirational RACI.** Use the hats model. This is a solo builder.
- **Actionable format.** Every recommendation: what to do, which app, effort (S/M/L), what it depends on.

## Output Files to Generate

Use this folder naming pattern:
- `docs/reports/portfolio-executive-YYYY-MM-DD/`

Generate at minimum:
1. `EXECUTIVE_PORTFOLIO_REPORT.md` (full deep-dive using hats analysis)
2. `BOARD_SCORECARD.md` (board one-pager with quantitative scores)
3. `EXECUTIVE_PORTFOLIO_REPORT_SIMPLE.md` (non-technical plain-English version)
4. `EXECUTIVE_PORTFOLIO_REPORT_KIDS_ONE_PAGE.md` (ultra-simple one page)
5. `mini-site/` presentation pages:
   - `index.html`
   - Section pages (one per major section)
   - Shared `styles.css`
   - Data tables from health-check output embedded in relevant pages

## Mini-Site Requirements

Each mini-site section page must include:
- High-level summary
- Key metrics or findings (with actual numbers from health-check)
- Data table or chart where applicable
- Recommendation with owner hat and timing
- Next step

## Writing Quality Rules

- Be direct and concrete. No corporate filler.
- Use evidence from actual repo files, health-check output, and git metadata.
- Do not hide uncertainty — call out assumptions.
- Use plain language in simplified versions.
- Keep recommendations actionable (hat + timing + expected outcome).
- Frame everything for a solo builder, not an enterprise team.

## Final Check Before Finishing

Before concluding:
1. Confirm all required sections exist.
2. Confirm all required output files exist.
3. Confirm every scorecard score cites evidence from health-check or KPI dictionary.
4. Confirm delta reporting is included (or noted as "first report" if no previous exists).
5. Confirm archived projects were included with explicit archive class.
6. Confirm hat-based analysis is present (not just executive lenses).
7. Confirm every recommendation has: what, which app, effort, dependency.

Return:
- Quick summary of what was created
- Exact file paths
- Top 5 decisions to make first
- Comparison to previous report scores (if applicable)

---

Optional custom inputs each time:
- Portfolio focus this cycle: [fill]
- Priority audience this cycle: [fill]
- Strategy horizon emphasis: [fill]
- Known constraints or budget limits: [fill]
