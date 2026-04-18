import Foundation
import Observation

@Observable @MainActor
final class FleetStore {
    private(set) var ships: [Ship] = []
    private(set) var isLoading = false
    private(set) var isSignedIn = false
    var errorMessage: String?

    nonisolated init() {}

    // MARK: - Auth (Phase 2 stub)

    /// Sign in with magic link — real Supabase call goes here once supabase-swift is added.
    func signIn() {
        // TODO: replace with Supabase session check once supabase-swift package is added:
        //   isSignedIn = supabase.auth.currentSession != nil
        isSignedIn = true
        Task { await loadFleet() }
    }

    func signOut() {
        isSignedIn = false
        ships = []
        clearCache()
    }

    // MARK: - Load

    /// Phase 2: tries Supabase, falls back to cache, falls back to mock.
    func loadFleet() async {
        isLoading = true
        defer { isLoading = false }

        // 1. Try live Supabase fetch (stubbed until supabase-swift package is added).
        // TODO: uncomment once supabase-swift is added in Xcode and Config values are set:
        //   let fetched = try? await fetchFromSupabase()
        //   if let fetched { ships = fetched; saveToCache(fetched); return }
        let fetched: [Ship]? = nil  // remove this line when uncommenting above

        if let fetched {
            ships = fetched
            saveToCache(fetched)
            return
        }

        // 2. Fall back to UserDefaults cache
        if let cached = loadFromCache(), !cached.isEmpty {
            ships = cached
            return
        }

        // 3. Fall back to mock fleet
        ships = FleetStore.mockFleet
    }

    // MARK: - Supabase fetch (Phase 2 — activate after adding supabase-swift in Xcode)
    //
    // Steps to activate:
    //   1. In Xcode: File → Add Package Dependencies → https://github.com/supabase/supabase-swift
    //   2. Add SUPABASE_ANON_KEY to a gitignored Secrets.xcconfig
    //   3. Wire Secrets.xcconfig into the Shipyard target build settings
    //   4. Reference in Info.plist: SUPABASE_ANON_KEY = $(SUPABASE_ANON_KEY)
    //   5. Uncomment the import and function below, remove the nil stub above.
    //
    // import Supabase
    //
    // private func fetchFromSupabase() async throws -> [Ship] {
    //     let client = SupabaseClient(supabaseURL: Config.supabaseURL, supabaseKey: Config.supabaseAnonKey)
    //     let rows: [Ship] = try await client
    //         .from("projects")
    //         .select()
    //         .order("last_commit_date", ascending: false)
    //         .execute()
    //         .value
    //     return rows
    // }

    // MARK: - Cache

    private func saveToCache(_ fleet: [Ship]) {
        guard let data = try? JSONEncoder().encode(fleet) else { return }
        UserDefaults.standard.set(data, forKey: Config.userDefaultsKey)
    }

    private func loadFromCache() -> [Ship]? {
        guard let data = UserDefaults.standard.data(forKey: Config.userDefaultsKey),
              let fleet = try? JSONDecoder().decode([Ship].self, from: data) else { return nil }
        return fleet
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
