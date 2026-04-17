# Phase 2 — Supabase sync (Job Search HQ iOS)

This milestone wires the iOS app to the **same** Supabase `user_data` row semantics as the React app.

## Web reference

- [`../../job-search-hq/src/sync.js`](../../job-search-hq/src/sync.js) — `APP_KEY = 'job-search'`, `createSync(url, key, options)`
- [`../../shared/sync.js`](../../shared/sync.js) — canonical `push` / `pull` / `auth` factory (prefer **supabase-swift** with equivalent queries + RLS)

## Contract (informal)

1. **Blob:** Same top-level JSON as web: `applications`, `contacts`, `starStories`, `dailyActions`, `baseResume`, `profile`, optional `_syncAt` (ms epoch).
2. **Conflict:** Remote wins when remote `_syncAt` > local `_syncAt` after successful pull (match web `pull()` behavior).
3. **Secrets:** Anthropic API key must **never** enter the synced blob — use iOS **Keychain** when AI ships; web keeps `chase_anthropic_key` separate.
4. **Auth:** Email OTP parity with CRA (`verifyOtp` with `type: 'email'`); persist session via Supabase client.

## Implementation sketch

1. Add **Supabase** Swift package (version pinned in Xcode).
2. Add `Config.xcconfig` or build settings for `SUPABASE_URL` + `SUPABASE_ANON_KEY` (not committed; use xcconfig sample in repo if desired).
3. Implement `RemoteSync` replacing `NoOpRemoteSync` in [`JobSearchHQ/Services/RemoteSync.swift`](../JobSearchHQ/Services/RemoteSync.swift).
4. On launch after auth: `pullIfNeeded()`; on each `JobSearchStore.save()`: `push` in background with debounce.
5. UI: minimal login screen mirroring web OTP flow.

## Stub in codebase

`NoOpJobSearchRemoteSync` is the default until Phase 2 is implemented; `JobSearchStore` calls `push` after each save and `pullIfNewerThan` from `JobSearchHQApp.onAppear` (no-op until a real `JobSearchRemoteSync` is wired).

**Next:** Add `supabase-swift` SPM dependency to the Xcode project, then implement `JobSearchRemoteSync` using the same `user_data` REST contract as [`../../job-search-hq/src/sync.js`](../../job-search-hq/src/sync.js) + [`../../shared/sync.js`](../../shared/sync.js).
