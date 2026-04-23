# SESSION_START — Gmail Forge Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Gmail Forge is a live v0.3 three-layer automation system.
**App:** Gmail Forge
**Slug:** gmail-forge
**One-liner:** Three-layer Gmail automation — 69 XML filters (instant sort), Google Apps Script auto-sorter (5-min trigger), and a Chrome MV3 extension — Phase 3 live with Gemini-powered classification.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. Phase 3 is live; decisions are made.

---

## What to produce

All six STEP 6 artifacts (downloadable panels, not code blocks in chat). Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/gmail-forge`
2. **BRANDING.md** — forge/automation aesthetic, workflow-tool palette
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect v0.3 Phase 3 scope; V4 = triage the 83 in Review Queue
5. **APP_FLOW.md** — document the 3-layer flow: XML filters → Apps Script → Chrome extension
6. **SESSION_START_gmail-forge.md** — stub only

Output paths: `portfolio/gmail-forge/docs/`

---

## App context — CLAUDE.md

**Version:** v0.3
**Stack:** Three-layer system:
1. **69 Gmail XML filters** — applied once at the Gmail level (instant, zero-latency)
2. **Google Apps Script** — auto-sorter running on a 5-minute trigger; Gemini-powered classification; `CLASSIFIER_MODE`, `GEMINI_API_KEY`, `SHEET_ID`, `NEWSLETTER_TO_ALIASES`, `TRIGGER_TOKEN` in Script Properties
3. **Chrome MV3 extension** — manual override UI in Gmail sidebar

**Script Properties:**
- `CLASSIFIER_MODE` — `RULES_ONLY` (default, no Gemini) or `GEMINI` (AI-powered)
- `GEMINI_API_KEY` — Gemini Flash API key
- `SHEET_ID` — linked Google Sheet ID for Review Queue + audit log
- `NEWSLETTER_TO_ALIASES` — comma-separated list of Hide My Email aliases for newsletters
- `TRIGGER_TOKEN` — shared token for cross-app `UrlFetchApp` calls (Spend Radar integration)

**What this app is:**
A three-layer Gmail automation stack that eliminates manual inbox triage. Layer 1 (XML filters) handles 80% of sorting instantly. Layer 2 (Apps Script) catches the remaining 20% with rule-based or Gemini classification. Layer 3 (Chrome extension) provides a manual override UI. Together they maintain a near-zero inbox.

**Review Queue:**
- 83 emails awaiting triage (as of last touch)
- Emails that didn't match any rule land here for manual classification
- Each manual classification feeds back into the rules (RULES_ONLY mode)

**Cross-app integration:**
- Spend Radar calls Gmail Forge's `refreshAll` via `UrlFetchApp` + `TRIGGER_TOKEN`
- Gmail Forge can trigger Spend Radar's `autoSort()` in return

**Brand system:**
- Forge/workshop metaphor — shaping raw email into organized signal
- Automation-tool aesthetic — workflow arrows, processing states

---

## App context — HANDOFF.md

**Version:** v0.3
**Focus:** Phase 3 live. 83 emails in Review Queue needing triage.
**Last touch:** 2026-04-21

**Next:**
1. Triage the 83 in Review Queue — classify each, update RULES_ONLY patterns
2. Review queue should reach zero; then monitor for new additions
3. Phase 4 candidate: auto-unsubscribe from newsletters not opened in 90 days
4. Phase 4 candidate: daily digest email summarizing what was sorted
