# Learning notes — Job Search HQ

- **Constants-first:** Large shared surface lives in `constants.js` so tabs stay thin.
- **Claude:** API key is separate from app blob; use existing error-handling wrappers around AI calls.
- **Sync:** Same offline-first Supabase blob pattern as Wellness; shared implementation in `portfolio/shared/sync.js`.
