# Architecture — Job Search HQ

## Data flow

```mermaid
flowchart LR
  UI[App.jsx + tabs]
  C[constants.js]
  LS[chase_job_search_v1]
  Key[chase_anthropic_key]
  Sync[src/sync.js]
  SB[(Supabase user_data)]
  UI --> C
  UI --> LS
  C --> Key
  LS --> Sync
  Sync --> SB
```

## Key files

| Path | Role |
|------|------|
| `src/App.jsx` | Shell — state, load/save, navigation, modals |
| `src/constants.js` | Data, `s` styles, `callClaude`, helpers |
| `src/sync.js` | `APP_KEY = job-search`, `createSync` |

## Deploy

Vercel **Root Directory:** `portfolio/job-search-hq`.
