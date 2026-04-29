# Decision Highlights — Interview Greatest Hits

> Curated list of the 15 best architecture and design decisions across the portfolio.
> Use this in interviews: pick one entry, open the full DECISIONS.md, and walk through it.
>
> Each entry shows what makes it interesting for a technical conversation.

---

| # | App | Decision | Why it's a good interview story |
|---|-----|----------|----------------------------------|
| 1 | `clarity-budget-web` | [Separate row for OAuth tokens](../portfolio/clarity-budget-web/DECISIONS.md) | Shows security thinking: why tokens can't live in the sync blob, XSS exposure, AES-256-GCM server-side encryption |
| 2 | `job-search-hq` | [Gmail OAuth: PKCE + server exchange](../portfolio/job-search-hq/DECISIONS.md) | Classic "how do you handle secrets in a public-repo SPA?" — correct OAuth pattern with three clearly wrong alternatives |
| 3 | `clarity-budget-web` | [LLM allowlist filter for hallucinated IDs](../portfolio/clarity-budget-web/DECISIONS.md) | Shows AI integration maturity: Zod validates shape, allowlist validates semantics — explains hallucination and defense-in-depth |
| 4 | `clarity-budget-web` | [Transactions in local storage only](../portfolio/clarity-budget-web/DECISIONS.md) | Privacy architecture decision: deliberately chose NOT to sync PII. Shows you think about data exposure, not just feature coverage |
| 5 | `fairway-ios` | [@Observable + Codable blob over SwiftData](../portfolio/fairway-ios/DECISIONS.md) | Framework trade-off with clear reasoning: data size, migration complexity, portfolio-wide consistency — shows you right-size your stack |
| 6 | `job-search-hq` | [Heuristic classifier over LLM](../portfolio/job-search-hq/DECISIONS.md) | Cost/complexity trade-off: 20 emails/day doesn't justify LLM overhead. Shows you don't over-engineer |
| 7 | `job-search-hq` | [Modal onAfterSave callback chaining](../portfolio/job-search-hq/DECISIONS.md) | Component design: agnostic modals composed at the call site. Good for "how do you avoid tight coupling?" |
| 8 | `clarity-budget-web` | [Flatten early, filter late for split transactions](../portfolio/clarity-budget-web/DECISIONS.md) | Data normalization: one canonical shape before any processing. Shows architectural thinking about data pipelines |
| 9 | `job-search-hq` | [Launchpad stage derivation, not persistence](../portfolio/job-search-hq/DECISIONS.md) | "Derive, don't persist" — eliminates migration complexity. Good answer for "how do you keep schemas clean?" |
| 10 | `fairway-ios` | [Open-Meteo over WeatherKit](../portfolio/fairway-ios/DECISIONS.md) | Pragmatic third-party API choice: right data, no provisioning headaches. Shows you evaluate tools against actual constraints |
| 11 | `clarity-budget-web` | [Transaction amounts as milliunits](../portfolio/clarity-budget-web/DECISIONS.md) | Finance-specific correctness: integer math over floating-point. Short, confident answer to a classic fintech question |
| 12 | `unnamed-ios` | [Hand-crafted .xcodeproj](../portfolio/unnamed-ios/DECISIONS.md) | Problem-solving under constraints: tool broke, adapted an existing template. Shows resilience and understanding of the underlying system |
| 13 | `job-search-hq` | [Auto-logged + manual wins split](../portfolio/job-search-hq/DECISIONS.md) | User psychology meets data design: two sources, one flag. Good for "how do you design for real user behavior, not ideal behavior?" |
| 14 | `clarity-command` | [Grace-based conviction triggers](../portfolio/clarity-command/DECISIONS.md) | UX philosophy decision: don't punish on day 1. Shows you think about onboarding experience and user trust |
| 15 | `fairway-ios` | [KML reimport: split tooling and app sessions](../portfolio/fairway-ios/DECISIONS.md) | Engineering workflow decision: different tools, different context windows, different verification needs — shows meta-awareness of how you work |

---

## How to use this in an interview

1. **"Walk me through a technical decision you made"** → Pick #1, #2, or #3 (security decisions resonate with interviewers)
2. **"How do you handle trade-offs?"** → Pick #5 or #6 (framework right-sizing, complexity vs. cost)
3. **"Tell me about a design pattern you chose"** → Pick #7 or #8 (component design, data normalization)
4. **"How do you think about data modeling?"** → Pick #9 or #11 (derivation, integer math)
5. **"How do you work with AI tools?"** → Pick #3 (LLM allowlist) or reference `AI_PLAYBOOK.md`

For each, open the full DECISIONS.md entry and walk through: Context → Options → Decision → Why → Revisit When.
