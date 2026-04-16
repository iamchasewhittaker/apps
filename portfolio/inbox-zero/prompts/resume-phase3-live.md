# Resume — Inbox Zero Phase 3 (Live)

> Paste this into a new Claude Code session opened from the `inbox-zero/` folder.

---

> Read `claude.md` and `HANDOFF.md` first.
>
> **Where we are:** Phase 3 is live. Apps Script is deployed and running every 5 minutes in `RULES_ONLY` mode. The system labels and archives known senders via `rules.gs`. Unknown senders are logged to the "Review Queue" tab in the Google Sheet for manual rule additions.
>
> **Current mode:** `RULES_ONLY` — Gemini free-tier quota is exhausted (`limit: 0`). Switch to `GEMINI` in Script Properties once billing is enabled on the GCP project.
>
> **Sheet:** https://docs.google.com/spreadsheets/d/1OT1Jtrp2jaVPVUCZGKnFwf8NwAK0h3PA447VZHYJP54/edit
> Check the **"Review Queue"** tab for unknown senders to add as rules.
>
> **Remaining steps:**
> 1. **Load Chrome extension** — `chrome://extensions` → Developer mode → Load unpacked → `inbox-zero/extension/`; configure popup
> 2. **Review Queue habit** — check sheet periodically; fill "Assign Label"; add domain to `rules.gs` + `gmail-filters.xml`; `clasp push --force`
> 3. **Enable Gemini** (optional) — enable billing on GCP project → change `CLASSIFIER_MODE` to `GEMINI`
>
> **To add a rule from Review Queue:**
> 1. Add domain/address to correct label in `apps-script/rules.gs`
> 2. Add entry to `gmail-filters.xml`
> 3. `cd apps-script && npx clasp push --force`
> 4. Re-import `gmail-filters.xml` into Gmail (Settings → Filters → Import → check "Also apply to matching conversations")
>
> **Script ID:** `1xCONJKIfWzFwdS29I4M_r5CuhebILiQAlFJHtfkjzYnjP-NKD_90jqQI`
