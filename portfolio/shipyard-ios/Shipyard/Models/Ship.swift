import Foundation

// Mirror of web `Project` type from portfolio/shipyard/src/lib/types.ts.
// Snake_case preserved so future Supabase decode is trivial.
enum ShipType: String, Codable, CaseIterable {
    case web, ios, library, cli, desktop
}

enum ShipFamily: String, Codable, CaseIterable {
    case clarity, standalone, portfolio, archived
}

enum ShipStatus: String, Codable, CaseIterable {
    case active, stalled, frozen, archived
}

struct Ship: Codable, Identifiable, Hashable {
    var slug: String
    var name: String
    var type: ShipType
    var family: ShipFamily
    var status: ShipStatus
    var tech_stack: String?
    var mvp_step_actual: Int?
    var last_commit_date: Date?
    var days_since_commit: Int?
    var has_live_url: Bool
    var live_url: String?
    var compliance_score: Int

    var id: String { slug }
}
