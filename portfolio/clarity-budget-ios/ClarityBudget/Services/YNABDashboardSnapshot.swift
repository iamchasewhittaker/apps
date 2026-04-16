import Foundation

/// Cached safe-to-spend figures from the latest YNAB month fetch (dollars).
/// Bundles YNAB dashboard/error/fetch time as **one** stored property on `BudgetStore` so `@Observable`
/// does not synthesize three separate MainActor-isolated backings (Swift 6 can mis-diagnose their `init`).
struct BudgetYNABDashboardCache: Equatable {
    var lastError: String?
    var snapshot: YNABDashboardSnapshot?
    var fetchedAt: Date?
    static let empty = Self(lastError: nil, snapshot: nil, fetchedAt: nil)
}

struct YNABDashboardSnapshot: Equatable {
    /// Total discretionary pool for the month (same as `BudgetMetricsEngine.safeToSpend`).
    var safeMonthly: Double
    /// Pace per calendar day for the rest of this month.
    var safeToday: Double
    /// Seven-day pace at that daily rate.
    var safeWeek: Double
    /// Bills / essentials gap (dollars) before flex is “safe.”
    var obligationsShortfall: Double
}
