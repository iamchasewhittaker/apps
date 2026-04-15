import Foundation
import Supabase

/// Supabase auth + `user_data` REST upserts (matches web `sync.js`: `wellness` + `wellness-daily` app keys).
@MainActor
final class WellnessCloudSync: ObservableObject {
    private let client: SupabaseClient
    private var pushDebounceTask: Task<Void, Never>?

    @Published var sessionEmail: String?
    @Published var status: String?
    @Published var isBusy = false

    private var restUserDataURL: URL {
        WellnessSupabaseConfig.projectURL.appendingPathComponent("rest/v1/user_data")
    }

    init() {
        client = SupabaseClient(
            supabaseURL: WellnessSupabaseConfig.projectURL,
            supabaseKey: WellnessSupabaseConfig.anonKey
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
            status = "Signed in. Syncing…"
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

    /// Debounced push after local saves (matches web fire-and-forget cadence).
    func schedulePush(from store: WellnessStore) {
        pushDebounceTask?.cancel()
        pushDebounceTask = Task { [weak self] in
            try? await Task.sleep(nanoseconds: 800_000_000)
            guard let self, !Task.isCancelled else { return }
            await self.pushAll(from: store)
        }
    }

    func pullWellness(into store: WellnessStore) async {
        guard let token = try? await client.auth.session.accessToken else { return }
        do {
            var c = URLComponents(url: restUserDataURL, resolvingAgainstBaseURL: false)!
            c.queryItems = [
                URLQueryItem(name: "select", value: "data,updated_at"),
                URLQueryItem(name: "app_key", value: "eq.wellness"),
            ]
            guard let url = c.url else { return }
            var req = URLRequest(url: url)
            req.httpMethod = "GET"
            req.setValue(WellnessSupabaseConfig.anonKey, forHTTPHeaderField: "apikey")
            req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
            let (data, resp) = try await URLSession.shared.data(for: req)
            guard let http = resp as? HTTPURLResponse, (200 ... 299).contains(http.statusCode) else { return }
            let rows = try JSONSerialization.jsonObject(with: data) as? [[String: Any]] ?? []
            guard let row = rows.first,
                  let remote = row["data"] as? [String: Any],
                  let updatedAtStr = row["updated_at"] as? String else { return }
            let fmt = ISO8601DateFormatter()
            fmt.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            var remoteDate = fmt.date(from: updatedAtStr)
            if remoteDate == nil {
                fmt.formatOptions = [.withInternetDateTime]
                remoteDate = fmt.date(from: updatedAtStr)
            }
            guard let remoteDate else { return }
            let localTs = WellnessBlob.localSyncAtMs(store.blob)
            store.replaceBlobIfRemoteNewer(localSyncAt: localTs, remote: remote, remoteUpdated: remoteDate)
        } catch {
            status = "Pull failed: \(error.localizedDescription)"
        }
    }

    func pushAll(from store: WellnessStore) async {
        guard let token = try? await client.auth.session.accessToken else { return }
        let blob = store.blob
        do {
            try await restUpsert(appKey: "wellness", data: blob, accessToken: token)
            let daily = Self.wellnessDailyPayload(blob: blob, formData: store.formData)
            try await restUpsert(appKey: "wellness-daily", data: daily, accessToken: token)
        } catch {
            status = "Sync failed: \(error.localizedDescription)"
        }
    }

    private func restUpsert(appKey: String, data: [String: Any], accessToken: String) async throws {
        let user = try await client.auth.session.user
        let row: [String: Any] = [
            "user_id": user.id.uuidString,
            "app_key": appKey,
            "data": data,
        ]
        var req = URLRequest(url: restUserDataURL)
        req.httpMethod = "POST"
        req.setValue(WellnessSupabaseConfig.anonKey, forHTTPHeaderField: "apikey")
        req.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.setValue("return=minimal,resolution=merge-duplicates", forHTTPHeaderField: "Prefer")
        req.httpBody = try JSONSerialization.data(withJSONObject: [row], options: [])
        let (_, resp) = try await URLSession.shared.data(for: req)
        guard let http = resp as? HTTPURLResponse, (200 ... 299).contains(http.statusCode) else {
            throw URLError(.badServerResponse)
        }
    }

    /// Same fields as [`wellness-tracker/src/App.jsx`](../../../wellness-tracker/src/App.jsx) `push('wellness-daily', …)`.
    static func wellnessDailyPayload(blob: [String: Any], formData: [String: [String: Any]]) -> [String: Any] {
        let todayStr = WellnessBlob.jsToDateString()
        let utcDay: String = {
            var cal = Calendar(identifier: .gregorian)
            cal.timeZone = TimeZone(secondsFromGMT: 0)!
            let c = cal.dateComponents([.year, .month, .day], from: Date())
            return String(format: "%04d-%02d-%02d", c.year ?? 0, c.month ?? 0, c.day ?? 0)
        }()
        let savedMorning = blob["savedMorning"] as? String
        let savedEvening = blob["savedEvening"] as? String
        let morningDone = savedMorning == todayStr
        let eveningDone = savedEvening == todayStr
        let eod = formData["end_of_day"] ?? [:]
        let excusesEvening = eod["excusesEvening"] as? String
        let excusesMorning = formData["morning_start"]?["excusesMorning"] as? String
            ?? formData["sleep"]?["excusesMorning"] as? String
        let activityDone = activityDoneString(blob: blob, formData: formData)
        let activityPlanned = formData["morning_start"]?["activityPlanned"] as? String
        let met = morningDone && eveningDone && activityDone == "yes"
        return [
            "date": utcDay,
            "morningDone": morningDone,
            "eveningDone": eveningDone,
            "excusesMorning": excusesMorning ?? NSNull(),
            "excusesEvening": excusesEvening ?? NSNull(),
            "activityPlanned": activityPlanned ?? NSNull(),
            "activityDone": activityDone ?? NSNull(),
            "met": met,
            "_syncAt": Int64(Date().timeIntervalSince1970 * 1000),
        ]
    }

    private static func activityDoneString(blob: [String: Any], formData: [String: [String: Any]]) -> String? {
        if let v = formData["end_of_day"]?["activityDone"] as? String { return v }
        let entries = blob["entries"] as? [[String: Any]] ?? []
        let today = WellnessBlob.jsToDateString()
        guard let entry = entries.first(where: { entry in
            guard let ds = entry["date"] as? String else { return false }
            let parsed = ISO8601DateFormatter.wellness.date(from: ds)
                ?? { () -> Date? in
                    let f = ISO8601DateFormatter()
                    f.formatOptions = [.withInternetDateTime]
                    return f.date(from: ds)
                }()
            guard let parsed else { return false }
            return WellnessBlob.jsToDateString(parsed) == today
        }) else { return nil }
        let hl = entry["health_lifestyle"] as? [String: Any] ?? [:]
        let ex = hl["exercise"] as? String ?? ""
        if ex == "moderate" || ex == "heavy" { return "yes" }
        if ex == "none" { return "no" }
        return nil
    }
}
