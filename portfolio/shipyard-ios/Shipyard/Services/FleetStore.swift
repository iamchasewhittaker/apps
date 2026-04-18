import Foundation
import Observation

@Observable @MainActor
final class FleetStore {
    private(set) var ships: [Ship] = []

    nonisolated init() {}

    // Phase 1 — hardcoded mock fleet. Phase 2 will replace with Supabase pull.
    func loadMockFleet() {
        ships = FleetStore.mockFleet
    }

    // MARK: - Grouping

    /// Ships grouped by a display-oriented status bucket.
    /// Order: Under Construction → Launched → Drydock → Archived.
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
            tech_stack: "Next.js 15 + Supabase",
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
