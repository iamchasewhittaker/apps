# Shared Login Strategy (Portfolio Apps)

## Goal

Use one canonical host for all authenticated portfolio apps so Supabase session persistence is stable and users are not repeatedly asked to sign in.

## Canonical Host Model

- Canonical origin: `https://apps.chasewhittaker.com`
- Each app gets a stable path on that origin:
  - `/hub`
  - `/ynab`
  - `/tasks`
  - `/command`
  - `/wellness`
  - `/job-search`
- All app links should target canonical URLs.
- OTP email redirects should target canonical URLs.

## Required Environment Variables

Every app should define:

- `REACT_APP_AUTH_CANONICAL_ORIGIN` (example: `https://apps.chasewhittaker.com`)
- `REACT_APP_AUTH_APP_PATH` (example: `/wellness`)
- `REACT_APP_SUPABASE_STORAGE_KEY` (optional override for session key)
- `REACT_APP_AUTH_DEBUG` (`true` to enable auth diagnostics)

## Runtime Rules

- If app is opened on a non-canonical host, redirect to canonical URL.
- Skip canonical redirect on localhost/127.0.0.1 for development.
- Use canonical app URL for Supabase OTP `emailRedirectTo`.
- Keep shared auth event logging enabled via `REACT_APP_AUTH_DEBUG=true` during rollout.

## Supabase Dashboard Alignment Checklist

For the Supabase project used by these apps:

1. Set `Site URL` to canonical origin.
2. Add redirect URLs for each canonical app path.
3. Keep local development callback URLs in allowlist.
4. Confirm JWT/session policy is not aggressively short for expected usage.

## Verification Matrix

- Refresh page: stays signed in.
- Close/reopen tab: stays signed in.
- Cross-app navigation via canonical links: stays signed in.
- Idle overnight: session refreshes without forcing sign-in.
- iOS home-screen app: OTP code flow stores session in app context.

## Linear (team Whittaker)

Track rollout and follow-ups under the portfolio umbrella project: [Portfolio monorepo migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37). Add child issues there for Supabase redirect allowlist changes or per-app Vercel env updates instead of scattering notes only in chat.
