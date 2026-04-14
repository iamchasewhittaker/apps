# Auth Persistence Test Results

Date: 2026-04-14

## Automated checks executed

### Build verification

- `rollertask-tycoon-web`: `npm run build` passed
- `ynab-clarity-web`: `npm run build` passed
- `clarity-hub`: `npm run build` passed
- `clarity-command`: `npm run build` passed
- `wellness-tracker`: `npm run build` passed
- `job-search-hq`: `npm run build` passed (existing lint warning in `src/tabs/FocusTab.jsx` for unused var)

### Config consistency verification

- All six apps now include canonical-host env keys in `.env.example`.
- All six apps now export and use shared `emailRedirectTo`.
- All six app auth gates now include debug instrumentation events:
  - `local_mode_no_auth`
  - `initial_session`
  - `state_change`
- Clarity Hub external links now resolve to canonical-host paths when configured.

## Manual matrix to run in production/staging

These require real deployed URLs + browser/device contexts:

1. Refresh page on each app (expect no re-login).
2. Close/reopen tab on each app (expect no re-login).
3. Navigate Hub -> YNAB/Tasks via canonical links (expect no re-login).
4. Leave app idle overnight (expect token refresh and no forced login).
5. iOS home-screen context OTP flow (expect persistent session in same context).

## Supabase alignment checklist

1. Set Site URL to canonical origin.
2. Add redirect URLs for all canonical app paths.
3. Keep localhost redirect URLs for development.
4. Confirm session/JWT settings are not too short for expected usage.
