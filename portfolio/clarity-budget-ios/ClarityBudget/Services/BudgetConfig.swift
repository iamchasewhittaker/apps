import Foundation

/// UserDefaults keys and constants for Clarity Budget.
/// Never change `storeKey` once data is on a real device.
enum BudgetConfig {
    static let storeKey = "chase_budget_ios_v1"

    /// Mirrors YNAB Clarity’s budget id storage; **Clarity Budget only** (do not reuse `chase_ynab_clarity_ios_*`).
    static let ynabBudgetIdUserDefaultsKey = "chase_budget_ios_v1_ynab_budget_id"

    static let bundleID = "com.chasewhittaker.ClarityBudget"
    static let appVersion = "0.1"
}
