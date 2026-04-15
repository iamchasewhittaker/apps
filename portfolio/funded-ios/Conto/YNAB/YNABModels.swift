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
    /// Ready to Assign (milliunits). Money not yet assigned to categories this month.
    let toBeBudgeted: Int?
    let categories: [YNABMonthCategory]

    var toBeBudgetedDollars: Double {
        guard let tbb = toBeBudgeted else { return 0 }
        return Double(tbb) / 1000.0
    }
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

// MARK: - Transactions

struct YNABTransaction: Decodable, Identifiable {
    let id: String
    let date: String
    /// Milliunits; negative = outflow from the budget.
    let amount: Int
    let payeeName: String?
    /// User or import memo (e.g. Amazon line items from enrichment).
    let memo: String?
    let categoryId: String?
    let categoryName: String?
    let deleted: Bool
    let transferAccountId: String?

    var amountDollars: Double { Double(amount) / 1000.0 }

    var parsedDate: Date? {
        let parts = date.split(separator: "-").compactMap { Int($0) }
        guard parts.count == 3 else { return nil }
        var c = DateComponents()
        c.year = parts[0]
        c.month = parts[1]
        c.day = parts[2]
        return Calendar(identifier: .gregorian).date(from: c)
    }

    var isTransfer: Bool { transferAccountId != nil }
}

struct YNABTransactionsResponse: Decodable {
    struct DataWrapper: Decodable {
        let transactions: [YNABTransaction]
    }
    let data: DataWrapper
}

// MARK: - Budget detail (for age of money)

struct YNABBudgetDetail: Decodable {
    /// Age of money in days (nil if not enough data yet).
    let ageOfMoney: Int?
    let ageOfMoneyCalculationDate: String?
}

struct YNABBudgetDetailResponse: Decodable {
    struct DataWrapper: Decodable {
        let budget: YNABBudgetDetail
    }
    let data: DataWrapper
}

// MARK: - Bulk transaction update (for category write-back)

struct YNABBulkTransactionUpdate: Encodable {
    struct TransactionPatch: Encodable {
        let id: String
        let categoryId: String
    }
    let transactions: [TransactionPatch]
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
