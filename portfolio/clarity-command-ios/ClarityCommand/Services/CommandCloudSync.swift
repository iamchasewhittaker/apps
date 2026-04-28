import Combine
import Foundation
import Supabase

/// Email OTP + `user_data` upsert for `app_key = command` (same row as web Clarity Command).
@MainActor
final class CommandCloudSync: ObservableObject {
    private let client: SupabaseClient
    private var pushDebounceTask: Task<Void, Never>?

    @Published var sessionEmail: String?
    @Published var status: String?
    @Published var isBusy = false

    private var restUserDataURL: URL {
        CommandSupabaseConfig.projectURL.appendingPathComponent("rest/v1/user_data")
    }

    init() {
        client = SupabaseClient(
            supabaseURL: CommandSupabaseConfig.projectURL,
            supabaseKey: CommandSupabaseConfig.anonKey
        )
    }

    func bootstrapSession() async {
        do {
            let session = try await client.auth.session
            sessionEmail = session.user.email
        } catch {
            sessionEmail = nil
        }
    }

    func signInOtp(email: String) async {
        isBusy = true
        defer { isBusy = false }
        do {
            try await client.auth.signInWithOTP(email: email, shouldCreateUser: true)
            status = "Check your email for a sign-in code."
        } catch {
            status = error.localizedDescription
        }
    }

    func verifyOtp(email: String, token: String) async {
        isBusy = true
        defer { isBusy = false }
        do {
            try await client.auth.verifyOTP(email: email, token: token, type: .email)
            sessionEmail = email
            status = "Signed in."
        } catch {
            status = error.localizedDescription
        }
    }

    func signOut() async {
        isBusy = true
        defer { isBusy = false }
        do {
            try await client.auth.signOut()
            sessionEmail = nil
            status = "Signed out."
        } catch {
            status = error.localizedDescription
        }
    }

    func schedulePush(from store: CommandStore) {
        pushDebounceTask?.cancel()
        pushDebounceTask = Task { [weak self] in
            try? await Task.sleep(nanoseconds: 800_000_000)
            guard let self, !Task.isCancelled else { return }
            await self.push(from: store)
        }
    }

    func pull(into store: CommandStore) async {
        guard let token = try? await client.auth.session.accessToken else { return }
        do {
            if let (remoteDict, remoteDate) = try await fetchAppData(appKey: "command", token: token) {
                let remoteBlob = try Self.decodeBlob(from: remoteDict)
                store.applyRemoteBlobIfNewer(localSyncAtMs: store.blob.syncAt, remote: remoteBlob, remoteUpdated: remoteDate)
            }
        } catch {
            status = "Pull failed: \(error.localizedDescription)"
        }
        await pullCrossAppSummaries(into: store, token: token)
    }

    /// Pulls `job-search-daily` + `wellness-daily` rows in parallel and applies them to the store.
    /// RLS scopes by `auth.uid()`, so any signed-in user reads only their own rows across all app_keys.
    func pullCrossAppSummaries(into store: CommandStore, token: String? = nil) async {
        let accessToken: String
        if let token { accessToken = token }
        else if let t = try? await client.auth.session.accessToken { accessToken = t }
        else { return }

        async let jobSearch = decodedSummary(JobSearchDaily.self, appKey: "job-search-daily", token: accessToken)
        async let wellness = decodedSummary(WellnessDaily.self, appKey: "wellness-daily", token: accessToken)
        let (js, wl) = await (jobSearch, wellness)
        store.applyJobSearchDaily(js)
        store.applyWellnessDaily(wl)
    }

    private func decodedSummary<T: Decodable>(_ type: T.Type, appKey: String, token: String) async -> T? {
        do {
            guard let (dict, _) = try await fetchAppData(appKey: appKey, token: token) else { return nil }
            let data = try JSONSerialization.data(withJSONObject: dict, options: [])
            return try JSONDecoder().decode(T.self, from: data)
        } catch {
            return nil
        }
    }

    /// GETs a single `user_data` row for the given `app_key`. Returns the `data` dict + parsed `updated_at`.
    private func fetchAppData(appKey: String, token: String) async throws -> ([String: Any], Date)? {
        var c = URLComponents(url: restUserDataURL, resolvingAgainstBaseURL: false)!
        c.queryItems = [
            URLQueryItem(name: "select", value: "data,updated_at"),
            URLQueryItem(name: "app_key", value: "eq.\(appKey)"),
        ]
        guard let url = c.url else { return nil }
        var req = URLRequest(url: url)
        req.httpMethod = "GET"
        req.setValue(CommandSupabaseConfig.anonKey, forHTTPHeaderField: "apikey")
        req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        let (data, resp) = try await URLSession.shared.data(for: req)
        guard let http = resp as? HTTPURLResponse, (200 ... 299).contains(http.statusCode) else { return nil }
        let rows = try JSONSerialization.jsonObject(with: data) as? [[String: Any]] ?? []
        guard let row = rows.first,
              let remoteDict = row["data"] as? [String: Any],
              let updatedAtStr = row["updated_at"] as? String else { return nil }
        let fmt = ISO8601DateFormatter()
        fmt.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        var remoteDate = fmt.date(from: updatedAtStr)
        if remoteDate == nil {
            fmt.formatOptions = [.withInternetDateTime]
            remoteDate = fmt.date(from: updatedAtStr)
        }
        guard let remoteDate else { return nil }
        return (remoteDict, remoteDate)
    }

    func push(from store: CommandStore) async {
        guard let token = try? await client.auth.session.accessToken else { return }
        do {
            let dict = try Self.encodeBlob(store.blob)
            try await restUpsert(data: dict, accessToken: token)
        } catch {
            status = "Sync failed: \(error.localizedDescription)"
        }
    }

    private func restUpsert(data: [String: Any], accessToken: String) async throws {
        let user = try await client.auth.session.user
        let row: [String: Any] = [
            "user_id": user.id.uuidString,
            "app_key": "command",
            "data": data,
        ]
        var req = URLRequest(url: restUserDataURL)
        req.httpMethod = "POST"
        req.setValue(CommandSupabaseConfig.anonKey, forHTTPHeaderField: "apikey")
        req.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.setValue("return=minimal,resolution=merge-duplicates", forHTTPHeaderField: "Prefer")
        req.httpBody = try JSONSerialization.data(withJSONObject: [row], options: [])
        let (_, resp) = try await URLSession.shared.data(for: req)
        guard let http = resp as? HTTPURLResponse, (200 ... 299).contains(http.statusCode) else {
            throw URLError(.badServerResponse)
        }
    }

    private static func encodeBlob(_ blob: CommandBlob) throws -> [String: Any] {
        let data = try JSONEncoder().encode(blob)
        guard let obj = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
            throw URLError(.cannotParseResponse)
        }
        return obj
    }

    private static func decodeBlob(from dict: [String: Any]) throws -> CommandBlob {
        let data = try JSONSerialization.data(withJSONObject: dict, options: [])
        return try JSONDecoder().decode(CommandBlob.self, from: data)
    }
}
