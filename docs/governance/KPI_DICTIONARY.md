# KPI Dictionary — Portfolio Scorecard Methodology

> Defines how every Board Scorecard dimension is scored. Referenced by the executive report prompt template.
> All scores are 1.0-5.0. Every score **must** cite the data point(s) that produced it.

---

## Dimensions

### 1. Product Velocity

**What it measures:** Shipping cadence across active apps.

| Score | Criteria |
|-------|----------|
| 1.0-2.0 | 0-2 commits/week across portfolio, single-app focus |
| 2.5-3.5 | 3-5 commits/week, 2-3 apps receiving work |
| 4.0-5.0 | 6+ commits/week, 3+ apps receiving work, cross-cutting infra shipping |

**Data source:** `git log --since="30 days ago" --oneline` per app, aggregated weekly.

### 2. Product Focus

**What it measures:** How well the portfolio avoids overlap and stays organized.

| Score | Criteria |
|-------|----------|
| 1.0-2.0 | No product line definitions, significant feature overlap between apps |
| 2.5-3.5 | Product lines defined but overlap remains in 2+ areas |
| 4.0-5.0 | Every app mapped to a product line, overlap documented and being resolved |

**Data source:** `docs/governance/PRODUCT_LINES.md` exists + overlap items in ROADMAP.md.

### 3. Technical Foundation

**What it measures:** Build health, shared code consistency, and codebase hygiene.

| Score | Criteria |
|-------|----------|
| 1.0-2.0 | Builds failing, no shared code, files >1500 lines |
| 2.5-3.5 | Builds pass, shared code exists but drifts, some large files |
| 4.0-5.0 | All builds green, 0 shared file drift, no file >500 lines, CI covers all apps |

**Data source:** `scripts/portfolio-health-check` output — build pass/fail, drift count, largest file sizes.

### 4. Security / Data Governance

**What it measures:** Secrets hygiene, dependency safety, and policy enforcement.

| Score | Criteria |
|-------|----------|
| 1.0-2.0 | Hardcoded secrets found, npm audit criticals, no security checklist |
| 2.5-3.5 | No hardcoded secrets, some npm audit warnings, checklist exists but incomplete |
| 4.0-5.0 | Clean secrets scan, 0 critical/high npm audit, security checklist complete for all shipped apps |

**Data source:** `grep -r` scan for secrets patterns + `npm audit --json` per app + checklist completion count.

### 5. Documentation / Memory

**What it measures:** Freshness and coherence of project docs.

| Score | Criteria |
|-------|----------|
| 1.0-2.0 | HANDOFF.md >30 days stale, CHANGELOG not updated, CLAUDE.md contradicts reality |
| 2.5-3.5 | HANDOFF.md <14 days, CHANGELOG mostly current, minor drift |
| 4.0-5.0 | HANDOFF.md <7 days for active apps, CHANGELOG current, 0 doc-vs-reality contradictions |

**Data source:** `git log -1 --format=%ai` on each app's HANDOFF.md and CHANGELOG.md.

### 6. Marketing Readiness

**What it measures:** Whether apps could be shown to external users today.

| Score | Criteria |
|-------|----------|
| 1.0-2.0 | No BRANDING.md, README is dev-only, no launch checklist |
| 2.5-3.5 | Some apps have BRANDING.md, README partially user-facing |
| 4.0-5.0 | All shipped apps have BRANDING.md + user-facing README + completed launch checklist |

**Data source:** File existence check: `docs/BRANDING.md`, user-facing README section, `LAUNCH_CHECKLIST.md`.

### 7. Financial Efficiency

**What it measures:** Ratio of value-producing apps to total maintained surface area.

| Score | Criteria |
|-------|----------|
| 1.0-2.0 | >50% of maintained apps have unclear value or audience |
| 2.5-3.5 | Most apps serve a clear purpose, some overlap creates maintenance drag |
| 4.0-5.0 | Every maintained app has a defined user + job, archive policy enforced |

**Data source:** Product line classification coverage + archive policy compliance.

### 8. Operating Model Maturity

**What it measures:** Adherence to defined review cadences and stage gates.

| Score | Criteria |
|-------|----------|
| 1.0-2.0 | No defined cadence, ad hoc prioritization |
| 2.5-3.5 | Cadence defined (OPERATING_MODEL.md), partially followed |
| 4.0-5.0 | All hat rituals followed on cadence, stage gates used for launches |

**Data source:** Evidence of ritual execution (git commits on review days, Linear updates, etc.).

---

## Baseline Scores (2026-04-14)

> First report. These become the comparison baseline for all future reports.

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Product Velocity | 4.5 | 7 commits in 14 days, 4+ apps touched, shared auth shipped cross-app |
| Product Focus | 2.5 | No product line doc yet, overlap documented in ROADMAP |
| Technical Foundation | 3.0 | Builds pass for 4 CI apps, shared sync.js exists but auth.js not canonicalized, TrackerTab 1420 lines |
| Security/Data | 2.5 | .env gitignored, Supabase RLS in place, but no formal checklist or audit scan |
| Documentation | 4.0 | HANDOFF.md updated today, CHANGELOG current, minor CLAUDE.md drift |
| Marketing Readiness | 2.0 | No BRANDING.md on most apps, READMEs are dev-focused |
| Financial Efficiency | 3.0 | Most apps serve clear purpose, but high surface-area maintenance |
| Operating Model | 2.5 | ROADMAP priority queue exists, no formal cadence or stage gates |

**Portfolio average: 3.0**
