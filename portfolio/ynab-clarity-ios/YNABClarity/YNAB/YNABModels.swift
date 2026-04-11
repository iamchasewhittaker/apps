import Foundation

// MARK: - Budget list

struct YNABBudgetSummary: Decodable, Identifiable {
    let id: String
    let name: String
    let lastModifiedOn: String?
}

struct YNABBudgetsResponse: Decodable {
    struct DataWrapper: Decodable {
        let budgets: [YNABBudgetSummary]
    }
    let data: DataWrapper
}

// MARK: - Category groups + categories (used during setup)

struct YNABCategoryGroup: Decodable, Identifiable {
    let id: String
    let name: String
    let hidden: Bool
    let categories: [YNABCategory]
}

struct YNABCategory: Decodable, Identifiable {
    let id: String
    let name: String
    let hidden: Bool
    let deleted: Bool
}

struct YNABCategoriesResponse: Decodable {
    struct DataWrapper: Decodable {
        let categoryGroups: [YNABCategoryGroup]
    }
    let data: DataWrapper
}

// MARK: - Monthly budget detail (category balances)

struct YNABMonthDetail: Decodable {
    let month: String
    /// Total income for the month in milliunits (divide by 1000 for dollars).
    let income: Int?
    let categories: [YNABMonthCategory]
}

struct YNABMonthCategory: Decodable, Identifiable {
    let id: String
    let name: String
    /// "Assigned" amount in milliunits (positive = money assigned this month).
    let budgeted: Int
    /// Activity in milliunits (negative = spending outflow).
    let activity: Int
    /// "Available" balance in milliunits after activity.
    let balance: Int
    let hidden: Bool
    let deleted: Bool

    /// Monthly goal amount in milliunits (nil if no goal is set).
    let goalTarget: Int?
    /// Goal type: "MF" (monthly funding), "TB" (target balance), "TBD" (target by date), etc.
    let goalType: String?
    /// YNAB's own goal completion percentage (0–100).
    let goalPercentageComplete: Int?

    var budgetedDollars: Double  { Double(budgeted)  / 1000.0 }
    var activityDollars: Double  { Double(activity)  / 1000.0 }
    var balanceDollars: Double   { Double(balance)   / 1000.0 }
    var goalTargetDollars: Double? {
        guard let gt = goalTarget else { return nil }
        return Double(gt) / 1000.0
    }
}

struct YNABMonthResponse: Decodable {
    struct DataWrapper: Decodable {
        let month: YNABMonthDetail
    }
    let data: DataWrapper
}

// MARK: - API error wrapper

struct YNABErrorResponse: Decodable {
    struct ErrorDetail: Decodable {
        let id: String
        let name: String
        let detail: String
    }
    let error: ErrorDetail
}
