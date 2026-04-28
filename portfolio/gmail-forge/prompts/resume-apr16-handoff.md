# Resume — Gmail Forge (Post-Rename / Apr 16 Handoff)

> Paste this into a new Claude Code session opened from `portfolio/gmail-forge/`.

---

> Read `CLAUDE.md` and `HANDOFF.md` first.
>
> **Where we are:** Gmail Forge is what was formerly called "Inbox Zero". Renamed Apr 16, 2026. Phase 3 is LIVE in `RULES_ONLY` mode, 5-min trigger active, all systems green.
>
> **What shipped this session:**
> - Directory moved: `portfolio/inbox-zero/` → `portfolio/gmail-forge/`
> - ~130 text replacements across 48 files in 6 projects (own docs, spend-radar, spend-clarity, job-search-hq, funded-ios, portfolio root)
> - Env vars renamed: `INBOX_ZERO_WEB_APP_URL` → `GMAIL_FORGE_WEB_APP_URL`, `INBOX_ZERO_TRIGGER_TOKEN` → `GMAIL_FORGE_TRIGGER_TOKEN`
> - Daily report updated: now searches inbox AND archived separately; shows `🗄️ Auto-archived today` section + `📊 Total` line
>
> **Off-filesystem renames still pending (do these manually):**
> 1. **Google Apps Script console** — rename project from "Inbox Zero" to "Gmail Forge" at script.google.com
> 2. **Spend Radar Script Properties** — add `GMAIL_FORGE_WEB_APP_URL` + `GMAIL_FORGE_TRIGGER_TOKEN` with the same values as the old `INBOX_ZERO_*` keys → verify Refresh All Apps works → delete old keys
> 3. **Asana** — rename project title to "Gmail Forge Build" (GID `1213891408033292` stays the same)
> 4. **Chrome extension** — load unpacked from new path: `portfolio/gmail-forge/extension/`
>
> **Remaining code tasks:**
> - Review Queue habit: check Sheet tab → add confirmed senders to `rules.gs` + `gmail-filters.xml` → `clasp push --force`
> - Enable Gemini (optional): enable billing on GCP project → set `CLASSIFIER_MODE=GEMINI` in Script Properties
>
> **Key references:**
> - Script ID: `1xCONJKIfWzFwdS29I4M_r5CuhebILiQAlFJHtfkjzYnjP-NKD_90jqQI`
> - Script editor: https://script.google.com/d/1xCONJKIfWzFwdS29I4M_r5CuhebILiQAlFJHtfkjzYnjP-NKD_90jqQI/edit
> - Google Sheet: https://docs.google.com/spreadsheets/d/1OT1Jtrp2jaVPVUCZGKnFwf8NwAK0h3PA447VZHYJP54/edit
>
> **To run the daily report:** say "report", "email report", or "what's in my inbox". Will show inbox + auto-archived sections with totals.
>
> **To add a filter rule:**
> 1. Add domain/address to correct label array in `apps-script/rules.gs`
> 2. Add matching entry to `gmail-filters.xml`
> 3. `cd apps-script && npx clasp push --force`
> 4. Gmail → Settings → Filters → Import → upload `gmail-filters.xml` → check "Also apply to matching conversations"
>
> **NOT this project:** getinboxzero.com is a separate open-source product we evaluated but did not install. Gmail Forge is the DIY system.
