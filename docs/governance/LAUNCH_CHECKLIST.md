# Stage-Gate Launch Checklist

> Copy and instantiate per app as `LAUNCH_CHECKLIST.md` in the app directory.
> Each gate must pass before proceeding to the next.

---

## Gate 1: Strategy / Problem Fit

- [ ] Problem statement written (who has this problem, why it matters)
- [ ] Target user defined (specific persona, not "everyone")
- [ ] Success metric chosen (what number proves this works)
- [ ] Product line assigned (Clarity Life OS / Career Toolkit / Finance & Budget / Supporting Tool)
- [ ] No unresolved overlap with existing active app
- [ ] Differentiation from similar apps documented

**Gate 1 pass:** All items checked. Proceed to build.

---

## Gate 2: Build Readiness

- [ ] Scope frozen for this release (what's in, what's deferred)
- [ ] `docs/BRANDING.md` exists (copy from `docs/templates/PORTFOLIO_APP_BRANDING.md`)
- [ ] Security checklist started (copy from `docs/governance/SECURITY_CHECKLIST.md`)
- [ ] Shared files pulled from `portfolio/shared/` (sync.js, auth.js, storage.js, ErrorBoundary.jsx)
- [ ] localStorage key chosen and added to root CLAUDE.md portfolio table
- [ ] Linear project created with issues for this release scope

**Gate 2 pass:** All items checked. Proceed to build and ship.

---

## Gate 3: Launch Readiness

- [ ] `npm ci && npm run build` passes clean (or Xcode build succeeds)
- [ ] Security checklist complete — all items pass
- [ ] `npm audit` shows 0 critical/high vulnerabilities
- [ ] README.md has user-facing description (not just dev docs)
- [ ] `docs/BRANDING.md` complete (colors, fonts, logo, tagline)
- [ ] App logo created using `docs/templates/PORTFOLIO_APP_LOGO.md`
- [ ] Live URL verified (returns 200, renders correctly, no console errors)
- [ ] Auth flow tested end-to-end (if applicable)
- [ ] Cross-app session works (if part of Clarity ecosystem)
- [ ] Vercel environment variables set for production + preview
- [ ] Vercel connected to GitHub for auto-deploy
- [ ] HANDOFF.md updated with current state
- [ ] CHANGELOG.md has entry for this release
- [ ] Linear project updated — issues closed, status current

**Gate 3 pass:** All items checked. App is live and launch-ready.

---

## Gate 4: Post-Launch Review

### Week 1 Check
- [ ] Live URL still accessible and rendering
- [ ] Auth still working (no session issues)
- [ ] No new console errors
- [ ] No Supabase errors in dashboard
- [ ] Basic user journey works end-to-end

### Week 4 Check
- [ ] Review success metric — trending toward goal?
- [ ] Any user feedback received? (even if user is just you)
- [ ] Any security issues surfaced?
- [ ] Decision: **Invest** (add features) / **Maintain** (keep as-is) / **Sunset** (archive)

**Gate 4 pass:** Decision made and documented in ROADMAP.md.

---

## Quick Reference: Gate Summary

| Gate | Question | Who (Hat) | When |
|------|----------|-----------|------|
| 1 - Strategy | Should we build this? | Product | Before any code |
| 2 - Build | Are we ready to build? | Architect + Builder | Before sprint starts |
| 3 - Launch | Is it ready to ship? | Operator + Storyteller | Before go-live |
| 4 - Review | Is it working and worth continuing? | Product | Week 1 + Week 4 post-launch |
