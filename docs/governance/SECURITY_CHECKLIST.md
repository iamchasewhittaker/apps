# Security Checklist — Per-App Pre-Launch

> Copy this checklist into each app's `LAUNCH_CHECKLIST.md` or use standalone.
> Every shipped app must pass all items before going live.

---

## Secrets & Credentials

- [ ] No hardcoded API keys, tokens, or passwords in tracked files
  - Verify: `grep -rn "API_KEY\|SECRET\|PASSWORD\|token\|sk-\|pk_" src/ --include="*.js" --include="*.jsx"`
- [ ] `.env` files listed in `.gitignore`
- [ ] Third-party API keys stored in environment variables, not source code
- [ ] Supabase anon key is the only key in client-side code (no service_role key)

## Dependencies

- [ ] `npm audit` shows 0 critical or high vulnerabilities
  - Verify: `npm audit --audit-level=high`
- [ ] No known-vulnerable packages in `package-lock.json`
- [ ] Dependencies are pinned or use lockfile (no floating `^` on critical packages)

## Data & Privacy

- [ ] No PII or financial data in tracked files
  - Verify: `grep -rn "\$[0-9]\|salary\|income\|balance\|SSN\|social security" src/ --include="*.js" --include="*.jsx"`
- [ ] localStorage keys documented in app's CLAUDE.md or root portfolio table
- [ ] Supabase RLS policies confirmed for any synced tables
- [ ] Data retention: clear what happens to user data on logout/delete

## Authentication

- [ ] Auth flow tested end-to-end (OTP send, verify, session persist, logout)
- [ ] Session persistence works across page refresh and tab close/reopen
- [ ] CORS and redirect allowlist reviewed (Supabase dashboard + Vercel env vars)
- [ ] Auth canonical origin set correctly for cross-app sessions

## Deployment

- [ ] `npm ci && npm run build` passes clean
- [ ] Vercel environment variables set for production + preview
- [ ] Live URL returns 200 and renders correctly
- [ ] No console errors on page load

## iOS-Specific (if applicable)

- [ ] No hardcoded credentials in Swift source
- [ ] Keychain used for sensitive tokens (not UserDefaults)
- [ ] App Transport Security not disabled
- [ ] Bundle identifier correct for target environment

---

## How to Run a Quick Security Scan

```bash
# From the app directory:
# 1. Secrets scan
grep -rn "API_KEY\|SECRET\|PASSWORD\|token\|sk-\|pk_\|supabase_service" src/ --include="*.js" --include="*.jsx" --include="*.swift"

# 2. PII scan
grep -rn "\$[0-9]\|salary\|income\|balance\|SSN" src/ --include="*.js" --include="*.jsx"

# 3. Dependency audit
npm audit --audit-level=high

# 4. Build check
npm ci && npm run build
```

Pass = 0 matches on scans, 0 critical/high on audit, build exits 0.
