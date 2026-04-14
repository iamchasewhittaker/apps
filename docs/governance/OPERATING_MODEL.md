# Operating Model — Solo Builder Hats

> Replaces the traditional RACI matrix with a practical model for a one-person team.
> Wear one hat at a time. Each hat has a question, cadence, and ritual.

---

## The Five Hats

### Builder (Daily)
**Question:** What am I shipping today?
**Ritual:**
1. Pick the top task from ROADMAP.md priority queue
2. Run `checkpoint` before starting
3. Ship the work
4. Run `checkpoint` when done
5. Update CHANGELOG.md and HANDOFF.md

**Time:** Most of the day. This is where code gets written.

### Architect (Weekly, ~15 min)
**Question:** Is the system healthy and consistent?
**Ritual:**
1. Run `scripts/portfolio-health-check`
2. Check for shared file drift (auth.js, sync.js, storage.js across apps)
3. Review largest-file report — any new files crossing 500-line threshold?
4. Scan CI results — any failing builds?
5. Note anything that needs fixing in ROADMAP.md

**When:** Monday morning or Friday afternoon — bookend the week.

### Operator (Weekly, ~10 min)
**Question:** Are deployed things actually working?
**Ritual:**
1. Hit each live URL — does it load? Auth work? No console errors?
2. Check Vercel dashboard for deployment failures or warnings
3. Review Supabase dashboard — any auth errors, RLS violations, unusual activity?
4. Check that cross-app sessions still work (login on one app, navigate to another)

**When:** Same day as Architect hat — do them back to back.

### Product (Bi-weekly, ~30 min)
**Question:** Am I building the right things in the right order?
**Ritual:**
1. Review ROADMAP.md priority queue — reorder if priorities shifted
2. Update Linear — close done issues, add new ones, update project status
3. Check product line doc — any new overlap emerging?
4. Make kill/incubate decisions on stalled projects
5. Review stage-gate status for any apps approaching launch

**When:** Every other Monday. Pair with sprint planning if using 2-week cycles.

### Storyteller (Monthly, ~1 hr)
**Question:** Can someone else understand and want this?
**Ritual:**
1. Pick 1 app to polish for external readability
2. Update or create its BRANDING.md
3. Rewrite README.md with user-facing description
4. Review and complete its LAUNCH_CHECKLIST.md
5. Consider: screenshot, demo clip, one-paragraph pitch

**When:** First week of each month.

---

## Review Cadence Summary

| Cadence | What | Hat |
|---------|------|-----|
| Daily | Ship code, checkpoint, update docs | Builder |
| Weekly | Health check + live URL verification | Architect + Operator |
| Bi-weekly | Priority review + Linear sync + kill decisions | Product |
| Monthly | Polish 1 app for external readiness | Storyteller |
| Quarterly | Full executive report (run the report prompt template) | All hats |

---

## Decision Framework

When deciding what to work on, use this priority order:

1. **Broken** — anything deployed that's not working (Operator hat catches this)
2. **Drifting** — shared files out of sync, docs contradicting reality (Architect hat catches this)
3. **Blocked** — highest-priority ROADMAP item that's stuck
4. **Planned** — next item in ROADMAP priority queue
5. **Polish** — storyteller work on the most launch-ready app

---

## Anti-Patterns to Avoid

- Starting new apps before existing ones pass Gate 3 (Launch Readiness)
- Skipping checkpoint at session start/end
- Going >2 weeks without running portfolio-health-check
- Going >1 month without updating Linear
- Treating all apps as equally important — use the product line tiers
