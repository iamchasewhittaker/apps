# SESSION_START — Retroactive Foundation Docs (Existing App)

> Paste this into the Idea Kitchen Claude Project when you want foundation docs for an app already built. Replace all `[BRACKETED]` values, then paste the app's `CLAUDE.md` and `HANDOFF.md` content into the zones at the bottom.

---

**Mode:** Retroactive documentation — this app already exists and is shipped.

**App:** [APP NAME]
**Slug:** [slug] *(e.g. `job-search-hq`)*
**One-liner:** [One sentence: what it does and who it's for.]

---

## What to skip

The decisions are already made. Do not run:

- STEP 0 scope/identity/appetite questions
- STEP 1.5 prior-art check
- STEP 2 DIFFERENTIATE pressure-test

Go straight to gathering information, then produce STEP 6 blocks.

---

## What to produce

Generate all six fenced artifact blocks from STEP 6. Priority order:

1. **`SHOWCASE.md`** — highest priority. Shipyard renders this at `/ship/[slug]`. Fill every section of `APP_SHOWCASE_TEMPLATE.md` accurately from the app context below.
2. **`BRANDING.md`** — derive palette, typography, and voice from the existing app. If unsure, ask one targeted question before guessing.
3. **`PRODUCT_BRIEF.md`** — distill the app's identity, problem, and audience from the CLAUDE.md below.
4. **`PRD.md`** — reflect actual V1 scope. Mark anything not yet built as V2. Skip the Prior Art & Positioning section (it's moot for a shipped app).
5. **`APP_FLOW.md`** — document the primary flow as-built, not as-planned.
6. **`SESSION_START_[SLUG].md`** — stub only. The app is already running; a full scaffold prompt isn't needed.

---

## Output paths

| File | Drop it at |
|---|---|
| `SHOWCASE.md` | `portfolio/[SLUG]/docs/SHOWCASE.md` |
| `BRANDING.md` | `portfolio/[SLUG]/docs/BRANDING.md` |
| `PRODUCT_BRIEF.md` | `portfolio/[SLUG]/docs/PRODUCT_BRIEF.md` |
| `PRD.md` | `portfolio/[SLUG]/docs/PRD.md` |
| `APP_FLOW.md` | `portfolio/[SLUG]/docs/APP_FLOW.md` |
| `SESSION_START_[SLUG].md` | `portfolio/[SLUG]/docs/SESSION_START_[SLUG].md` *(stub)* |

---

## App context

**Paste the app's `CLAUDE.md` content below:**

```
[PASTE CLAUDE.md HERE]
```

---

**Paste the app's `HANDOFF.md` content below:**

```
[PASTE HANDOFF.md HERE]
```
