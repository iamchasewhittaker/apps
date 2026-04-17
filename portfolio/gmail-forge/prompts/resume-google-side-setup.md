# Session Start — Inbox Zero Google-Side Setup

Paste this into a new chat opened from `/Users/chase/Developer/chase/portfolio/inbox-zero/`.

---

Read `CLAUDE.md` and `HANDOFF.md` first.

**Where we are:** The Apps Script project is deployed via clasp. The `.gs` files (`auto-sort.gs`, `rules.gs`, `appsscript.json`) are live at:

https://script.google.com/d/1xCONJKIfWzFwdS29I4M_r5CuhebILiQAlFJHtfkjzYnjP-NKD_90jqQI/edit

**What's left (do these in order):**

1. **Script Properties** — in the editor: Project Settings (⚙️) → Script Properties → Add:
   - `CLASSIFIER_MODE` → `GEMINI` (or `RULES_ONLY` to skip AI cost)
   - `GEMINI_API_KEY` → your key from [aistudio.google.com](https://aistudio.google.com) (only needed if using `GEMINI` mode)
   - `NEWSLETTER_TO_ALIASES` → comma-separated iCloud Hide My Email addresses used as To: for newsletters (Substack, Daily Crossword, etc.) — check your iCloud account for these; not stored in git
   - `SHEET_ID` → optional; only if you want new-sender logging to a Google Sheet

2. **Run `setupTrigger()`** — opens function runner → select `setupTrigger` → run. First run asks for Gmail authorization — approve it. This installs the 5-min trigger.

3. **Run `healthCheck()`** — confirms trigger is active and Script Properties are set.

4. **Run `testRun()`** — live sweep of inbox against rules + Gemini. Watch the logs (View → Logs) to confirm labels are applied correctly.

5. **Chrome extension** — in terminal:
   ```bash
   cd /Users/chase/Developer/chase/portfolio/inbox-zero/extension
   npm install && npm run validate
   ```
   Then: Chrome → `chrome://extensions` → Developer mode (toggle on) → Load unpacked → select the `extension/` folder. Open popup, set mode + API key.

**If anything goes wrong or needs code changes**, the local files are at `apps-script/` and you can re-push anytime with:
```bash
cd /Users/chase/Developer/chase/portfolio/inbox-zero/apps-script
npx clasp push --force
```
