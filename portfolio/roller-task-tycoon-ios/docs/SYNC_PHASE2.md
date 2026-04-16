# Phase 2 — Supabase Sync (RollerTask Tycoon iOS)

Wire the iOS app to the **same** Supabase `user_data` row the React web app already reads/writes.

## Web reference

- [`../../rollertask-tycoon-web/src/sync.js`](../../rollertask-tycoon-web/src/sync.js) — `app_key = 'rollertask'`, `createSync(url, key)`
- [`../../shared/sync.js`](../../shared/sync.js) — canonical `push` / `pull` / `auth` factory

## Contract

1. **Blob shape:** Same top-level JSON as web — `schemaVersion`, `cash`, `tasks`, `ledger`, optional `_syncAt` (ms epoch).
2. **Conflict rule:** Remote wins when remote `_syncAt` > local `_syncAt` (match web `pull()` behavior — last-write-wins by timestamp).
3. **Auth:** Email OTP parity with web (`verifyOtp` with `type: 'email'`); persist Supabase session in Keychain via the Swift SDK.
4. **Supabase project:** `unqtnnxlltiadzbqpyhh` — shared across all portfolio apps (do **not** create a new project).
5. **App key string:** `rollertask` — **do not change**; web sync depends on this exact string.
6. **RLS:** Schema + RLS already applied to `user_data` table — no SQL changes needed.

## Credentials

Supabase creds live in `.env.supabase` at repo root (gitignored). Pull them:
```bash
cd portfolio/rollertask-tycoon-web && vercel env pull --environment=production /tmp/.env.rtt.prod
```
Use `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` values; store in Xcode xcconfig (never committed).

## Implementation steps

### 1. Add Supabase Swift package
In Xcode → File → Add Package Dependency:
```
https://github.com/supabase-community/supabase-swift
```
Pin to a specific version in the Xcode package list.

### 2. Config — xcconfig (not committed)
Create `RollerTaskTycoon/Config.xcconfig` (add to `.gitignore`):
```
SUPABASE_URL = https://unqtnnxlltiadzbqpyhh.supabase.co
SUPABASE_ANON_KEY = <anon-key-from-env.supabase>
```
Reference in `Info.plist`:
```xml
<key>SUPABASE_URL</key><string>$(SUPABASE_URL)</string>
<key>SUPABASE_ANON_KEY</key><string>$(SUPABASE_ANON_KEY)</string>
```

### 3. SupabaseService.swift (new file in Data/)
```swift
import Foundation
import Supabase

actor SupabaseService {
    static let shared = SupabaseService()
    private let client: SupabaseClient

    private init() {
        let url = URL(string: Bundle.main.infoDictionary!["SUPABASE_URL"] as! String)!
        let key = Bundle.main.infoDictionary!["SUPABASE_ANON_KEY"] as! String
        client = SupabaseClient(supabaseURL: url, supabaseKey: key)
    }

    // Auth
    func sendOTP(email: String) async throws {
        try await client.auth.signInWithOTP(email: email)
    }

    func verifyOTP(email: String, token: String) async throws {
        try await client.auth.verifyOTP(email: email, token: token, type: .email)
    }

    var currentUser: User? { get async { try? await client.auth.user() } }

    func signOut() async throws { try await client.auth.signOut() }

    // Sync
    func push(blob: RollerTaskBlob) async throws {
        guard let user = await currentUser else { return }
        var b = blob
        b._syncAt = Date().millisecondsSince1970
        let row: [String: AnyJSON] = [
            "user_id": .string(user.id.uuidString),
            "app_key": .string("rollertask"),
            "data": .object(try blob.toAnyJSON()),
            "updated_at": .string(ISO8601DateFormatter().string(from: Date())),
        ]
        try await client.from("user_data")
            .upsert(row, onConflict: "user_id,app_key")
            .execute()
    }

    func pull(localSyncAt: Int64?) async throws -> RollerTaskBlob? {
        guard let user = await currentUser else { return nil }
        let result = try await client.from("user_data")
            .select("data")
            .eq("user_id", value: user.id.uuidString)
            .eq("app_key", value: "rollertask")
            .single()
            .execute()
        // Decode and compare _syncAt; return nil if local is newer
        // ... (full decode implementation)
        return nil // placeholder
    }
}
```

### 4. Auth gate in ContentView
Add an `@State var isAuthenticated = false` check before the main `TabView`. Show a simple OTP login sheet when `!isAuthenticated`.

Mirror the web OTP flow:
1. Email input → `sendOTP(email:)` → show token field
2. Token input → `verifyOTP(email:token:)` → `isAuthenticated = true`
3. On launch: check `await SupabaseService.shared.currentUser != nil`

### 5. Sync hooks in ContentView / data layer
- **On launch after auth:** call `SupabaseService.shared.pull()` → if remote `_syncAt` > local, replace in-memory blob + persist to `@AppStorage`
- **On every save:** call `SupabaseService.shared.push(blob:)` in a detached `Task` (fire-and-forget, debounced 1s)

## Stub pattern (same as Job Search HQ iOS)

Before Phase 2 is wired, no stub is strictly needed since the app is purely local. Once you add the `SupabaseService`, gate all calls behind `isAuthenticated` so local-only mode continues to work without credentials.

## Testing

1. Sign in on web (rollertask-tycoon-web.vercel.app) → add a task → verify in Supabase dashboard (`user_data` table, `app_key = 'rollertask'`)
2. Sign in on iOS with same email → verify task appears after pull
3. Add task on iOS → verify it appears on web after refresh
