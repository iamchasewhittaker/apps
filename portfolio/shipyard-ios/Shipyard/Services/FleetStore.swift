import Foundation
import Observation
import Supabase

@Observable @MainActor
final class FleetStore {
    private(set) var ships: [Ship] = []
    private(set) var isLoading = false
    private(set) var isSignedIn = false
    var errorMessage: String?

    private var authListenerTask: Task<Void, Never>?

    nonisolated init() {}

    // MARK: - Auth

    /// Check current session on launch; start a listener so sign-in/out updates the UI.
    func bootstrapSession() async {
        isSignedIn = (try? await SupabaseService.client.auth.session) != nil
        if isSignedIn {
            await loadFleet()
        }
        startAuthListener()
    }

    private func startAuthListener() {
        guard authListenerTask == nil else { return }
        authListenerTask = Task { [weak self] in
            for await (event, session) in SupabaseService.client.auth.authStateChanges {
                guard let self else { return }
                switch event {
                case .initialSession:
                    // Only treat initialSession as signed-in if a real session exists.
                    // Without this check, a nil initialSession fires handleSignedIn and
                    // sets isSignedIn = true with no auth token, bypassing the sign-in screen.
                    if session != nil {
                        await self.handleSignedIn()
                    }
                case .signedIn, .tokenRefreshed:
                    await self.handleSignedIn()
                case .signedOut:
                    self.handleSignedOut()
                default:
                    break
                }
            }
        }
    }

    private func handleSignedIn() async {
        isSignedIn = true
        await loadFleet()
    }

    private func handleSignedOut() {
        isSignedIn = false
        ships = []
        clearCache()
    }

    /// Sign in with email + password — matches the web app's current auth flow.
    func signIn(email: String, password: String) async throws {
        try await SupabaseService.client.auth.signIn(email: email, password: password)
    }

    func signOut() async {
        try? await SupabaseService.client.auth.signOut()
        // Belt-and-suspenders: reset state immediately so sign-in screen
        // appears even if the network call fails or the auth listener is slow.
        handleSignedOut()
    }

    // MARK: - Load

    /// Tries Supabase, falls back to cache, falls back to mock.
    func loadFleet() async {
        isLoading = true
        defer { isLoading = false }

        do {
            let fetched = try await fetchFromSupabase()
            ships = fetched
            saveToCache(fetched)
            return
        } catch {
            errorMessage = error.localizedDescription
        }

        if let cached = loadFromCache(), !cached.isEmpty {
            ships = cached
            return
        }

        ships = FleetStore.mockFleet
    }

    private func fetchFromSupabase() async throws -> [Ship] {
        try await SupabaseService.client
            .from("projects")
            .select()
            .order("last_commit_date", ascending: false)
            .execute()
            .value
    }

    // MARK: - Cache

    private func saveToCache(_ fleet: [Ship]) {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        guard let data = try? encoder.encode(fleet) else { return }
        UserDefaults.standard.set(data, forKey: Config.userDefaultsKey)
    }

    private func loadFromCache() -> [Ship]? {
        guard let data = UserDefaults.standard.data(forKey: Config.userDefaultsKey) else { return nil }
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return try? decoder.decode([Ship].self, from: data)
    }

    private func clearCache() {
        UserDefaults.standard.removeObject(forKey: Config.userDefaultsKey)
    }

    // MARK: - Grouping

    func groupedByBucket() -> [(bucket: FleetBucket, ships: [Ship])] {
        FleetBucket.allCases.compactMap { bucket in
            let filtered = ships.filter { bucket.contains($0) }
            guard !filtered.isEmpty else { return nil }
            return (bucket, filtered.sorted { ($0.days_since_commit ?? .max) < ($1.days_since_commit ?? .max) })
        }
    }

    // MARK: - Test helper

    /// Loads the mock fleet synchronously — test use only.
    func loadMockFleet() {
        ships = FleetStore.mockFleet
    }

    // MARK: - Mock data

    static let mockFleet: [Ship] = [
        Ship(
            slug: "clarity-checkin-ios",
            name: "Clarity Check-in",
            type: .ios,
            family: .clarity,
            status: .active,
            tech_stack: "SwiftUI + ClarityUI",
            mvp_step_actual: 4,
            last_commit_date: Date().addingTimeInterval(-2 * 86_400),
            days_since_commit: 2,
            has_live_url: false,
            live_url: nil,
            compliance_score: 7
        ),
        Ship(
            slug: "wellness-tracker",
            name: "Wellness Tracker",
            type: .web,
            family: .portfolio,
            status: .active,
            tech_stack: "React CRA + Supabase",
            mvp_step_actual: 5,
            last_commit_date: Date().addingTimeInterval(-5 * 86_400),
            days_since_commit: 5,
            has_live_url: true,
            live_url: "https://wellness-tracker-kappa.vercel.app",
            compliance_score: 7
        ),
        Ship(
            slug: "shipyard",
            name: "Shipyard",
            type: .web,
            family: .portfolio,
            status: .active,
            tech_stack: "Next.js 16 + Supabase",
            mvp_step_actual: 4,
            last_commit_date: Date().addingTimeInterval(-1 * 86_400),
            days_since_commit: 1,
            has_live_url: true,
            live_url: "https://shipyard.vercel.app",
            compliance_score: 7
        ),
        Ship(
            slug: "spend-clarity",
            name: "Spend Clarity",
            type: .cli,
            family: .standalone,
            status: .stalled,
            tech_stack: "Python 3 CLI",
            mvp_step_actual: 3,
            last_commit_date: Date().addingTimeInterval(-42 * 86_400),
            days_since_commit: 42,
            has_live_url: false,
            live_url: nil,
            compliance_score: 5
        ),
        Ship(
            slug: "growth-tracker",
            name: "Growth Tracker",
            type: .web,
            family: .archived,
            status: .archived,
            tech_stack: "React CRA",
            mvp_step_actual: 6,
            last_commit_date: Date().addingTimeInterval(-180 * 86_400),
            days_since_commit: 180,
            has_live_url: false,
            live_url: nil,
            compliance_score: 4
        ),
        Ship(
            slug: "clarity-ui",
            name: "ClarityUI",
            type: .library,
            family: .clarity,
            status: .active,
            tech_stack: "Swift Package",
            mvp_step_actual: 5,
            last_commit_date: Date().addingTimeInterval(-12 * 86_400),
            days_since_commit: 12,
            has_live_url: false,
            live_url: nil,
            compliance_score: 6
        ),
    ]
}

// MARK: - FleetBucket

enum FleetBucket: String, CaseIterable {
    case underConstruction = "Under Construction"
    case launched = "Launched"
    case drydock = "Drydock"
    case archived = "Archived"

    func contains(_ ship: Ship) -> Bool {
        switch self {
        case .underConstruction:
            return ship.status == .active && (ship.mvp_step_actual ?? 0) < 5
        case .launched:
            return ship.status == .active && (ship.mvp_step_actual ?? 0) >= 5
        case .drydock:
            return ship.status == .stalled || ship.status == .frozen
        case .archived:
            return ship.status == .archived
        }
    }
}
