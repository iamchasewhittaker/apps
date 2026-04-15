# ROADMAP — Job Search HQ iOS

## Shipped (v0.1)

- Tab shell + local persistence (web-shaped JSON)
- Pipeline & contacts CRUD (sheets)
- Focus tab (read-only daily blocks)
- More tab (profile read-only + sync copy)
- Unit tests (blob round-trip + decode fixture) — run in Xcode with signing

## Next

- Phase 2: Supabase `job-search` sync + email OTP (see `docs/SYNC_PHASE2.md`)
- Profile editor, STAR stories UI, import JSON from web backup
- AI tools + Keychain API key (deferred from v1 scope)
- CI: `xcodebuild` on simulator when bundle is provisioned, or hosted macOS runner with signing secret
