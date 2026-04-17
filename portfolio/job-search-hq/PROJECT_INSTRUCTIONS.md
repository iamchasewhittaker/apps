# Job Search HQ — Project Instructions
> Paste this at the start of every session with Claude.
> Reference MASTER_PROJECT_FRAMEWORK.md for standards that apply to all projects.

---

## Audit findings — 2026-04-15

**Compliance score:** 100/100
**Status assessment:** Active — ready for Step 6 (Learn)

**Findings:**
- Highest compliance in portfolio (tied with wellness-tracker). All 10 standard files present.
- Claims Step 5 (Ship) — v8.5 live, Supabase + OTP working, Chrome extension shipped. Recommend Step 6 (Learn).
- MASTER_PROJECT_FRAMEWORK.md has path drift: references `apps/your-app/` in one spot where other copies say `portfolio/your-app/`.
- React 19.2.4 (good — already on latest major).
- Missing LICENSE (universal gap).
- 4,209 LOC across 21 files — second largest web app.

**Recommended actions:**
- [ ] Move to Step 6 (Learn)
- [ ] Fix MASTER_PROJECT_FRAMEWORK.md path reference (apps/ → portfolio/)
- [ ] Add MIT LICENSE

**See full audit:** ~/Developer/audits/2026-04-15-audit-report.md

---

## How to Start Every Session

**After every deploy, the sync script runs automatically and copies a summary to your clipboard. Just paste it into Claude — no template needed.**

If starting a session without a recent deploy, upload:
- `App.jsx`
- `PROJECT_INSTRUCTIONS.md`

And say what you want to change.

---

## App Hub — Automatic Sync (set up 2026-03-22)

After every `git push`, a `post-push` hook can run `bash "$(git rev-parse --show-toplevel)/portfolio/app-hub/sync.sh"` and:
- Reads App.jsx line count
- Reads current git tag (version)
- Extracts new CHANGELOG entries since last sync
- Reads last audit results
- Copies a full summary to clipboard

**You just paste that summary into Claude. Claude handles the rest.**

### If sync doesn't fire
Run it manually from inside the app folder:
```bash
cd portfolio/job-search-hq
bash "$(git rev-parse --show-toplevel)/portfolio/app-hub/sync.sh"
```

---

## What This App Is

A personal job search command center. Tracks applications, contacts, interview prep (structured sections + stage templates + legacy migration), outreach cadence, pipeline analytics, a STAR story bank, and **copy-to-clipboard prompts** for tailored resumes, cover letters, apply kits, and interview prep (use ChatGPT, Claude, or any assistant in another tab). Optional **Chrome extension** (`extension/`) imports LinkedIn profile/job rows and shows an Action Queue badge on the HQ tab. Used on Mac browser and iPhone (added to home screen). Deployed on Vercel.

**Live URL:** `https://job-search-hq.vercel.app`
**GitHub repo:** `github.com/iamchasewhittaker/job-search-hq` (private)
**Local folder (monorepo):** `portfolio/job-search-hq` under `~/Developer/chase`
**Current version:** `v8.6` (see `CLAUDE.md` — Apply Tools copy prompts; no in-browser LLM API; Wave 3 #2 stage prep templates)
**Supabase sign-in email:** Shared project with Wellness — **Magic link** template must include `{{ .Token }}` (see Wellness or Job Search `CLAUDE.md`).

---

## Relationship with Wellness Tracker

These two apps are intentionally separate but connected:

| App | Purpose |
|-----|---------|
| **Wellness Tracker** (`https://wellness-tracker-kappa.vercel.app`) | Capacity tracking, daily check-ins, mood, meds, streaks |
| **Job Search HQ** (`job-search-hq.vercel.app`) | Pipeline, contacts, Apply Tools (copy prompts), resume/cover prep, interview prep |

**How they connect:**
- Wellness tracker Growth tab → Job Search card shows live pipeline stats (active apps, follow-ups overdue) read from `chase_job_search_v1`
- Wellness tracker Job Search card has an "Open Job Tracker →" deep-link button
- Job Search HQ header has a `← Wellness` back-link to `https://wellness-tracker-kappa.vercel.app`
- Daily Focus blocks in Job Search HQ have a "✓ Done + Log to Wellness" button that writes a job search session directly into `chase_wellness_v1` growthLogs — keeping the Growth tab streak alive without double-entry

**Storage keys are separate — never mix them:**
- Job Search: `chase_job_search_v1`
- Wellness: `chase_wellness_v1` (read/written by the Log to Wellness feature only)

---

## Deploy Workflow

**With Claude Code (preferred):** Claude edits files directly — no Downloads step needed.
```bash
cd portfolio/job-search-hq
bash audit.sh
bash pre-deploy.sh
git add . && git commit -m "vN what changed" && git push
git tag vN && git push origin vN
```

**Without Claude Code (chat interface):**
```bash
mv ~/Downloads/App.jsx portfolio/job-search-hq/src/App.jsx
mv ~/Downloads/PROJECT_INSTRUCTIONS.md portfolio/job-search-hq/PROJECT_INSTRUCTIONS.md
mv ~/Downloads/CHANGELOG.md portfolio/job-search-hq/CHANGELOG.md

cd portfolio/job-search-hq
bash audit.sh
bash pre-deploy.sh
git add . && git commit -m "vN what changed" && git push
git tag vN && git push origin vN
```

---

## Tech Stack

- **Framework:** React (single JSX file — `src/App.jsx`)
- **Deployment:** Vercel — connected to GitHub, auto-deploys on push
- **Storage:** `localStorage` only — key: `chase_job_search_v1`
- **Cross-app write:** also writes to `chase_wellness_v1` (growthLogs only) for wellness streak sync
- **Apply Tools:** Markdown prompts in `src/applyPrompts.js` — copy to clipboard only; no LLM API in the browser (v8.6+)
- **Find Jobs:** Opens LinkedIn / Indeed / Google search in a new tab (no in-app search API)
- **Theme:** Dark mode only — locked, never change
- **Primary device:** Mac browser + iPhone (PWA, added to home screen)

---

## Critical Rules

| Rule | Why |
|------|-----|
| **Never change localStorage key** `chase_job_search_v1` | All pipeline/contact data permanently lost |
| **Never remove `hasLoaded` ref** | Prevents save firing before load |
| **Always use `window.confirm()` not bare `confirm()`** | ESLint blocks bare confirm() — build fails |
| **Never delete `vercel.json`** | Breaks cache busting |
| **Always update `CHANGELOG.md` on every deploy** | One entry per version |
| **Always run `bash audit.sh` before `bash pre-deploy.sh`** | Audit first, then pre-deploy |
| **Always verify brace balance before delivering** | Imbalanced braces cause silent JS failures |
| **Never rewrite sections that aren't changing** | Surgical edits only |
| **Prompt builders live in `applyPrompts.js`** | Keep copy-prompt UX consistent across tabs |
| **`logSessionToWellness()` writes to `chase_wellness_v1`** | This is intentional — do not remove |
| **`WELLNESS_KEY` constant must stay `chase_wellness_v1`** | Must match wellness tracker's storage key exactly |
| **`PrepModal` uses stage templates + external prep brief** | See `PREP_STAGE_PRESETS` in `applyPrompts.js` |
| **`BACKUP_FOLDER_KEY` must stay `chase_job_search_backup_folder`** | Stores the user's chosen backup folder handle — changing it breaks folder memory |
| **`showError(msg)` is the global error toast helper** | Always use this for API/network errors — do not use alert() or inline error text for these |
| **`ErrorBoundary` wraps all 5 tabs** | Each tab is individually guarded — never remove these wrappers |
| **`restoreData()` must validate `parsed.applications` array** | Prevents corrupt restores — do not weaken this check |

---

## App Structure

### Tabs (5 total)
| Tab | Key | Description |
|-----|-----|-------------|
| 🎯 Daily Focus | `focus` | Daily work blocks with ADHD-friendly step-by-step guides + weekly rhythm |
| 📋 Pipeline | `pipeline` | Application cards by stage, archived collapse, Apply Kit shortcut, Interview Prep |
| 👥 Contacts | `contacts` | Recruiter/HM cards linked to applications |
| ✨ AI Tools | `ai` | Resume tailor, cover letter, Apply Kit, Find Jobs, LinkedIn optimizer |
| 📚 Resources | `resources` | Certifications, LinkedIn quick wins, job search ground rules |

### AI Tools Sub-tabs
| Sub-tab | Key | Description |
|---------|-----|-------------|
| 📄 Tailor Resume | `tailor` | Paste JD → tailored PM or AE resume |
| ✉️ Cover Letter | `cover` | Paste JD → 3-paragraph cover letter |
| 🚀 Apply Kit | `kit` | One-click resume + cover letter from saved application |
| 🔍 Find Jobs | `jobs` | Web search for matching roles via Claude + web_search tool |
| 💼 LinkedIn | `linkedin` | Headline, About, keyword optimizer, connection requests, follow-ups |

### Application Stages
`Interested → Applied → Phone Screen → Interview → Final Round → Offer / Rejected / Withdrawn`

### Interview Prep (Pipeline tab)
- 🎯 Prep button appears on cards in **Phone Screen, Interview, Final Round** stages only
- Opens `PrepModal` — if JD is saved, generates immediately; shows warning if no JD
- Generates 5 questions across 4 types: behavioral (STAR), role-specific, company fit, compensation
- Talking points anchored to real Authorize.Net experience, 98% resolution rate, KPI stats
- Result saved to `app.prepNotes` — persists in localStorage, shown as "✓ Interview prep saved" on card
- Regenerate button available after first generation
- Uses `maxTokens: 1500` — do not reduce

---

## Wellness Integration

```js
const WELLNESS_KEY = "chase_wellness_v1";

function logSessionToWellness(mins, note = "") {
  try {
    const raw = localStorage.getItem(WELLNESS_KEY);
    const stored = raw ? JSON.parse(raw) : {};
    const today = new Date().toISOString().split("T")[0];
    const entry = {
      area: "job", mins, note: note.trim() || "Logged from Job Search HQ",
      milestones: [], bg: [], date: today, ts: Date.now(),
    };
    stored.growthLogs = [...(stored.growthLogs || []), entry];
    localStorage.setItem(WELLNESS_KEY, JSON.stringify(stored));
    return true;
  } catch { return false; }
}
```

Called when user taps "✓ Done + Log to Wellness" on a Daily Focus block. Minutes per block: apply=40, research=20, network=20, followup=15, skills=25.

---

## Apply Tools (v8.6+)

All drafting prompts live in `src/applyPrompts.js`. The app **only copies markdown to the clipboard** — users paste into ChatGPT, Claude, or another assistant, then paste results back into text areas. No `fetch` to LLM providers.

---

## Save Pattern

```js
const hasLoaded = useRef(false);

useEffect(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) setData({ ...defaultData, ...JSON.parse(saved) });
  hasLoaded.current = true;
}, []);

useEffect(() => {
  if (!hasLoaded.current) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}, [data]);
```

---

## Data Model

```js
// localStorage key: chase_job_search_v1
{
  applications: [
    {
      id: string,
      company: string,
      title: string,
      stage: string,          // one of STAGES array
      appliedDate: string,
      url: string,
      nextStep: string,
      jobDescription: string,
      notes: string,
      prepNotes: string,      // legacy
      prepSections: { companyResearch, roleAnalysis, starStories, questionsToAsk },
      prepStageKey: string,  // optional: phone_screen | interview | final_round
    }
  ],
  contacts: [ ... ],
  baseResume: string,
  profile: { ... }
}
```

---

## Key State & Architecture Notes

- **`profileComplete`** — `!!(data.baseResume && data.profile.name && data.profile.targetRoles)`. Prompts assume profile is filled.
- **`jd` state is shared** between Tailor Resume and Cover Letter tabs — intentional.
- **`kitApp`** — set from the Apply Kit selector AND the 🚀 button on pipeline cards.
- **`activeApps` / `archivedApps`** — Rejected and Withdrawn = archived.
- **LinkedIn / keyword draft state** in Apply Tools is ephemeral — not saved to localStorage (pasted assistant output is optional in text areas).
- **`prepModal`** state — `{ app }` or `null`. Opens PrepModal for structured prep + stage templates.
- **`buildProfileContextBlock` / prompt builders** — `applyPrompts.js` (import `CHASE_CONTEXT` from `constants.js` where needed).

---

## Key Functions

- `showError(msg)` — sets `errorToast` state; auto-clears after 6 seconds
- `backupData()` / `restoreData()` — backup/restore (see Resources tab)
- Prompt builders in `applyPrompts.js` — e.g. `buildTailorResumePrompt`, `buildInterviewPrepExternalPrompt`, `mergePrepStageTemplate`
- `saveApp(app)` — upserts application
- `saveContact(c)` — upserts contact
- `saveProfile(p)` — replaces profile
- `deleteApp(id)` / `deleteContact(id)`
- `generateId()` — stable ID generator

---

## Key Components

- `AppCard` — pipeline card. Shows prep indicator when `prepSections` has content (see `prepSectionsHasContent` in `constants.js`).
- `PrepModal` — structured prep sections, stage template selector, copy external brief. Props: `app`, `data`, `onSave`, `onClose`, `showError`.
- `AppModal` — add/edit application.
- `ContactModal` — add/edit contact.
- `ProfileModal` — edit master profile + base resume.
- `AIResult` — reusable result box with copy button.
- `ErrorBoundary` — wraps each tab.
- `Field` — reusable form field (text, textarea, select, date).

---

## Safari / PWA

- All inputs `font-size: 16px` — prevents Safari auto-zoom
- `touch-action: manipulation` — prevents double-tap zoom
- `vercel.json` handles cache at server level

---

## About Chase

- Brand new to coding — always explain in plain English first
- ADHD and OCD — keep responses clear and structured, one step at a time
- All apps dark mode — bad eyes
- Job searching — enterprise sales, Visa/payments background (Authorize.Net, CyberSource)
- Target roles: Implementation Specialist, Customer Success Manager, inbound AE
- Remote only (cannot drive due to vision impairment)
- Primary device: Mac browser + iPhone Safari

---

## Future Ideas

### High Priority
- Outreach tracker — cold emails/DMs separate from applications
- Weekly activity summary

### Medium Priority
- Email draft generator — cold outreach with tone options
- Offer comparison tool — base, OTE, equity, benefits
- Notes / journal tab

### Lower Priority
- Custom app icon
- Pipeline analytics — conversion rates by stage
- Export to CSV
- Reminder flags — highlight applications with no activity in X days
