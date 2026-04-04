# Job Search HQ — Project Instructions
> Paste this at the start of every session with Claude.
> Reference MASTER_PROJECT_FRAMEWORK.md for standards that apply to all projects.

---

## How to Start Every Session

**After every deploy, the sync script runs automatically and copies a summary to your clipboard. Just paste it into Claude — no template needed.**

If starting a session without a recent deploy, upload:
- `App.jsx`
- `PROJECT_INSTRUCTIONS.md`

And say what you want to change.

---

## App Hub — Automatic Sync (set up 2026-03-22)

After every `git push`, `~/Documents/apps/app-hub/sync.sh` fires automatically and:
- Reads App.jsx line count
- Reads current git tag (version)
- Extracts new CHANGELOG entries since last sync
- Reads last audit results
- Copies a full summary to clipboard

**You just paste that summary into Claude. Claude handles the rest.**

### If sync doesn't fire
Run it manually from inside the app folder:
```bash
cd ~/Documents/apps/job-search-hq
bash ~/Documents/apps/app-hub/sync.sh
```

---

## What This App Is

A personal job search command center. Tracks applications, contacts, interview prep, and uses Claude AI to generate tailored resumes, cover letters, apply kits, and interview prep questions. Used on Mac browser and iPhone (added to home screen). Deployed on Vercel.

**Live URL:** `https://job-search-hq.vercel.app`
**GitHub repo:** `github.com/iamchasewhittaker/job-search-hq` (private)
**Local folder:** `~/Documents/apps/job-search-hq`
**Current version:** `v8.3` (see `CLAUDE.md` — thin `App.jsx` shell + tabs)
**Supabase sign-in email:** Shared project with Wellness — **Magic link** template must include `{{ .Token }}` (see Wellness or Job Search `CLAUDE.md`).

---

## Relationship with Wellness Tracker

These two apps are intentionally separate but connected:

| App | Purpose |
|-----|---------|
| **Wellness Tracker** (`wellnes-tracker.vercel.app`) | Capacity tracking, daily check-ins, mood, meds, streaks |
| **Job Search HQ** (`job-search-hq.vercel.app`) | Pipeline, contacts, AI tools, resume tailoring, interview prep |

**How they connect:**
- Wellness tracker Growth tab → Job Search card shows live pipeline stats (active apps, follow-ups overdue) read from `chase_job_search_v1`
- Wellness tracker Job Search card has an "Open Job Tracker →" deep-link button
- Job Search HQ header has a `← Wellness` back-link to `wellnes-tracker.vercel.app`
- Daily Focus blocks in Job Search HQ have a "✓ Done + Log to Wellness" button that writes a job search session directly into `chase_wellness_v1` growthLogs — keeping the Growth tab streak alive without double-entry

**Storage keys are separate — never mix them:**
- Job Search: `chase_job_search_v1`
- Wellness: `chase_wellness_v1` (read/written by the Log to Wellness feature only)

---

## Deploy Workflow

**With Claude Code (preferred):** Claude edits files directly — no Downloads step needed.
```bash
cd ~/Documents/apps/job-search-hq
bash audit.sh
bash pre-deploy.sh
git add . && git commit -m "vN what changed" && git push
git tag vN && git push origin vN
```

**Without Claude Code (chat interface):**
```bash
mv ~/Downloads/App.jsx ~/Documents/apps/job-search-hq/src/App.jsx
mv ~/Downloads/PROJECT_INSTRUCTIONS.md ~/Documents/apps/job-search-hq/PROJECT_INSTRUCTIONS.md
mv ~/Downloads/CHANGELOG.md ~/Documents/apps/job-search-hq/CHANGELOG.md

cd ~/Documents/apps/job-search-hq
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
- **AI:** Anthropic Claude API via `callClaude()` — model: `claude-sonnet-4-20250514`
- **Web search:** enabled via `tools: [{ type: "web_search_20250305" }]` in Find Jobs tab
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
| **Claude model string must stay `claude-sonnet-4-20250514`** | Wrong model string = AI calls fail silently |
| **`logSessionToWellness()` writes to `chase_wellness_v1`** | This is intentional — do not remove |
| **`WELLNESS_KEY` constant must stay `chase_wellness_v1`** | Must match wellness tracker's storage key exactly |
| **`runInterviewPrep` uses `maxTokens: 1500`** | Needs extra tokens for 5 full Q&A blocks — do not reduce |
| **`BACKUP_FOLDER_KEY` must stay `chase_job_search_backup_folder`** | Stores the user's chosen backup folder handle — changing it breaks folder memory |
| **`callClaude()` throws `NETWORK_ERROR`, `AUTH_ERROR`, `OVERLOADED`** | `handleClaudeCall()` routes these to specific user messages — do not change error string literals |
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

## Claude API

```js
const MODEL = "claude-sonnet-4-20250514";

async function callClaude(system, userMsg, maxTokens = 1000) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("NO_API_KEY");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: MODEL, max_tokens: maxTokens, system,
      messages: [{ role: "user", content: userMsg }],
    }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message || "API error");
  return json.content?.map(b => b.text || "").join("") || "Error — no response.";
}
```

API key stored separately in `chase_anthropic_key` — never in `chase_job_search_v1`.

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
      prepNotes: string,      // saved interview prep output — empty string if not yet generated
    }
  ],
  contacts: [ ... ],
  baseResume: string,
  profile: { ... }
}
```

---

## Key State & Architecture Notes

- **`profileComplete`** — `!!(data.baseResume && data.profile.name && data.profile.targetRoles)`. AI buttons disabled until true.
- **`jd` state is shared** between Tailor Resume and Cover Letter tabs — intentional.
- **Apply Kit uses `Promise.all`** — fires resume + cover letter in parallel. Don't serialize them.
- **`kitApp`** — set from both the Apply Kit selector AND the 🚀 button on pipeline cards.
- **`activeApps` / `archivedApps`** — Rejected and Withdrawn = archived.
- **`profileContext()`** — builds AI prompt context from profile. Called in every AI function.
- **LinkedIn state** is all ephemeral — not saved to localStorage. Intentional.
- **Job search results** are ephemeral — not saved. Intentional.
- **`prepModal`** state — `{ app }` or `null`. Opens PrepModal for that specific app.
- **`prepNotes`** is saved directly to the application object via `saveApp()` inside `runInterviewPrep`. It persists through the unified save useEffect like all other app data.
- **`callClaude` helper** handles all AI calls except `searchJobs`.

---

## Key Functions

- `callClaude(system, userMsg, maxTokens?)` — base AI call helper, returns text string
- `callClaude(system, userMsg, maxTokens?)` — wraps fetch in try/catch for network errors; checks status 401 → AUTH_ERROR, 529 → OVERLOADED before parsing JSON
- `handleClaudeCall(fn, errorSetter)` — routes NETWORK_ERROR / OVERLOADED / AUTH_ERROR to `showError()`; AUTH_ERROR also clears key + opens ApiKeyModal
- `showError(msg)` — sets `errorToast` state; auto-clears after 6 seconds; renders as fixed red toast at top of screen
- `backupData()` — saves full `chase_job_search_v1` to a dated JSON file; uses File System Access API on Chrome (folder remembered in `BACKUP_FOLDER_KEY`), falls back to standard download on Safari
- `restoreData()` — opens file picker, validates `parsed.applications` array exists, confirms via `window.confirm()`, writes to localStorage, reloads
- `runTailorResume()` — tailors base resume to current `jd` state
- `runCoverLetter()` — writes cover letter for current `jd` state
- `runApplyKit(app)` — parallel resume + cover letter from `app.jobDescription`
- `runInterviewPrep(app, onResult)` — generates 5 interview questions + talking points, saves to `app.prepNotes`, calls `onResult(text, updatedApp)` on completion. Uses `maxTokens: 1500`.
- `searchJobs()` — web search via Anthropic API with `web_search` tool
- `runLinkedInProfile()` — parallel headline + About rewrite
- `runKeywordOptimizer()` — analyzes pasted LinkedIn text for keyword gaps
- `runConnectMessage()` — connection request for selected contact
- `runFollowupMessage()` — follow-up message for selected contact
- `profileContext()` — builds AI prompt context string from profile data
- `saveApp(app)` — upserts application
- `saveContact(c)` — upserts contact
- `saveProfile(p)` — replaces profile
- `deleteApp(id)` — removes application by id
- `deleteContact(id)` — removes contact by id
- `generateId()` — stable ID generator, never change

---

## Key Components

- `AppCard` — pipeline card. Props: `app, contacts, onEdit, onStageChange, onApplyKit, onPrep, archived`. Shows 🎯 Prep button when `app.stage` is Phone Screen, Interview, or Final Round. Shows "✓ Interview prep saved" indicator when `app.prepNotes` exists.
- `PrepModal` — interview prep modal. Props: `app, onRun, onClose`. Loads saved prep on open if `app.prepNotes` exists. Generate/Regenerate button triggers `onRun`. Copy all button copies full prep text.
- `AppModal` — add/edit application. Includes all app fields.
- `ContactModal` — add/edit contact.
- `ProfileModal` — edit master profile + base resume.
- `AIResult` — reusable result box with copy button.
- `ApiKeyModal` — API key entry. Security notice: key stored locally, sent directly to Anthropic, never passes through a server.
- `ErrorBoundary` — class component; wraps each of the 5 tabs. Shows error + "Try again" on crash.
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
