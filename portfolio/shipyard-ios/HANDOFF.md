# Shipyard (iOS) — Handoff

## State

| Field      | Value                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------- |
| Focus      | Phase 2 complete + on-device bug fixes — sign-in, fleet load, and sign-out all verified       |
| Next       | Phase 2.5 — magic-link auth (Supabase email template + deep-link handler)                     |
| Last touch | 2026-04-20                                                                                     |

## Phase 2 Bug Fixes — 2026-04-20

Found and fixed on first device install (iPhone 12 Pro Max):

- **`.initialSession` false-positive** — `startAuthListener()` called `handleSignedIn()` for every `.initialSession` event, including when session is `nil` (user not logged in). This set `isSignedIn = true` immediately, bypassing the sign-in screen and loading mock data. Fix: check `session != nil` before calling `handleSignedIn()`.
- **Sign-out didn't stick** — `signOut()` only called `auth.signOut()`, then waited for the auth listener to fire `.signedOut`. If the network call failed or the listener was slow, `isSignedIn` never flipped. Fix: call `handleSignedOut()` directly inside `signOut()` as belt-and-suspenders after the async call.
- **Error banner added** to `FleetListView` — `store.errorMessage` now surfaces as a red banner so Supabase decode failures are visible on device rather than silently falling back to mock.

## Phase 2 — Complete (2026-04-19)

- `supabase-swift` v2.30.0 SPM dep added to `Shipyard.xcodeproj` (hand-edited `project.pbxproj` with `SY0F*` UUIDs)
- `SupabaseService` singleton — `SupabaseClient(supabaseURL:, supabaseKey:)` from `Config`
- `FleetStore.fetchFromSupabase()` — real `.from("projects").select().order("last_commit_date")` call; fallback chain preserved (Supabase → UserDefaults cache → mock)
- `FleetStore.bootstrapSession()` + `authStateChanges` listener — `isSignedIn` driven by real session state; sign-in triggers `loadFleet()`, sign-out clears
- `SignInView` — email + password UI (was stubbed magic-link); `auth.signIn(email:password:)`; inline error display
- `FleetListView` toolbar — ellipsis menu with Reload + Sign out
- `Config.supabaseAnonKey` hardcoded (matches `wellness-tracker-ios` — public `NEXT_PUBLIC_*` anon key, RLS is the security boundary)
- Cache uses ISO 8601 date encoding
- `FleetStore.loadMockFleet()` helper added so `FleetStoreTests` pass (previously called a method that didn't exist)

## Phase 2.5 — What's Next (Magic link)

1. Configure Supabase email template for magic link (dashboard → Authentication → Email Templates)
2. Register deep-link scheme `shipyard://auth/confirm` in `INFOPLIST_KEY_CFBundleURLTypes`
3. Add `.onOpenURL` handler in `ShipyardApp` → call `SupabaseService.client.auth.session(from: url)` / `exchangeCodeForSession`
4. Swap `SignInView` back to magic-link UI (email only, "Send link" button, waiting state)
5. Keep password fallback for now — useful for test accounts

## Known Limitations

- No ClarityUI dependency yet — deferred to keep pbxproj minimal
- Read-only: iOS never writes to `projects` (the web `scan-cron.sh` scanner is the writer)
- Supabase fetch not yet smoke-tested end-to-end on device (sign-in works; need to verify real data vs. mock fallback)
