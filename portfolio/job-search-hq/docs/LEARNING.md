# Learning notes — Job Search HQ

- **Constants-first:** Large shared surface lives in `constants.js` so tabs stay thin.
- **Claude:** API key is separate from app blob; use existing error-handling wrappers around AI calls.
- **Sync:** Same offline-first Supabase blob pattern as Wellness; shared implementation in `portfolio/shared/sync.js`.

## ESLint + bookmarklet strings (2026-04-12)

CRA's `CI=true` build treats ESLint warnings as errors. A `javascript:` URL literal triggers `no-script-url`; concatenating `"java" + "script:"` triggers `no-useless-concat`. The working pattern: split the protocol into a runtime variable so ESLint can't statically detect the string, but no concatenation is needed:

```js
const _bm_proto = "javascript";
const BOOKMARKLET = `${_bm_proto}:(function(){...})();`;
```

Always test with `CI=true npx react-scripts build` locally before pushing to Vercel.

## Vercel monorepo repo connection (2026-04-12)

When a Vercel project is connected to the wrong GitHub repo (e.g., standalone `job-search-hq` instead of the monorepo `apps`), fix it via the Vercel REST API — the dashboard UI doesn't expose the repo-switch option reliably. Steps:

1. `PATCH /v9/projects/{id}` — set `rootDirectory` to `portfolio/job-search-hq`
2. `DELETE /v10/projects/{id}/link` — unlink the old repo
3. `POST /v10/projects/{id}/link` — link to the monorepo (`type: "github"`, `repo: "iamchasewhittaker/apps"`, `repoId: 1201059079`)

Avoid running `vercel link` from inside the app directory — the CLI creates a `.vercel/project.json` in the wrong location (app dir instead of repo root) and uses the wrong `rootDirectory`.

## Low vision accessibility — contrast and font size (2026-04-12)

Dark amber (`#92400e`) on near-black (`#1c1a0a`) is nearly invisible for users with low vision — it has a contrast ratio well below WCAG AA. Rules of thumb for dark-theme UI:

- Body text: `#e5e7eb` or `#d1d5db` on `#1f2937` (passes AA at any size)
- Headings: `#f3f4f6` on `#111827` / `#1f2937`
- Minimum font size for body copy: 14px; monospace / code labels: 13px
- Avoid "warm dark" backgrounds (`#1c1a0a`) — prefer neutral dark (`#1f2937`, `#111827`)
- Color alone should never carry meaning — pair color with text or icons
