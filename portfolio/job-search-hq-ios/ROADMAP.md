# ROADMAP — Job Search HQ iOS

## Shipped (v0.1)

- Tab shell + local persistence (web-shaped JSON)
- Pipeline & contacts CRUD (sheets)
- Focus tab (read-only daily blocks)
- More tab (profile read-only + sync copy)
- Unit tests (blob round-trip + decode fixture) — run in Xcode with signing
- **Brand:** `tools/generate_brand_assets.py` → `AppIcon` + `Logo.imageset`; in-app header mark in `ContentView`
- **Device QA (2026-04-15):** Debug `xcodebuild` to physical iPhone + `devicectl` install succeeded (Team `9XVT527KP3`); Springboard shows new icon after fresh install (delete old app if icon cached)

## Next

- Phase 2: Supabase `job-search` sync + email OTP (see `docs/SYNC_PHASE2.md`)
- Profile editor, STAR stories UI, import JSON from web backup
- AI tools + Keychain API key (deferred from v1 scope)
- CI: `xcodebuild` on simulator when bundle is provisioned, or hosted macOS runner with signing secret
